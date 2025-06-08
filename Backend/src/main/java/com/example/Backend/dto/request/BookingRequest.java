package com.example.Backend.dto.request;

import com.example.Backend.model.Location;
import com.example.Backend.model.enums.BookingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long carId;//có thể dùng nếu thích
    private BookingType type;
    private LocationRequest pickupLocation;
    private LocalDateTime pickupTime;
    private LocalDateTime returnTime; // Return time for calculating rental duration
    private String discountCode; // Added for applying discount codes
    private String description; // Added for additional booking details
}
