package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.*;
import com.example.Backend.service.BookingService;
import com.example.Backend.service.CarService;
import com.example.Backend.service.DocumentService;
import com.example.Backend.service.ReviewCarService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/car")
public class CarController {

    private final CarService carService;
    private final ReviewCarService reviewCarService;
    private final DocumentService documentService;
    private final BookingService bookingService;

    public CarController(CarService carService,
                         ReviewCarService reviewCarService,
                         DocumentService documentService,
                         BookingService bookingService) {
        this.carService = carService;
        this.reviewCarService = reviewCarService;
        this.documentService = documentService;
        this.bookingService = bookingService;
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
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable("id") long id) {
        carService.deleteCar(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Car deleted successfully")
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
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
