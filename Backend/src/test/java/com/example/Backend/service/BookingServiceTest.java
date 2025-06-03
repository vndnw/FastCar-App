package com.example.Backend.service;

import com.example.Backend.dto.request.BookingRequest;
import com.example.Backend.model.Booking;
import com.example.Backend.model.Car;
import com.example.Backend.model.User;
import com.example.Backend.model.Driver;
import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.BookingType;
import com.example.Backend.repository.BookingRepository;
import com.example.Backend.repository.CarRepository;
import com.example.Backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private CarRepository carRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private Car testCar;
    private Booking testBooking;
    private BookingRequest bookingRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        
        // Setup test car
        testCar = new Car();
        testCar.setId(1L);
        testCar.setName("Test Car");
        
        // Setup test booking
        testBooking = new Booking();
        testBooking.setId(1L);
        testBooking.setUser(testUser);
        testBooking.setCar(testCar);
        testBooking.setPickupTime(LocalDateTime.now().plusDays(1));
        testBooking.setStatus(BookingStatus.PENDING);
        testBooking.setType(BookingType.VEHICLE);
        
        // Setup booking request
        bookingRequest = new BookingRequest();
        bookingRequest.setCarId(1L);
        bookingRequest.setPickupTime(LocalDateTime.now().plusDays(1));
        bookingRequest.setPickupLocation("Test Location");
        bookingRequest.setType(BookingType.VEHICLE);
        
        // Setup security context
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        
        // Setup repositories
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);
    }

    @Test
    void isCarAvailable_ShouldReturnTrue_WhenNoOverlappingBookings() {
        // Given
        LocalDateTime startDate = LocalDateTime.now().plusDays(1);
        LocalDateTime endDate = LocalDateTime.now().plusDays(2);
        
        when(bookingRepository.findOverlappingBookings(1L, startDate, endDate))
            .thenReturn(Collections.emptyList());
            
        // When
        boolean result = bookingService.isCarAvailable(1L, startDate, endDate);
        
        // Then
        assertTrue(result);
        verify(bookingRepository).findOverlappingBookings(eq(1L), eq(startDate), eq(endDate));
    }
    
    @Test
    void isCarAvailable_ShouldReturnFalse_WhenOverlappingBookingsExist() {
        // Given
        LocalDateTime startDate = LocalDateTime.now().plusDays(1);
        LocalDateTime endDate = LocalDateTime.now().plusDays(2);
        
        when(bookingRepository.findOverlappingBookings(1L, startDate, endDate))
            .thenReturn(Collections.singletonList(testBooking));
            
        // When
        boolean result = bookingService.isCarAvailable(1L, startDate, endDate);
        
        // Then
        assertFalse(result);
        verify(bookingRepository).findOverlappingBookings(eq(1L), eq(startDate), eq(endDate));
    }
}
