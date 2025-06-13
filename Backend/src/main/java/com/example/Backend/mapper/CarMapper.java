package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarResponse;
import com.example.Backend.model.Car;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CarMapper {
    private final CarBrandMapper carBrandMapper;
    private final CarImageMapper carImageMapper;
    private final LocationMapper locationMapper;


    public CarMapper(CarBrandMapper carBrandMapper, CarImageMapper carImageMapper, LocationMapper locationMapper) {
        this.carBrandMapper = carBrandMapper;
        this.carImageMapper = carImageMapper;
        this.locationMapper = locationMapper;
    }

    public CarResponse mapToResponse(Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .username(car.getUser().getFirstName() + " " + car.getUser().getLastName())
                .model(car.getModel())
                .year(car.getYear())
                .name(car.getName())
                .carType(car.getCarType())
                .carBrand(carBrandMapper.mapToResponse(car.getCarBrand()))
                .color(car.getColor())
                .licensePlate(String.valueOf(car.getLicensePlate()))
                .fuelType(car.getFuelType())
                .description(car.getDescription())
                .images(car.getImages().stream().map(carImageMapper::mapToResponse).collect(Collectors.toList()))
                .location(locationMapper.mapToResponse(car.getLocation()))
//                .features(car.getFeatures().stream().map(feature -> feature.getId()).collect(Collectors.toList()))
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
