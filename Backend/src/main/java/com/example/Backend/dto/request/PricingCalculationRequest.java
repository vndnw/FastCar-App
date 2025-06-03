package com.example.Backend.dto.request;

import com.example.Backend.model.enums.BookingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingCalculationRequest {    private Long carId;
    private LocalDateTime pickupTime;
    private LocalDateTime returnTime;
    private BookingType type;
    private String discountCode;
}
