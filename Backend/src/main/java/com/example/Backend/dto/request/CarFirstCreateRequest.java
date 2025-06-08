package com.example.Backend.dto.request;

import com.example.Backend.model.enums.CarType;
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
    private String model;
    private long carBrandId;
    private FuelType fuelType;
    private String color;
    private CarType type;
    private LocationRequest location;
}
