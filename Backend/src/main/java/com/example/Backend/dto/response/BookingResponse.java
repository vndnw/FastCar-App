package com.example.Backend.dto.response;

import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.BookingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class BookingResponse {
    private long id;
    private UserResponse user;
    private DriverResponse driver;
    private CarResponse car;    private String pickupLocation;
    private LocalDateTime pickupTime;
    private LocalDateTime returnTime;
    private BookingType type;
    private BookingStatus status;    private double price;
    private String discountCode;
    private LocalDateTime createdAt;
}
