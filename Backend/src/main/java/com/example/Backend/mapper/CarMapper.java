package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarDetailsResponse;
import com.example.Backend.dto.response.CarResponse;
import com.example.Backend.model.Car;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CarMapper {
    private final CarBrandMapper carBrandMapper;
    private final ImageMapper imageMapper;
    private final LocationMapper locationMapper;
    private final FeatureMapper featureMapper;


    public CarMapper(CarBrandMapper carBrandMapper,
                     ImageMapper imageMapper,
                     LocationMapper locationMapper,
                     FeatureMapper featureMapper) {
        this.carBrandMapper = carBrandMapper;
        this.imageMapper = imageMapper;
        this.locationMapper = locationMapper;
        this.featureMapper = featureMapper;
    }

    public CarResponse mapToResponse(@NotNull Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .emailOwner(car.getUser().getEmail())
                .model(car.getModel())
                .year(car.getYear())
                .name(car.getName())
                .carType(car.getCarType())
                .carBrand(carBrandMapper.mapToResponse(car.getBrand()))
                .color(car.getColor())
                .licensePlate(String.valueOf(car.getLicensePlate()))
                .fuelType(car.getFuelType())
                .description(car.getDescription())
                .images(car.getImages() == null ? null : car.getImages().stream().map(imageMapper::mapToResponse).collect(Collectors.toList()))
                .location(locationMapper.mapToResponse(car.getLocation()))
                .features(car.getFeatures().stream().map(featureMapper::mapToResponse).collect(Collectors.toList()))
                .seats(car.getSeats())
                .fuelConsumption(car.getFuelConsumption())
                .pricePer4Hour(car.getPricePer4Hour())
                .pricePer8Hour(car.getPricePer8Hour())
                .pricePer12Hour(car.getPricePer12Hour())
                .pricePer24Hour(car.getPricePer24Hour())
                .pricePerHour(car.getPricePerHour())
                .transmission(car.getTransmission())
                .status(car.getStatus())
                .createdAt(car.getCreatedAt())
                .updatedAt(car.getUpdatedAt())
                .build();
    }
}
