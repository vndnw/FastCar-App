package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.*;
import com.example.Backend.model.enums.CarStatus;
import com.example.Backend.service.BookingService;
import com.example.Backend.service.CarService;
import com.example.Backend.service.DocumentService;
import com.example.Backend.service.ReviewCarService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/car")
public class CarController {

    private final CarService carService;
    private final DocumentService documentService;

    public CarController(CarService carService,
                         DocumentService documentService) {
        this.carService = carService;
        this.documentService = documentService;
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
    @GetMapping("/{id}")
    public ResponseEntity<?> getCarById(@PathVariable("id") long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Car found")
                .data(carService.getCarById(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
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
    // Document related endpoints
    @PostMapping("/{id}/document")
    public ResponseEntity<?> createDocument(@PathVariable("id") long id, @RequestBody DocumentRequest documentRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Document added successfully")
                .data(documentService.createDocument(id,documentRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
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
