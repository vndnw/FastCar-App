package com.example.Backend.dto.request;

import com.example.Backend.model.CarBrand;
import com.example.Backend.model.enums.CarTransmission;
import com.example.Backend.model.enums.FuelType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarSecondCreateRequest {
    private String licensePlate;
    private BigDecimal pricePerHour;
    private BigDecimal pricePer4Hour;
    private BigDecimal pricePer8Hour;
    private BigDecimal pricePer12Hour;
    private BigDecimal pricePer24Hour;
    private String description;
    private BigDecimal penaltyLateReturn;
}
