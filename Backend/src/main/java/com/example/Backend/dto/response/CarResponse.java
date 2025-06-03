package com.example.Backend.dto.response;

import com.example.Backend.model.enums.FuelType;
import com.example.Backend.model.enums.CarStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarResponse {
    private long id;
    private String name;
    private String model;
    private CarBrandResponse carBrand;
    private String licensePlate;
    private int capacity;
    private FuelType fuelType;
    private CarStatus status;    private String description;
    private List<String> imageUrl;
    private double basePrice; // Base price per day for the car
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
