package com.example.Backend.dto.request;

import com.example.Backend.model.enums.FuelType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarRequest {
    private String name;
    private String model;
    private long carBrandId;
    private FuelType fuelType;
    private String color;
    private LocationRequest location;
    private List<CarImageRequest> carImages;
    private List<Long> carFeatures;
    private String licensePlate;
    private String fuelConsumption;//  fuel_consumption/100km
    private BigDecimal pricePerHour;
    private BigDecimal pricePer4Hour;
    private BigDecimal pricePer8Hour;
    private BigDecimal pricePer12Hour;
    private BigDecimal pricePer24Hour;
    private String description;
    private BigDecimal penaltyLateReturn;
}
