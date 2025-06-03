package com.example.Backend.dto.request;

import com.example.Backend.model.Location;
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
    private BookingType type;
    private Location pickupLocation;
    private LocalDateTime pickupTime;
    private LocalDateTime returnTime; // Return time for calculating rental duration
    private String discountCode; // Added for applying discount codes
}
