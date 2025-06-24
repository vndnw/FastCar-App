package com.example.Backend.dto.response;

import com.example.Backend.model.enums.CarStatus;
import com.example.Backend.model.enums.CarTransmission;
import com.example.Backend.model.enums.CarType;
import com.example.Backend.model.enums.FuelType;
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
public class CarDetailsResponse {
    private long id;
    private UserResponse user;
    private String name;
    private CarBrandResponse carBrand;
    private String model;
    private int year;
    private int seats;
    private CarTransmission transmission;
    private CarType carType;
    private String licensePlate;
    private BigDecimal pricePerHour;
    private BigDecimal pricePer4Hour;
    private BigDecimal pricePer8Hour;
    private BigDecimal pricePer12Hour;
    private BigDecimal pricePer24Hour;
    private FuelType fuelType;
    private String fuelConsumption;//  fuel_consumption/100km
    private CarStatus status;
    private String color;
    private String description;
    private List<CarImageResponse> images;
    private List<CarFeatureResponse> features;
    private LocationResponse location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
