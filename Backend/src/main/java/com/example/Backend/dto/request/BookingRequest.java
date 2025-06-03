package com.example.Backend.dto.request;

import com.example.Backend.model.enums.BookingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long carId;
    private Long driverId; // Optional - only required for booking with driver
    private String pickupLocation;
    private LocalDateTime pickupTime;
    private LocalDateTime endTime;
    private BookingType type;
    private String description;
    private double price; // Expected price for the booking
}
