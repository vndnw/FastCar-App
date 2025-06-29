package com.example.Backend.service;

import com.example.Backend.dto.request.CarRequest;
import com.example.Backend.dto.request.CarSearchCriteriaRequest;
import com.example.Backend.dto.response.CarDetailsResponse;
import com.example.Backend.dto.response.CarResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarMapper;
import com.example.Backend.model.*;
import com.example.Backend.model.enums.CarStatus;
import com.example.Backend.model.enums.DocumentType;
import com.example.Backend.repository.*;
import com.example.Backend.repository.specification.CarSpecification;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.concurrent.TimeUnit;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CarService {
    private final CarRepository carRepository;
    private final CarMapper carMapper;
    private final CarBrandRepository carBrandRepository;
    private final FeatureService featureService;
    private final LocationService locationService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final DocumentService documentService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper redisObjectMapper; // Đã cấu hình hỗ trợ JavaTimeModule

    public CarService(CarRepository carRepository,
                      CarMapper carMapper,
                      CarBrandRepository carBrandRepository,
                      FeatureService featureService,
                      LocationService locationService,
                      UserRepository userRepository,
                      UserService userService,
                      DocumentService documentService) {
        this.carRepository = carRepository;
        this.carMapper = carMapper;
        this.carBrandRepository = carBrandRepository;
        this.featureService = featureService;
        this.locationService = locationService;
        this.userRepository = userRepository;
        this.userService = userService;
        this.documentService = documentService;
    }

    private void clearCarSearchCache() {
        // Xóa tất cả các key bắt đầu bằng "car_search:"
        var keys = redisTemplate.keys("car_search:*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }

    public CarResponse createCar(long userId, @NotNull CarRequest carRequest) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        if(documentService.checkIfDocumentExistsByUserAndType(user, DocumentType.CCCD)){
            throw new ResourceNotFoundException("You must upload your CCCD before booking a car.");
        }
        Car car = new Car();
        car.setUser(user);
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
        car.setPricePer4Hour(BigDecimal.valueOf(carRequest.getPricePerHour() * 4 * (1 - 0.05))); // Giảm giá 5% cho 4 giờ
        car.setPricePer8Hour(BigDecimal.valueOf(carRequest.getPricePerHour() * 8 * (1 - 0.10))); // Giảm giá 10% cho 8 giờ
        car.setPricePer12Hour(BigDecimal.valueOf(carRequest.getPricePerHour() * 12 * (1 - 0.15)));// Giảm giá 15% cho 12 giờ
        car.setPricePer24Hour(BigDecimal.valueOf(carRequest.getPricePerHour() * 24 * (1 - 0.2)));// Giảm giá 20% cho 24 giờ
        car.setDescription(carRequest.getDescription());
        car.setActive(false);
        car.setStatus(CarStatus.PENDING);
        car.setLocation(locationService.checkLocation(carRequest.getLocation()));

        if(carRequest.getImages() != null && !carRequest.getImages().isEmpty()) {
            List<Image> images = carRequest.getImages().stream()
                    .map(image -> {
                        Image img = new Image();
                        img.setImageUrl(image);
                        img.setCar(car);
                        return img;
                    }).collect(Collectors.toList());
            car.setImages(images);
        }

        userService.addRoleToUser(userId, "owner");

        CarResponse response = carMapper.mapToResponse(carRepository.save(car));
        clearCarSearchCache();
        return response;
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
        car.setPricePer4Hour(BigDecimal.valueOf(carRequest.getPricePerHour() * 4 * (1 - 0.05))); // Giảm giá 5% cho 4 giờ
        car.setPricePer8Hour(BigDecimal.valueOf(carRequest.getPricePerHour() * 8 * (1 - 0.10))); // Giảm giá 10% cho 8 giờ
        car.setPricePer12Hour(BigDecimal.valueOf(carRequest.getPricePerHour() * 12 * (1 - 0.15)));// Giảm giá 15% cho 12 giờ
        car.setPricePer24Hour(BigDecimal.valueOf(carRequest.getPricePerHour() * 24 * (1 - 0.2)));// Giảm giá 20% cho 24 giờ
        car.setDescription(carRequest.getDescription());
        car.setLocation(locationService.checkLocation(carRequest.getLocation()));
        CarResponse response = carMapper.mapToResponse(carRepository.save(car));
        clearCarSearchCache();
        return response;
    }

    public void deleteCar(long carId) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        carRepository.delete(car);
        clearCarSearchCache();
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
        clearCarSearchCache();
        return true;
    }

    public Page<CarResponse> searchCars(CarSearchCriteriaRequest criteria, Pageable pageable) {
        String cacheKey = buildCacheKey(criteria, pageable);

        // Thử lấy kết quả từ Redis
        Object cachedObj = redisTemplate.opsForValue().get(cacheKey);
        if (cachedObj != null) {
            try {
                // Dữ liệu cache là một Map chứa content, totalElements, totalPages
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> map = (java.util.Map<String, Object>) cachedObj;
                List<CarResponse> content = redisObjectMapper.convertValue(
                        map.get("content"),
                        new TypeReference<List<CarResponse>>() {}
                );
                int pageNumber = (int) map.getOrDefault("pageNumber", pageable.getPageNumber());
                int pageSize = (int) map.getOrDefault("pageSize", pageable.getPageSize());
                long totalElements = ((Number) map.getOrDefault("totalElements", content.size())).longValue();
                return new PageImpl<>(content, PageRequest.of(pageNumber, pageSize), totalElements);
            } catch (Exception e) {
                // Nếu lỗi deserialize, bỏ qua cache và query lại DB
            }
        }

        // Nếu không có cache, thực hiện truy vấn DB
        Specification<Car> spec = CarSpecification.findByCriteria(criteria);
        Page<Car> carPage = carRepository.findAll(spec, pageable);
        Page<CarResponse> result = carPage.map(carMapper::mapToResponse);

        // Lưu vào Redis: chỉ lưu content + metadata, không lưu trực tiếp Page object
        java.util.Map<String, Object> cacheMap = new java.util.HashMap<>();
        cacheMap.put("content", result.getContent());
        cacheMap.put("pageNumber", result.getNumber());
        cacheMap.put("pageSize", result.getSize());
        cacheMap.put("totalElements", result.getTotalElements());
        redisTemplate.opsForValue().set(cacheKey, cacheMap, 10, TimeUnit.MINUTES);

        return result;
    }

    @NotNull
    private String buildCacheKey(CarSearchCriteriaRequest criteria, Pageable pageable) {
        StringBuilder sb = new StringBuilder("car_search:");
        sb.append("brandId=").append(criteria.getBrandId()).append(";");
        sb.append("name=").append(criteria.getName()).append(";");
        sb.append("carType=").append(criteria.getCarType()).append(";");
        sb.append("fuelType=").append(criteria.getFuelType()).append(";");
        sb.append("minPrice=").append(criteria.getMinPrice()).append(";");
        sb.append("maxPrice=").append(criteria.getMaxPrice()).append(";");
        sb.append("minSeats=").append(criteria.getMinSeats()).append(";");
        sb.append("startDate=").append(criteria.getStartDate()).append(";");
        sb.append("endDate=").append(criteria.getEndDate()).append(";");
        sb.append("latitude=").append(criteria.getLatitude()).append(";");
        sb.append("longitude=").append(criteria.getLongitude()).append(";");
        sb.append("radiusInKm=").append(criteria.getRadiusInKm()).append(";");
        sb.append("city=").append(criteria.getCity()).append(";");
        sb.append("district=").append(criteria.getDistrict()).append(";");
        sb.append("location=").append(criteria.getLocation()).append(";");
        sb.append("page=").append(pageable.getPageNumber()).append(";");
        sb.append("size=").append(pageable.getPageSize()).append(";");
        sb.append("sort=").append(pageable.getSort());
        return sb.toString();
    }
}
