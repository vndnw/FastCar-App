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
import com.example.Backend.repository.BookingRepository;
import com.example.Backend.repository.CarRepository;
import com.example.Backend.repository.DriverRepository;
import com.example.Backend.repository.UserRepository;
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

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final BookingMapper bookingMapper;

    @Autowired
    public BookingService(
            BookingRepository bookingRepository,
            CarRepository carRepository,
            UserRepository userRepository,
            DriverRepository driverRepository,
            BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.bookingMapper = bookingMapper;
    }    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // Validate request
        if (request.getCarId() == null) {
            throw new BookingException("Car ID is required");
        }
        
        if (request.getPickupTime() == null) {
            throw new BookingException("Pickup time is required");
        }
        
        if (request.getPickupLocation() == null || request.getPickupLocation().trim().isEmpty()) {
            throw new BookingException("Pickup location is required");
        }
        
        if (request.getType() == null) {
            throw new BookingException("Booking type is required");
        }
        
        if (request.getPickupTime().isBefore(LocalDateTime.now())) {
            throw new BookingException("Pickup time must be in the future");
        }
        
        // Get current authenticated user
        User currentUser = getCurrentUser();

        // Get car
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with ID: " + request.getCarId()));

        // Check if car is available for the requested time period
        LocalDateTime endTime = request.getPickupTime().plusHours(24); // Assume 24 hour booking
        validateCarAvailability(car.getId(), request.getPickupTime(), endTime);

        // Get driver if booking type is DRIVER
        Driver driver = null;
        if (request.getType() == BookingType.DRIVER) {
            if (request.getDriverId() == null) {
                throw new BookingException("Driver ID is required for driver bookings");
            }
            
            driver = driverRepository.findById(request.getDriverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + request.getDriverId()));
        }

        // Calculate price if not provided or validate the provided price
        double calculatedPrice = calculatePrice(car, request.getType(), driver);
        double finalPrice = request.getPrice() > 0 ? request.getPrice() : calculatedPrice;

        // Create and save booking
        Booking booking = Booking.builder()
                .user(currentUser)
                .car(car)
                .driver(driver)
                .pickupLocation(request.getPickupLocation())
                .pickupTime(request.getPickupTime())
                .type(request.getType())
                .status(BookingStatus.PENDING) // Default status is PENDING
                .price(finalPrice)
                .description(request.getDescription())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return bookingMapper.mapToResponse(savedBooking);
    }
    
    // Helper method to calculate booking price
    private double calculatePrice(Car car, BookingType type, Driver driver) {
        // This is a simple pricing model - in a real application, this would be more complex
        double basePrice = 50.0; // Base price per day
        
        // Add premium for luxury cars (you can add more complex logic based on car properties)
        if (car.getCarBrand() != null && 
            (car.getCarBrand().getName().equalsIgnoreCase("Mercedes") || 
             car.getCarBrand().getName().equalsIgnoreCase("BMW") ||
             car.getCarBrand().getName().equalsIgnoreCase("Audi"))) {
            basePrice *= 1.5; // 50% premium for luxury brands
        }
        
        // Add driver cost if applicable
        if (type == BookingType.DRIVER && driver != null) {
            basePrice += 30.0; // Additional cost for driver
        }
        
        return basePrice;
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));        // Security check: only the booking user or admins can view the booking
        User currentUser = getCurrentUser();
        if (currentUser.getId() != booking.getUser().getId() && !isAdmin(currentUser)) {
            throw new AccessDeniedException("You are not authorized to view this booking");
        }

        return bookingMapper.mapToResponse(booking);
    }    public Page<BookingResponse> getUserBookings(Pageable pageable) {
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
    }    public Page<BookingResponse> getBookingsByStatus(BookingStatus status, Pageable pageable) {
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
        }        if (newStatus == BookingStatus.CANCELLED && 
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
        }

        booking.setStatus(newStatus);
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
        validateCancellation(booking);
        
        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        
        // Add cancellation reason to description
        String updatedDescription = booking.getDescription();
        if (cancellationReason != null && !cancellationReason.trim().isEmpty()) {
            updatedDescription = (updatedDescription == null ? "" : updatedDescription + "\n\n") 
                + "Cancellation reason: " + cancellationReason;
            booking.setDescription(updatedDescription);
        }
        
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
    private void validateCarAvailability(Long carId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(carId, startDate, endDate);
        if (!overlappingBookings.isEmpty()) {
            throw new BookingException("Car is not available for the selected time period");
        }
    }
    
    /**
     * Public method to check if a car is available for booking
     * @param carId car ID to check
     * @param startDate desired start date
     * @param endDate desired end date
     * @return true if car is available, false otherwise
     */
    public boolean isCarAvailable(Long carId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(carId, startDate, endDate);
        return overlappingBookings.isEmpty();
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
}
