package com.example.Backend.service;

import com.example.Backend.dto.request.CarRequest;
import com.example.Backend.dto.request.CarSearchCriteriaRequest;
import com.example.Backend.dto.response.CarResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarMapper;
import com.example.Backend.model.*;
import com.example.Backend.model.enums.CarStatus;
import com.example.Backend.repository.*;
import com.example.Backend.repository.specification.CarSpecification;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {
    private final CarRepository carRepository;
    private final CarMapper carMapper;
    private final CarBrandRepository carBrandRepository;
    private final FeatureService featureService;
    private final LocationService locationService;
    private final UserRepository userRepository;
    private final UserService userService;

    public CarService(CarRepository carRepository,
                      CarMapper carMapper,
                      CarBrandRepository carBrandRepository,
                      FeatureService featureService,
                      LocationService locationService,
                      UserRepository userRepository,
                      UserService userService) {
        this.carRepository = carRepository;
        this.carMapper = carMapper;
        this.carBrandRepository = carBrandRepository;
        this.featureService = featureService;
        this.locationService = locationService;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public CarResponse createCar(long userId, @NotNull CarRequest carRequest) {
        Car car = new Car();
        car.setUser(userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found")));
        car.setName(carRequest.getName().trim());
        car.setBrand(carBrandRepository.findById(carRequest.getCarBrandId()).orElseThrow(() -> new ResourceNotFoundException("Car Brand Not Found")));
        car.setModel(carRequest.getModel());
        car.setColor(carRequest.getColor());
        car.setYear(carRequest.getYear());
        car.setSeats(carRequest.getSeats());
        car.setTransmission(carRequest.getTransmission());
        car.setCarType(carRequest.getType());
        car.setFuelType(carRequest.getFuelType());
        car.setFeatures(carRequest.getCarFeatures().stream().map(featureService::getCarFeatureById).toList());
        car.setLicensePlate(carRequest.getLicensePlate().trim());
        car.setFuelConsumption(carRequest.getFuelConsumption().trim());
        car.setPricePerHour(BigDecimal.valueOf(carRequest.getPricePerHour()));
        car.setPricePer4Hour(BigDecimal.valueOf(carRequest.getPricePer4Hour()));
        car.setPricePer8Hour(BigDecimal.valueOf(carRequest.getPricePer8Hour()));
        car.setPricePer12Hour(BigDecimal.valueOf(carRequest.getPricePer12Hour()));
        car.setPricePer24Hour(BigDecimal.valueOf(carRequest.getPricePer24Hour()));
        car.setDescription(carRequest.getDescription());
        car.setActive(false);
        car.setStatus(CarStatus.PENDING);
        if(carRequest.getCarImages() != null) {
            List<Image> images = carRequest.getCarImages().stream()
                    .map(image -> {
                        Image carImage = new Image();
                        carImage.setImageUrl(image.getImageUrl());
                        carImage.setCar(car);
                        return carImage;
                    })
                    .toList();
            car.setImages(images);
        }
        else {
            car.setImages(List.of());
        }
        car.setLocation(locationService.checkLocation(carRequest.getLocation()));

        userService.addRoleToUser(userId, "owner");

        return carMapper.mapToResponse(carRepository.save(car));
    }

    public CarResponse updateCar(long carId, @NotNull CarRequest carRequest) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        car.setName(carRequest.getName());
        car.setBrand(carBrandRepository.findById(carRequest.getCarBrandId()).orElseThrow(() -> new ResourceNotFoundException("Car Brand Not Found")));
        car.setModel(carRequest.getModel());
        car.setColor(carRequest.getColor());
        car.setYear(carRequest.getYear());
        car.setSeats(carRequest.getSeats());
        car.setTransmission(carRequest.getTransmission());
        car.setCarType(carRequest.getType());
        car.setFuelType(carRequest.getFuelType());
        car.setFeatures(carRequest.getCarFeatures().stream().map(featureService::getCarFeatureById).collect(Collectors.toList()));
        car.setLicensePlate(carRequest.getLicensePlate());
        car.setFuelConsumption(carRequest.getFuelConsumption());
        car.setPricePerHour(BigDecimal.valueOf(carRequest.getPricePerHour()));
        car.setPricePer4Hour(BigDecimal.valueOf(carRequest.getPricePer4Hour()));
        car.setPricePer8Hour(BigDecimal.valueOf(carRequest.getPricePer8Hour()));
        car.setPricePer12Hour(BigDecimal.valueOf(carRequest.getPricePer12Hour()));
        car.setPricePer24Hour(BigDecimal.valueOf(carRequest.getPricePer24Hour()));
        car.setDescription(carRequest.getDescription());
        if (carRequest.getCarImages() != null) {
            List<Image> images = carRequest.getCarImages().stream()
                    .map(image -> {
                        Image carImage = new Image();
                        carImage.setImageUrl(image.getImageUrl());
                        carImage.setCar(car);
                        return carImage;
                    })
                    .toList();
            car.getImages().clear();
            car.getImages().addAll(images);
        }
        car.setLocation(locationService.checkLocation(carRequest.getLocation()));
        return carMapper.mapToResponse(carRepository.save(car));
    }

    public void deleteCar(long carId) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        carRepository.delete(car);
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

    public boolean activeCar(@NotNull Car car) {
        if (car.isActive()) {
            return false; // Car is already active
        }
        boolean hasInactive = car.getDocuments().stream().anyMatch(doc -> !doc.isActive());
        if (hasInactive) {
            throw new RuntimeException("Cannot activate car with inactive documents");
        }
        car.setActive(true);
        carRepository.save(car);
        return true; // Car is now active
    }

    public boolean updateStatus(long carId, CarStatus status) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        if (car.getStatus() == status) {
            return false;
        }
        car.setStatus(status);
        if (status == CarStatus.AVAILABLE) {
            if (!activeCar(car)) {
                throw new RuntimeException("Cannot activate car with inactive documents");
            }
        } else if (status == CarStatus.UNAVAILABLE) {
            car.setActive(false);
        }
        carRepository.save(car);
        return true;
    }

    public Page<CarResponse> searchCars(CarSearchCriteriaRequest criteria, Pageable pageable) {
        Specification<Car> spec = CarSpecification.findByCriteria(criteria);
        Page<Car> carPage = carRepository.findAll(spec, pageable);
        return carPage.map(carMapper::mapToResponse);
    }
}
