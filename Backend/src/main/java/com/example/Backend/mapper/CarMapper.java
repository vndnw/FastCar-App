package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarResponse;
import com.example.Backend.model.Car;
import org.springframework.stereotype.Service;

@Service
public class CarMapper {
    private final CarBrandMapper carBrandMapper;

    public CarMapper(CarBrandMapper carBrandMapper) {
        this.carBrandMapper = carBrandMapper;
    }

    public CarResponse mapToResponse(Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .model(car.getModel())
                .name(car.getName())
                .carBrand(carBrandMapper.mapToResponse(car.getCarBrand()))
                .description(car.getDescription())
                .status(car.getStatus())
                .capacity(car.getCapacity())
                .imageUrl(car.getImageUrl())
                .fuelType(car.getFuelType())
                .licensePlate(car.getLicensePlate())
                .createdAt(car.getCreatedAt())
                .updatedAt(car.getUpdatedAt())
                .build();
    }
}
