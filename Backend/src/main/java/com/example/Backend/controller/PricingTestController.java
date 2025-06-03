package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.PricingCalculationRequest;
import com.example.Backend.model.Car;
import com.example.Backend.model.Driver;
import com.example.Backend.model.enums.BookingType;
import com.example.Backend.repository.CarRepository;
import com.example.Backend.repository.DriverRepository;
import com.example.Backend.service.BookingService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/pricing")
public class PricingTestController {
    private final BookingService bookingService;
    private final CarRepository carRepository;
    private final DriverRepository driverRepository;

    @Autowired
    public PricingTestController(
            BookingService bookingService,
            CarRepository carRepository,
            DriverRepository driverRepository) {
        this.bookingService = bookingService;
        this.carRepository = carRepository;
        this.driverRepository = driverRepository;
    }

    @PostMapping("/calculate")
    public ResponseEntity<ResponseData<?>> calculatePrice(@RequestBody PricingCalculationRequest request) {
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));        // Format dates for display
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String pickupTimeStr = request.getPickupTime().format(formatter);
        String returnTimeStr = request.getReturnTime().format(formatter);

        // Calculate duration in days
        long durationHours = java.time.Duration.between(request.getPickupTime(), request.getReturnTime()).toHours();
        long durationDays = (durationHours + 23) / 24; // Round up to the nearest day        // Calculate the price
        double price = bookingService.calculatePriceForTest(
                car,
                request.getType(),
                request.getPickupTime(),
                request.getReturnTime(),
                request.getDiscountCode()
        );// Build simple response with only the essential details
        PricingDetail detail = new PricingDetail();
        detail.setCarId(car.getId());
        detail.setCarName(car.getName());
        detail.setCarBrand(car.getCarBrand() != null ? car.getCarBrand().getName() : "Unknown");        detail.setBasePrice(car.getBasePrice() > 0 ? car.getBasePrice() : 50.0);        detail.setBookingType(request.getType());
        detail.setPickupTime(pickupTimeStr);
        detail.setReturnTime(returnTimeStr);
        detail.setRentalDurationDays(durationDays);
        detail.setCalculatedPrice(price);

        ResponseData<?> response = ResponseData.builder()
                .status(200)
                .message("Price calculated successfully")
                .data(detail)
                .build();

        return ResponseEntity.ok(response);
    }


    @Data
    static class PricingDetail {
        private long carId;
        private String carName;
        private String carBrand;
        private double basePrice;        private BookingType bookingType;
        private String pickupTime;
        private String returnTime;
        private long rentalDurationDays;
        private double calculatedPrice;
    }
}
