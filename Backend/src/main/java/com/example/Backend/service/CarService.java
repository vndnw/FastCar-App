package com.example.Backend.service;

import com.example.Backend.dto.request.CarRequest;
import com.example.Backend.dto.response.CarResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarMapper;
import com.example.Backend.model.Car;
import com.example.Backend.repository.CarRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final CarMapper carMapper;

    public CarService(CarRepository carRepository, CarMapper carMapper) {
        this.carRepository = carRepository;
        this.carMapper = carMapper;
    }

    public CarResponse createCar(CarRequest carRequest) {
        Car car = Car.builder()
                .carBrand(carRequest.getCarBrand())
                .name(carRequest.getName())
                .model(carRequest.getModel())
                .description(carRequest.getDescription())
                .licensePlate(carRequest.getLicensePlate())
                .fuelType(carRequest.getFuelType())
                .capacity(carRequest.getCapacity())
                .status(carRequest.getStatus())
                .basePrice(carRequest.getBasePrice())
                .imageUrl(carRequest.getImageUrl())
                .build();
        return carMapper.mapToResponse(carRepository.save(car));
    }

    public CarResponse updateCar(long carId, CarRequest carRequest) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        car.setCarBrand(carRequest.getCarBrand());
        car.setName(carRequest.getName());
        car.setModel(carRequest.getModel());
        car.setDescription(carRequest.getDescription());
        car.setLicensePlate(carRequest.getLicensePlate());
        car.setFuelType(carRequest.getFuelType());
        car.setCapacity(carRequest.getCapacity());
        car.setStatus(carRequest.getStatus());
        car.setBasePrice(carRequest.getBasePrice());
        car.setImageUrl(carRequest.getImageUrl());
        return carMapper.mapToResponse(carRepository.save(car));
    }

    public void deleteCar(long carId) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        carRepository.delete(car);
    }

    public CarResponse getCarById(long carId) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        return carMapper.mapToResponse(car);
    }

    public Page<CarResponse> getAllCars(Pageable pageable) {
        Page<Car> cars = carRepository.findAll(pageable);
        return cars.map(car -> carMapper.mapToResponse(car));
    }
}
