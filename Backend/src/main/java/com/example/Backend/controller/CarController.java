package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.*;
import com.example.Backend.model.enums.CarStatus;
import com.example.Backend.service.*;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/car")
public class CarController {

    private final CarService carService;
    private final ReviewCarService reviewCarService;
    private final DocumentService documentService;
    private final BookingService bookingService;
    private final CloudinaryService cloudinaryService;

    public CarController(CarService carService,
                         ReviewCarService reviewCarService,
                         DocumentService documentService,
                         BookingService bookingService,
                         CloudinaryService cloudinaryService) {
        this.carService = carService;
        this.reviewCarService = reviewCarService;
        this.documentService = documentService;
        this.bookingService = bookingService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCars(Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("All cars found")
                .data(carService.getAllCars(pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/create/user/{userId}")
    public ResponseEntity<?> createCar(@PathVariable("userId") long userId, @RequestBody CarRequest carRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Car created successfully")
                .data(carService.createCar(userId, carRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCarById(@PathVariable("id") long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Car found")
                .data(carService.getCarById(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCar(@PathVariable("id") long id, @RequestBody CarRequest carRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Car updated successfully")
                .data(carService.updateCar(id, carRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable("id") long id) {
        carService.deleteCar(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Car deleted successfully")
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


    @PatchMapping("/{id}/update-status/{status}")
    public ResponseEntity<?> activeCar(@PathVariable("id") long id, @PathVariable("status") String status) {
        CarStatus carStatus = CarStatus.valueOf(status);
        boolean isActive = carService.updateStatus(id, carStatus);
        ResponseData<?> responseData = ResponseData.builder()
                .status(isActive ? 200 : 400)
                .message(isActive ? "Car activated successfully" : "Car is already active or has inactive documents")
                .build();
        return new ResponseEntity<>(responseData, isActive ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchCars(CarSearchCriteriaRequest criteria, Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Search results found")
                .data(carService.searchCars(criteria, pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


//    @GetMapping("/{id}/reviewcar")
//    public ResponseEntity<?> getAllReviewCars(@PathVariable("id") long id, Pageable pageable) {
//        ResponseData<?> responseData = ResponseData.builder()
//                .status(200)
//                .message("All review cars found")
//                .data(reviewCarService.findAllByCarId(id, pageable))
//                .build();
//        return new ResponseEntity<>(responseData, HttpStatus.OK);
//    }
//
//    @PostMapping("/{id}/reviewcar")
//    public ResponseEntity<?> addReviewCar(@PathVariable("id") long id, @RequestBody ReviewCarRequest reviewCarRequest) {
//        ResponseData<?> responseData = ResponseData.builder()
//                .status(201)
//                .message("Review car added successfully")
//                .data(reviewCarService.createReviewCar(id, reviewCarRequest))
//                .build();
//        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
//    }
}
