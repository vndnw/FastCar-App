package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.BookingRequest;
import com.example.Backend.dto.request.BookingStatusUpdateRequest;
import com.example.Backend.dto.request.CancellationRequest;

import java.time.LocalDateTime;

import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ResponseData<?>> createBooking(@RequestBody BookingRequest request) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.CREATED.value())
                .message("Booking created successfully")
                .data(bookingService.createBooking(request))
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<?>> getBookingById(@PathVariable Long id) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Booking retrieved successfully")
                .data(bookingService.getBookingById(id))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ResponseData<?>> getUserBookings(
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("User bookings retrieved successfully")
                .data(bookingService.getUserBookings(pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/my-bookings/status/{status}")
    public ResponseEntity<ResponseData<?>> getUserBookingsByStatus(
            @PathVariable BookingStatus status) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("User bookings with status " + status + " retrieved successfully")
                .data(bookingService.getUserBookingsByStatus(status))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/my-bookings/upcoming")
    public ResponseEntity<ResponseData<?>> getUpcomingBookings() {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Upcoming bookings retrieved successfully")
                .data(bookingService.getUpcomingUserBookings())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ResponseData<?>> getAllBookings(
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("All bookings retrieved successfully")
                .data(bookingService.getAllBookings(pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ResponseData<?>> getBookingsByStatus(
            @PathVariable BookingStatus status,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Bookings with status " + status + " retrieved successfully")
                .data(bookingService.getBookingsByStatus(status, pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponseData<?>> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateRequest request) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Booking status updated successfully")
                .data(bookingService.updateBookingStatus(id, request))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ResponseData<?>> cancelBooking(
            @PathVariable Long id,
            @RequestBody CancellationRequest request) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Booking cancelled successfully")
                .data(bookingService.cancelBooking(id, request.getReason()))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/check-availability")
    public ResponseEntity<ResponseData<?>> checkCarAvailability(
            @RequestParam Long carId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        boolean isAvailable = bookingService.isCarAvailable(carId, startDate, endDate);

        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Car availability checked successfully")
                .data(isAvailable)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<ResponseData<?>> getBookingsByCarId(
            @PathVariable Long carId,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Car bookings retrieved successfully")
                .data(bookingService.getBookingsByCarId(carId, pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
