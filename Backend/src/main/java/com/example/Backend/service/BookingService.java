package com.example.Backend.service;

import com.example.Backend.dto.request.BookingRequest;
import com.example.Backend.dto.response.BookingResponse;
import com.example.Backend.model.Booking;
import com.example.Backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public BookingResponse createBooking(BookingRequest bookingRequest) {
        Booking booking = new Booking();

    }

}
