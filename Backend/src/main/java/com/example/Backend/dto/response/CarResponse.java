package com.example.Backend.dto.response;

import com.example.Backend.model.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarResponse {
    private long id;
    private String username;
    private String name;
    private CarBrandResponse carBrand;
    private int seats;
    private CarTransmission transmission;
    private BigDecimal pricePerHour;
    private BigDecimal pricePer4Hour;
    private BigDecimal pricePer8Hour;
    private BigDecimal pricePer12Hour;
    private BigDecimal pricePer24Hour;
    private FuelType fuelType;
    private String fuelConsumption;
    private List<ImageResponse> images;
    private String location;
}
