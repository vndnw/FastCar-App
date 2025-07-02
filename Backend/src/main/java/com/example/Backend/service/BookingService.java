package com.example.Backend.service;

import com.example.Backend.dto.request.*;
import com.example.Backend.dto.response.*;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.BookingMapper;
import com.example.Backend.model.*;
import com.example.Backend.model.enums.*;
import com.example.Backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.Backend.exception.BookingException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final BookingMapper bookingMapper;
    private final DiscountService discountService;
    private final LocationService locationService;
    private final PaymentService paymentService;
    private final CarConditionCheckService carConditionCheckService;
    private final VNPAYService vnpayService;
    private final EmailService emailService;
    private final DocumentService documentService;

    @Autowired
    public BookingService(
            BookingRepository bookingRepository,
            CarRepository carRepository,
            UserRepository userRepository,
            DriverRepository driverRepository,
            BookingMapper bookingMapper,
            DiscountService discountService,
            LocationService locationService,
            PaymentService paymentService,
            CarConditionCheckService carConditionCheckService,
            VNPAYService vnpayService, EmailService emailService,
            DocumentService documentService) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.bookingMapper = bookingMapper;
        this.discountService = discountService;
        this.locationService = locationService;
        this.paymentService = paymentService;
        this.carConditionCheckService = carConditionCheckService;
        this.vnpayService = vnpayService;
        this.emailService = emailService;
        this.documentService = documentService;
    }

    public ReservationFeeResponse createBookingIsLogin(HttpServletRequest request, BookingRequest bookingRequest) {
        User currentUser = getCurrentUser();
        if(documentService.checkIfDocumentExistsByUserAndType(currentUser, DocumentType.CCCD)){
            throw new BookingException("You must upload your CCCD before booking a car.");
        }
        BookingResponse bookingResponse = addBooking(currentUser , bookingRequest);
        Payment payment = paymentService.addPayment(bookingResponse.getId(), PaymentRequest.builder()
                .amount(bookingResponse.getReservationFee())
                .type(PaymentType.RESERVED)
                .build());
        String paymentUrl = vnpayService.generatePayUrl(request, payment.getAmount(),payment.getExternalRef());
        return ReservationFeeResponse.builder()
                .bookingId(bookingResponse.getId())
                .transactionCode(payment.getExternalRef())
                .reservationFee(payment.getAmount())
                .paymentUrl(paymentUrl)
                .build();
    }
    public ReservationFeeResponse createBooking(HttpServletRequest request, long userId ,BookingRequest bookingRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        if(!documentService.checkIfDocumentExistsByUserAndType(user, DocumentType.CCCD)){
            throw new BookingException("You must upload your CCCD before booking a car.");
        }
        BookingResponse bookingResponse = addBooking(user, bookingRequest);
        Payment payment = paymentService.addPayment(bookingResponse.getId(), PaymentRequest.builder()
                .amount(bookingResponse.getReservationFee())
                .type(PaymentType.RESERVED)
                .build());
        String paymentUrl = vnpayService.generatePayUrl(request, payment.getAmount(),payment.getExternalRef());
        return ReservationFeeResponse.builder()
                .bookingId(bookingResponse.getId())
                .transactionCode(payment.getExternalRef())
                .reservationFee(payment.getAmount())
                .paymentUrl(paymentUrl)
                .build();
    }
    public RentalFeeResponse createCheckin(long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(()-> new ResourceNotFoundException("Booking not found"));
        Payment paymentRental = paymentService.addPayment(booking.getId(), PaymentRequest.builder()
                .amount(booking.getRentalPrice())
                .type(PaymentType.RENTAL)
                .build());
        Payment paymentDeposit = paymentService.addPayment(booking.getId(), PaymentRequest.builder()
                .amount(booking.getDepositAmount().subtract(booking.getReservationFee()))
                .type(PaymentType.DEPOSIT)
                .build());
        List<Long> transactionIds = List.of(paymentRental.getId(), paymentDeposit.getId());

        emailService.sendMailCheckIn(booking);

        String paymentUrl = vnpayService.generatePayUrl(null, paymentRental.getAmount().add(paymentDeposit.getAmount()), paymentRental.getExternalRef());

        return RentalFeeResponse.builder()
                .rentalFee(paymentRental.getAmount())
                .depositFee(paymentDeposit.getAmount())
                .totalFee(paymentDeposit.getAmount().add(paymentRental.getAmount()))
                .bookingId(booking.getId())
                .transactionId(transactionIds)
                .paymentUrl(paymentUrl) // Placeholder URL, replace with actual payment URL
                .build();
    }

    public BookingResponse createCheckout(long bookingId, @NotNull CheckoutRequest checkoutRequest) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if(checkoutRequest.getCarConditionCheck() != null) {
            carConditionCheckService.createCarConditionCheck(bookingId, checkoutRequest.getCarConditionCheck());
        }

        BigDecimal depositAmount = booking.getDepositAmount();
        List<ExtraChargeRequest> extraCharges = checkoutRequest.getExtraCharges();
        BigDecimal totalExtraCharges = extraCharges.stream().map(ExtraChargeRequest::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalRefunded = depositAmount.subtract(totalExtraCharges);

        int compare = totalRefunded.compareTo(BigDecimal.ZERO);
        if (compare == 0) {
            booking.setStatus(BookingStatus.COMPLETED);
        } else if (compare > 0) {
            booking.setStatus(BookingStatus.WAITING_REFUND);
            paymentService.addPayment(booking.getId(), PaymentRequest.builder()
                    .amount(totalRefunded)
                    .type(PaymentType.REFUND)
                    .build());
        } else {
            booking.setStatus(BookingStatus.WAITING_EXTRA_CHARGE);
            paymentService.addPayment(booking.getId(), PaymentRequest.builder()
                    .amount(totalExtraCharges.negate()) // Negative amount for extra charges
                    .type(PaymentType.EXTRA_CHARGE)
                    .extraChargeRequest(extraCharges)
                    .build());
        }

        booking.setTotalExtraCharges(totalExtraCharges);
        booking.setTotalRefunded(totalRefunded);

        emailService.sendMailCheckOut(booking);

        return bookingMapper.mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponse addBooking(User user ,@NotNull BookingRequest bookingRequest) {
        Car car = carRepository.findById(bookingRequest.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with ID: " + bookingRequest.getCarId()));

        validateCarAvailability(car.getId(), bookingRequest.getPickupTime(), bookingRequest.getReturnTime());

        BigDecimal rentalPrice = calculatePriceCar(car, bookingRequest.getPickupTime(), bookingRequest.getReturnTime());// ✅ Tổng giá thuê xe
        BigDecimal reservationFee = BigDecimal.valueOf(500000); // ✅ Phí giữ chỗ 500K
        BigDecimal depositAmount = car.getCarType().getDefaultDepositAmount();  // ✅ Số tiền cọc (tạm tính)
        BigDecimal totalDiscount = calculateDiscount(rentalPrice, bookingRequest.getDiscountCode());// ✅ Tổng số tiền giảm giá (nếu có)
        BigDecimal totalExtraCharges = BigDecimal.ZERO; // ✅ Tổng phụ thu (nếu có)
        BigDecimal totalRefunded = BigDecimal.ZERO; // ✅ Tổng số tiền đã hoàn trả (nếu có)

        Booking booking = Booking.builder()
                .user(user)
                .car(car)
                .pickupLocation(locationService.checkLocation(bookingRequest.getPickupLocation()))
                .pickupTime(bookingRequest.getPickupTime())
                .returnTime(bookingRequest.getReturnTime())
                .bookingCode(generateBookingCode())
                .discountCode(bookingRequest.getDiscountCode())
                .type(bookingRequest.getType())
                .rentalPrice(rentalPrice)
                .reservationFee(reservationFee)
                .depositAmount(depositAmount)
                .totalDiscount(totalDiscount)
                .totalExtraCharges(totalExtraCharges)
                .totalExtraCharges(totalExtraCharges)
                .totalRefunded(totalRefunded)
                .status(BookingStatus.PENDING)
                .description(bookingRequest.getDescription())
                .build();
        return bookingMapper.mapToResponse(bookingRepository.save(booking));
    }

    private BigDecimal calculatePriceCar(Car car, LocalDateTime pickupTime, LocalDateTime returnTime) {
        Duration duration = Duration.between(pickupTime, returnTime);
        long hours = duration.toHours();

        BigDecimal totalPrice = BigDecimal.ZERO;

        while (hours > 0) {
            if (hours >= 24) {
                totalPrice = totalPrice.add(car.getPricePer24Hour());
                hours -= 24; // Reduce by 24 hours
            } else if (hours >= 12) {
                totalPrice = totalPrice.add(car.getPricePer12Hour());
                hours -= 12; // Reduce by 12 hours
            }else if (hours >= 8) {
                totalPrice = totalPrice.add(car.getPricePer8Hour());
                hours -= 8;
            } else if (hours >= 4) {
                totalPrice = totalPrice.add(car.getPricePer4Hour());
                hours -= 4;
            } else {
                totalPrice = totalPrice.add(car.getPricePerHour());
                hours -= 1; // Reduce by 1 hour
            }
        }
        return totalPrice;
    }

    private BigDecimal calculateDiscount(BigDecimal price,String discountCode) {
        if (discountCode.isEmpty()) {
            return BigDecimal.ZERO;
        }

        int percentDiscount = discountService.useDiscount(discountCode.toUpperCase());

        BigDecimal discountAmount = price.multiply(BigDecimal.valueOf(percentDiscount / 100));
        return discountAmount.min(price);
    }

    @NotNull
    private String generateBookingCode() {
        return "BOOKFC-" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(); // Simple example, replace with better logic if needed
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));        // Security check: only the booking user or admins can view the booking
        User currentUser = getCurrentUser();
        if (currentUser.getId() != booking.getUser().getId() && !isAdmin(currentUser)) {
            throw new AccessDeniedException("You are not authorized to view this booking");
        }

        return bookingMapper.mapToResponse(booking);
    }

    public Page<BookingResponse> getUserBookings(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Booking> bookings = bookingRepository.findByUserId(currentUser.getId(), pageable);
        return bookings.map(bookingMapper::mapToResponse);
    }

    public Page<BookingResponse> getUserBookingsNow(Pageable pageable) {
        User currentUser = getCurrentUser();
        // Find all confirmed bookings that are currently active
        Page<Booking> bookings = bookingRepository.findByUserIdAndStatusNotAndStatusNot(currentUser.getId(), BookingStatus.COMPLETED, BookingStatus.CANCELLED, pageable);
        return bookings.map(bookingMapper::mapToResponse);
    }

    public List<BookingResponse> getUserBookingsByStatus(BookingStatus status) {
        User currentUser = getCurrentUser();
        List<Booking> bookings = bookingRepository.findByUserIdAndStatus(currentUser.getId(), status);
        return bookings.stream()
                .map(bookingMapper::mapToResponse)
                .toList();
    }

    public List<BookingResponse> getUpcomingUserBookings() {
        User currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();

        // Find all confirmed bookings that haven't started yet
        List<Booking> bookings = bookingRepository.findByUserIdAndStatus(currentUser.getId(), BookingStatus.CONFIRMED)
                .stream()
                .filter(booking -> booking.getPickupTime().isAfter(now))
                .sorted((b1, b2) -> b1.getPickupTime().compareTo(b2.getPickupTime()))
                .toList();

        return bookings.stream()
                .map(bookingMapper::mapToResponse)
                .toList();
    }

    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        // Only admins should access all bookings
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new AccessDeniedException("Not authorized to view all bookings");
        }

        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return bookings.map(bookingMapper::mapToResponse);
    }

    public List<CarBookingScheduleResponse> getCarBookingSchedule(Long carId) {
        carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with ID: " + carId));
        List<Booking> bookings = bookingRepository.findByCarId(carId);
        return bookings.stream()
                .map(b -> new CarBookingScheduleResponse(b.getPickupTime(), b.getReturnTime()))
                .toList();
    }

    public Page<BookingResponse> getBookingsByStatus(BookingStatus status, Pageable pageable) {
        // Only admins should access filtered bookings
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new AccessDeniedException("Not authorized to filter all bookings");
        }

        //cái này làm đéo gì trong khi m đã phân quêền cho người dùng rồi

        Page<Booking> bookings = bookingRepository.findByStatus(status, pageable);
        return bookings.map(bookingMapper::mapToResponse);
    }

    public Page<BookingResponse> getBookingsByCarId(Long carId, Pageable pageable) {
        // Verify car exists
        carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with ID: " + carId));

        Page<Booking> bookings = bookingRepository.findByCarId(carId, pageable);
        return bookings.map(bookingMapper::mapToResponse);
    }

    public Page<BookingResponse> getBookingsByUserId(Long userId, Pageable pageable) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Page<Booking> bookings = bookingRepository.findByUserId(userId, pageable);
        return bookings.map(bookingMapper::mapToResponse);
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long id, @NotNull BookingStatusUpdateRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        User currentUser = getCurrentUser();
        BookingStatus newStatus = request.getStatus();

        // Security checks
        if ((newStatus == BookingStatus.CONFIRMED || newStatus == BookingStatus.COMPLETED) && !isAdmin(currentUser)) {
            throw new AccessDeniedException("Not authorized to change booking status to " + newStatus);
        }
        if (newStatus == BookingStatus.CANCELLED &&
                currentUser.getId() != booking.getUser().getId() &&
                !isAdmin(currentUser)) {
            throw new AccessDeniedException("Not authorized to cancel this booking");
        }

        // Business logic checks
        if (newStatus == BookingStatus.CANCELLED) {
            validateCancellation(booking);
        }

        if (newStatus == BookingStatus.COMPLETED && booking.getStatus() != BookingStatus.USE_IN) {
            throw new BookingException("Only confirmed bookings can be marked as completed");
        }        booking.setStatus(newStatus);
        
        // We no longer need to "release" drivers since we're managing availability through bookings
        // rather than global driver status
        
        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.mapToResponse(updatedBooking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, String cancellationReason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        User currentUser = getCurrentUser();
        // Security check
        if (currentUser.getId() != booking.getUser().getId() && !isAdmin(currentUser)) {
            throw new AccessDeniedException("Not authorized to cancel this booking");
        }

        // Validate cancellation
        validateCancellation(booking);        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);

        // Note: We've removed the description field, so cancellation reason will not be stored
        // You might want to add this information to a separate table or system if needed

        // We no longer need to "release" drivers since we're managing availability through bookings
        // rather than global driver status

        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.mapToResponse(updatedBooking);
    }

    // Helper method to validate if a booking can be cancelled
    private void validateCancellation(@NotNull Booking booking) {
        // Cannot cancel a booking that's already completed
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BookingException("Cannot cancel a completed booking");
        }

        // Cannot cancel a booking that's already cancelled
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingException("Booking is already cancelled");
        }

        // Check if it's too late to cancel (for example, less than 24 hours before pickup)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime cancellationDeadline = booking.getPickupTime().minusHours(24);

        if (now.isAfter(cancellationDeadline)) {
            // You might want to still allow cancellation but with a penalty or warning
            // For this example, we'll just add a warning in the response
            // In a real application, you might charge a cancellation fee
            // throw new BookingException("Cancellation is not allowed within 24 hours of pickup time");
            // For now, we'll allow late cancellations
        }
    }// Helper method to check car availability

    private void validateCarAvailability(Long carId, LocalDateTime pickupDate, LocalDateTime returnDate) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(carId, pickupDate, returnDate);
        if (!overlappingBookings.isEmpty()) {
            throw new BookingException("Car is not available for the selected time period");
        }
    }

    public boolean isCarAvailable(Long carId, LocalDateTime pickupDate, LocalDateTime returnDate) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(carId, pickupDate, returnDate);
        return overlappingBookings.isEmpty();
    }

    @Nullable
    private Driver findAvailableDriver(LocalDateTime pickupTime, LocalDateTime returnTime) {
        // Get all active drivers with "available" status in the system
        List<Driver> availableDrivers = driverRepository.findAvailableDrivers();
        
        if (availableDrivers.isEmpty()) {
            return null;
        }
        
        // Find a driver with no scheduling conflicts during the requested time period
        for (Driver driver : availableDrivers) {
            // Check if driver has any overlapping bookings during the requested time period
            List<Booking> overlappingBookings = bookingRepository.findDriverOverlappingBookings(
                    driver.getId(), pickupTime, returnTime);
            
            // If no overlapping bookings found, this driver is available for this specific time period
            if (overlappingBookings.isEmpty()) {
                return driver;
            }
        }
        
        return null;
    }

    // Helper method to get current user from security context
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    // Helper method to check if user has admin role
    private boolean isAdmin(@NotNull User user) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("admin"));
    }

//    private void releaseDriver(Driver driver) {
//        // No action needed - driver availability is now determined by checking their booking schedule
//        // rather than setting a global "busy" status
//    }




}
