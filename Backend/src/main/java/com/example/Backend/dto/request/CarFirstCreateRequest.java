package com.example.Backend.dto.request;

import com.example.Backend.model.CarBrand;
import com.example.Backend.model.enums.FuelType;
import com.example.Backend.model.enums.CarStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarFirstCreateRequest {
    private String name;
    private String model;
    private CarBrand carBrand;
    private String licensePlate;
    private int capacity;
    private FuelType fuelType;
    private CarStatus status;
    private String description;
    private List<String> imageUrl;
}
