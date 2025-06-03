package com.example.Backend.service;

import com.example.Backend.dto.request.CarFirstCreateRequest;
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

    public CarResponse createCar(CarFirstCreateRequest carFirstCreateRequest) {
        Car car = Car.builder()
                .carBrand(carFirstCreateRequest.getCarBrand())
                .name(carFirstCreateRequest.getName())
                .model(carFirstCreateRequest.getModel())
                .description(carFirstCreateRequest.getDescription())
                .licensePlate(carFirstCreateRequest.getLicensePlate())
                .fuelType(carFirstCreateRequest.getFuelType())
                .capacity(carFirstCreateRequest.getCapacity())
                .status(carFirstCreateRequest.getStatus())
                .imageUrl(carFirstCreateRequest.getImageUrl())
                .build();
        return carMapper.mapToResponse(carRepository.save(car));
    }

    public CarResponse updateCar(long carId, CarFirstCreateRequest carFirstCreateRequest) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        car.setCarBrand(carFirstCreateRequest.getCarBrand());
        car.setName(carFirstCreateRequest.getName());
        car.setModel(carFirstCreateRequest.getModel());
        car.setDescription(carFirstCreateRequest.getDescription());
        car.setLicensePlate(carFirstCreateRequest.getLicensePlate());
        car.setFuelType(carFirstCreateRequest.getFuelType());
        car.setCapacity(carFirstCreateRequest.getCapacity());
        car.setStatus(carFirstCreateRequest.getStatus());
        car.setImageUrl(carFirstCreateRequest.getImageUrl());
        return carMapper.mapToResponse(carRepository.save(car));
    }

    public void deleteCar(long carId) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        carRepository.delete(car);
    }

    public CarResponse getCarById(long carId) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        return carMapper.mapToResponse(car);
    }

    public Page<CarResponse> getAllCars(Pageable pageable) {
        Page<Car> cars = carRepository.findAll(pageable);
        return cars.map(car -> carMapper.mapToResponse(car));
    }
}
