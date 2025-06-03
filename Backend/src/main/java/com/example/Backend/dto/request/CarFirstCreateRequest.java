package com.example.Backend.dto.request;

import com.example.Backend.model.CarBrand;
import com.example.Backend.model.enums.CarTransmission;
import com.example.Backend.model.enums.FuelType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarFirstCreateRequest {
    private String name;
    private CarBrand carBrand;
    private String model;
    private int year;
    private int seats;
    private CarTransmission transmission;
    private FuelType fuelType;
    private String color;
    private String fuelConsumption;
}
