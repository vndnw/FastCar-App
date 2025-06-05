package com.example.Backend.service;

import com.example.Backend.dto.request.CarFirstCreateRequest;
import com.example.Backend.dto.request.CarRequest;
import com.example.Backend.dto.request.CarSecondCreateRequest;
import com.example.Backend.dto.response.CarResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarMapper;
import com.example.Backend.model.Car;
import com.example.Backend.model.CarBrand;
import com.example.Backend.model.Location;
import com.example.Backend.model.User;
import com.example.Backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    // khởi tạo lần đầu cơ bản cho car sau đó chúng ta sẽ update thêm thông tin cho nó
    public CarResponse createCarBasic(long uesrId , CarFirstCreateRequest carFirstCreateRequest) {
        Car car = Car.builder()
                .user(userRepository.findById(uesrId).orElseThrow(() -> new ResourceNotFoundException("User not found")))
                .name(carFirstCreateRequest.getName())
                .model(carFirstCreateRequest.getModel())
                .carBrand(carBrandRepository.findById(carFirstCreateRequest.getCarBrandId()).orElseThrow(() -> new ResourceNotFoundException("Car Brand Not Found")))
                .color(carFirstCreateRequest.getColor())
                .fuelType(carFirstCreateRequest.getFuelType())
                .location(locationService.checkLocation(carFirstCreateRequest.getLocation()))
                .build();
        return carMapper.mapToResponse(carRepository.save(car));
    }
    //  bổ sung đầy đủ thông của car
    public CarResponse createCompleteCar(long carId , CarSecondCreateRequest carSecondCreateRequest) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car Not Found"));

        car.setImages(carSecondCreateRequest.getCarImages().stream().map(image -> carImageService.checkCarImage(car, image)).collect(Collectors.toList()));
        car.setFeatures(carSecondCreateRequest.getCarFeatures().stream().map(carFeatureService::getCarFeatureById).collect(Collectors.toList()));
        car.setLicensePlate(carSecondCreateRequest.getLicensePlate());
        car.setFuelConsumption(carSecondCreateRequest.getFuelConsumption());
        car.setPricePerHour(carSecondCreateRequest.getPricePerHour());
        car.setPricePer4Hour(carSecondCreateRequest.getPricePer4Hour());
        car.setPricePer8Hour(carSecondCreateRequest.getPricePer8Hour());
        car.setPricePer12Hour(carSecondCreateRequest.getPricePer12Hour());
        car.setPricePer24Hour(carSecondCreateRequest.getPricePer24Hour());
        car.setDescription(carSecondCreateRequest.getDescription());
        car.getPenaltyLateReturn().add(carSecondCreateRequest.getPenaltyLateReturn());
        return carMapper.mapToResponse(carRepository.save(car));
    }

    public CarResponse updateCar(long carId, CarRequest carRequest) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        car.setName(carRequest.getName());
        car.setCarBrand(carBrandRepository.findById(carRequest.getCarBrandId()).orElseThrow(() -> new ResourceNotFoundException("Car Brand Not Found")));
        car.setModel(carRequest.getModel());
        car.setColor(carRequest.getColor());
        car.setFuelType(carRequest.getFuelType());
        car.setLocation(locationService.checkLocation(carRequest.getLocation()));
        car.setImages(carRequest.getCarImages().stream().map(image -> carImageService.checkCarImage(car, image)).collect(Collectors.toList()));
        car.setFeatures(carRequest.getCarFeatures().stream().map(carFeatureService::getCarFeatureById).collect(Collectors.toList()));
        car.setLicensePlate(carRequest.getLicensePlate());
        car.setFuelConsumption(carRequest.getFuelConsumption());
        car.setPricePerHour(carRequest.getPricePerHour());
        car.setPricePer4Hour(carRequest.getPricePer4Hour());
        car.setPricePer8Hour(carRequest.getPricePer8Hour());
        car.setPricePer12Hour(carRequest.getPricePer12Hour());
        car.setPricePer24Hour(carRequest.getPricePer24Hour());
        car.setDescription(carRequest.getDescription());
        car.getPenaltyLateReturn().add(carRequest.getPenaltyLateReturn());
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
        return cars.map(car -> carMapper.mapToResponse(car));
    }
}
