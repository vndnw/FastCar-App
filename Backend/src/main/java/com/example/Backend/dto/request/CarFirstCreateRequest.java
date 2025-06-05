package com.example.Backend.dto.request;

import com.example.Backend.model.CarBrand;
import com.example.Backend.model.enums.FuelType;
import com.example.Backend.model.enums.CarStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Locale;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarFirstCreateRequest {
    private String name;
    private String model;
    private long carBrandId;
    private FuelType fuelType;
    private String color;
    private LocationRequest location;
}
