package com.example.Backend.dto.request;

import com.example.Backend.model.CarBrand;
import com.example.Backend.model.enums.FuelType;
import com.example.Backend.model.enums.VehicleStatus;
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
public class CarRequest {
    private String name;
    private String model;
    private CarBrand carBrand;
    private String licensePlate;
    private int capacity;
    private FuelType fuelType;
    private VehicleStatus status;
    private String description;
    private List<String> imageUrl;
}
