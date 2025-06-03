package com.example.Backend.service;

import com.example.Backend.dto.request.BookingRequest;
import com.example.Backend.dto.request.BookingStatusUpdateRequest;
import com.example.Backend.dto.response.BookingResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.BookingMapper;
import com.example.Backend.model.Booking;
import com.example.Backend.model.Car;
import com.example.Backend.model.Driver;
import com.example.Backend.model.User;
import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.BookingType;
import com.example.Backend.model.enums.DriverStatus;
import com.example.Backend.repository.*;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final DiscountRepository discountRepository;
    private final BookingMapper bookingMapper;

    @Autowired
    public BookingService(
            BookingRepository bookingRepository,
            CarRepository carRepository,
            UserRepository userRepository,
            DriverRepository driverRepository,
            DiscountRepository discountRepository,
            BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.discountRepository = discountRepository;
        this.bookingMapper = bookingMapper;
    }

    @Transactional
//    public BookingResponse createBooking(BookingRequest request) {        // Validate request
//        if (request.getCarId() == null) {
//            throw new BookingException("Car ID is required");
//        }
//
//        if (request.getPickupTime() == null) {
//            throw new BookingException("Pickup time is required");
//        }
//
////        if (request.getPickupLocation() == null || request.getPickupLocation().trim().isEmpty()) {
////            throw new BookingException("Pickup location is required");
////        }
//
//        if (request.getType() == null) {
//            throw new BookingException("Booking type is required");
//        }
//
//        if (request.getPickupTime().isBefore(LocalDateTime.now())) {
//            throw new BookingException("Pickup time must be in the future");
//        }        // Validate returnTime if provided
//        if (request.getReturnTime() != null && request.getReturnTime().isBefore(request.getPickupTime())) {
//            throw new BookingException("Return time must be after pickup time");
//        }        // If returnTime not provided, default to 24 hours after pickup
//        if (request.getReturnTime() == null) {
//            request.setReturnTime(request.getPickupTime().plusHours(24));
//        }
//
//        // Get current authenticated user
//        User currentUser = getCurrentUser();        // Get car
//        Car car = carRepository.findById(request.getCarId())
//                .orElseThrow(() -> new ResourceNotFoundException("Car not found with ID: " + request.getCarId()));        // Check if car is available for the requested time period
//        validateCarAvailability(car.getId(), request.getPickupTime(), request.getReturnTime());        // Get driver if booking type is DRIVER
//        Driver driver = null;
//        if (request.getType() == BookingType.DRIVER) {
//            // Auto-assign an available driver with no scheduling conflicts
//            driver = findAvailableDriver(request.getPickupTime(), request.getReturnTime());
//
//            if (driver == null) {
//                throw new BookingException("No available drivers found for the selected time period. Please try different dates.");
//            }
//
//            // Note: We no longer set driver status to busy globally
//            // Their availability will be checked for each specific time period instead
//        }        // Calculate price based on car details, booking type, time period and discount code
//        double finalPrice = calculatePrice(
//                car,
//                request.getType(),
//                request.getPickupTime(),
//                request.getReturnTime(),
//                request.getDiscountCode()
//        );        // Create and save booking with system-calculated price
//        Booking booking = Booking.builder()
//                .user(currentUser)
//                .car(car)
//                .driver(driver)
//                .pickupLocation(request.getPickupLocation())
//                .pickupTime(request.getPickupTime())
//                .returnTime(request.getReturnTime())
//                .type(request.getType())
//                .status(BookingStatus.PENDING) // Default status is PENDING
//                .price(finalPrice) // Using server-calculated price
//                .discountCode(request.getDiscountCode())
//                .build();
//
//        Booking savedBooking = bookingRepository.save(booking);
//        return bookingMapper.mapToResponse(savedBooking);
//    }    // Helper method to calculate booking price

    //tính toán theo giá khác chứ đâu phải tính theo giá basic này được
//    private double calculatePrice(Car car, BookingType type, LocalDateTime pickupTime, LocalDateTime returnTime, String discountCode) {
//        // Get base price per day from car or use default if not set
//        double basePrice = car.getBasePrice() > 0 ? car.getBasePrice() : 50.0;
//
//        // Calculate rental duration in days
//        long durationDays = 1; // Default to 1 day
//        if (pickupTime != null && returnTime != null) {
//            // Calculate days between pickup and return time (rounded up)
//            long durationHours = java.time.Duration.between(pickupTime, returnTime).toHours();
//            durationDays = (durationHours + 23) / 24; // Round up to the nearest day
//            if (durationDays < 1) {
//                durationDays = 1; // Minimum one day charge
//            }
//        }
//        // Apply duration-based pricing - simply multiply base price by number of days
//        basePrice *= durationDays;
//
//        // Ensure the price is not negative
//        return Math.max(0, basePrice);
//    }

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

    public Page<BookingResponse> getBookingsByStatus(BookingStatus status, Pageable pageable) {
        // Only admins should access filtered bookings
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new AccessDeniedException("Not authorized to filter all bookings");
        }

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

    @Transactional
    public BookingResponse updateBookingStatus(Long id, BookingStatusUpdateRequest request) {
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

        if (newStatus == BookingStatus.COMPLETED && booking.getStatus() != BookingStatus.CONFIRMED) {
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
    private void validateCancellation(Booking booking) {
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

    /**
     * Public method to check if a car is available for booking
     *
     * @param carId      car ID to check
     * @param pickupDate desired pickup date
     * @param returnDate desired return date
     * @return true if car is available, false otherwise
     */
    public boolean isCarAvailable(Long carId, LocalDateTime pickupDate, LocalDateTime returnDate) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(carId, pickupDate, returnDate);
        return overlappingBookings.isEmpty();
    }    /**
     * Find an available driver with no booking conflicts for the given time period
     * 
     * @param pickupTime the pickup time of the booking
     * @param returnTime the return time of the booking
     * @return an available driver or null if none is available
     */
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
    private boolean isAdmin(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("admin"));
    }

    /**
     * Public method to calculate price for testing purposes
     */

//    public double calculatePriceForTest(Car car, BookingType type, LocalDateTime pickupTime, LocalDateTime returnTime, String discountCode) {
//        return calculatePrice(car, type, pickupTime, returnTime, discountCode);
//    }
    /**
     * This method previously released a driver when a booking was cancelled or completed.
     * Since we now manage driver availability through booking time periods rather than
     * global status, we no longer need to "release" drivers from bookings.
     * 
     * Note: We keep this method to maintain backward compatibility with existing code.
     * 
     * @param driver the driver to release (no action is taken)
     */
    private void releaseDriver(Driver driver) {
        // No action needed - driver availability is now determined by checking their booking schedule
        // rather than setting a global "busy" status
    }
}
