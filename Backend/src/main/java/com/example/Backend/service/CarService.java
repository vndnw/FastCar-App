package com.example.Backend.service;

import com.example.Backend.dto.request.CarRequest;
import com.example.Backend.dto.response.CarResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarMapper;
import com.example.Backend.model.*;
import com.example.Backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final CarMapper carMapper;
    private final CarBrandRepository carBrandRepository;
    private final CarFeatureService  carFeatureService;
    private final LocationService locationService;
    private final CarImageService carImageService;
    private final UserRepository userRepository;

    public CarService(CarRepository carRepository,
                      CarMapper carMapper,
                      CarBrandRepository carBrandRepository,
                      CarFeatureService carFeatureService,
                      LocationService locationService,
                      CarImageService carImageService,
                      UserRepository userRepository) {
        this.carRepository = carRepository;
        this.carMapper = carMapper;
        this.carBrandRepository = carBrandRepository;
        this.carFeatureService = carFeatureService;
        this.locationService = locationService;
        this.carImageService = carImageService;
        this.userRepository = userRepository;
    }

    public CarResponse createCar(long userId, CarRequest carRequest) {
        Car car = new Car();
        car.setUser(userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found")));
        car.setName(carRequest.getName().trim());
        car.setCarBrand(carBrandRepository.findById(carRequest.getCarBrandId()).orElseThrow(() -> new ResourceNotFoundException("Car Brand Not Found")));
        car.setModel(carRequest.getModel());
        car.setColor(carRequest.getColor());
        car.setYear(carRequest.getYear());
        car.setSeats(carRequest.getSeats());
        car.setTransmission(carRequest.getTransmission());
        car.setCarType(carRequest.getType());
        car.setFuelType(carRequest.getFuelType());
        car.setFeatures(carRequest.getCarFeatures().stream().map(carFeatureService::getCarFeatureById).toList());
        car.setLicensePlate(carRequest.getLicensePlate().trim());
        car.setFuelConsumption(carRequest.getFuelConsumption().trim());
        car.setPricePerHour(BigDecimal.valueOf(carRequest.getPricePerHour()));
        car.setPricePer4Hour(BigDecimal.valueOf(carRequest.getPricePer4Hour()));
        car.setPricePer8Hour(BigDecimal.valueOf(carRequest.getPricePer8Hour()));
        car.setPricePer12Hour(BigDecimal.valueOf(carRequest.getPricePer12Hour()));
        car.setPricePer24Hour(BigDecimal.valueOf(carRequest.getPricePer24Hour()));
        car.setDescription(carRequest.getDescription());
        car.setActive(false);
        List<CarImage> carImages = carRequest.getCarImages().stream()
                .map( image -> {
                    CarImage carImage = new CarImage();
                    carImage.setImageUrl(image.getImageUrl());
                    carImage.setImageType(image.getImageType());
                    carImage.setCar(car);
                    return carImage;
                })
                .toList();
        car.setImages(carImages);
        car.setLocation(locationService.checkLocation(carRequest.getLocation()));
        return carMapper.mapToResponse(carRepository.save(car));
    }

    public CarResponse updateCar(long carId, CarRequest carRequest) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        car.setName(carRequest.getName());
        car.setCarBrand(carBrandRepository.findById(carRequest.getCarBrandId()).orElseThrow(() -> new ResourceNotFoundException("Car Brand Not Found")));
        car.setModel(carRequest.getModel());
        car.setColor(carRequest.getColor());
        car.setYear(carRequest.getYear());
        car.setSeats(carRequest.getSeats());
        car.setTransmission(carRequest.getTransmission());
        car.setCarType(carRequest.getType());
        car.setFuelType(carRequest.getFuelType());
        car.setLocation(locationService.checkLocation(carRequest.getLocation()));
        car.setFeatures(carRequest.getCarFeatures().stream().map(carFeatureService::getCarFeatureById).collect(Collectors.toList()));
        car.setLicensePlate(carRequest.getLicensePlate());
        car.setFuelConsumption(carRequest.getFuelConsumption());
        car.setPricePerHour(BigDecimal.valueOf(carRequest.getPricePerHour()));
        car.setPricePer4Hour(BigDecimal.valueOf(carRequest.getPricePer4Hour()));
        car.setPricePer8Hour(BigDecimal.valueOf(carRequest.getPricePer8Hour()));
        car.setPricePer12Hour(BigDecimal.valueOf(carRequest.getPricePer12Hour()));
        car.setPricePer24Hour(BigDecimal.valueOf(carRequest.getPricePer24Hour()));
        car.setDescription(carRequest.getDescription());
        List<CarImage> carImages = carRequest.getCarImages().stream()
                .map(image -> {
                    CarImage carImage = new CarImage();
                    carImage.setImageUrl(image.getImageUrl());
                    carImage.setImageType(image.getImageType());
                    carImage.setCar(car);
                    return carImage;
                })
                .toList();
        car.getImages().clear();
        car.setImages(carImages);
        car.setLocation(locationService.checkLocation(carRequest.getLocation()));
        return carMapper.mapToResponse(carRepository.save(car));
    }

    public void deleteCar(long carId) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        carRepository.delete(car);
    }

    public CarResponse getCarByUserId(long userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));
        return carMapper.mapToResponse(carRepository.findCarByUser(user));
    }

    public List<CarResponse> getAllCarsByUserId(long userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));
        List<Car> cars = carRepository.findCarsByUser(user);
        return cars.stream().map(carMapper::mapToResponse).collect(Collectors.toList());
    }

    public CarResponse getCarById(long carId) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        return carMapper.mapToResponse(car);
    }

    public Page<CarResponse> getAllCars(Pageable pageable) {
        Page<Car> cars = carRepository.findAll(pageable);
        return cars.map(carMapper::mapToResponse);
    }

    public boolean activeCar(long carId) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        if (car.isActive()) {
            return false; // Car is already active
        }
        List<Document> document = car.getDocuments();
        boolean hasInactive = car.getDocuments().stream().anyMatch(doc -> !doc.isActive());
        if (hasInactive) {
            throw new RuntimeException("Cannot activate car with inactive documents");
        }
        car.setActive(true);
        carRepository.save(car);
        return true; // Car is now active
    }
}
