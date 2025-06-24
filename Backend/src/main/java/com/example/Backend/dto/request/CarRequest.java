package com.example.Backend.dto.request;

import com.example.Backend.model.enums.CarTransmission;
import com.example.Backend.model.enums.CarType;
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
    private int year;
    private int seats;
    private CarTransmission transmission; // Assuming this is a string representation of CarTransmission enum
    private CarType type;
    private long carBrandId;
    private FuelType fuelType;
    private String color;
    private LocationRequest location;
    private List<CarImageRequest> carImages;
    private List<Long> carFeatures;
    private String licensePlate;
    private String fuelConsumption;
    private double pricePerHour;
    private double pricePer4Hour;
    private double pricePer8Hour;
    private double pricePer12Hour;
    private double pricePer24Hour;
    private String description;
}
