package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.CarImageRequest;
import com.example.Backend.dto.request.ListImagesRequest;
import com.example.Backend.service.CarImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/image")
public class ImageController {

    private final CarImageService carImageService;

    public  ImageController(CarImageService carImageService) {
        this.carImageService = carImageService;
    }

    @PreAuthorize("hasRole('owner')")
    @PostMapping("/upload/car/{carId}/list")
    public ResponseEntity<?> createCarImage(@PathVariable("carId") long carId, @RequestBody ListImagesRequest listImagesRequest) {
        try {
            ResponseData<?> response = ResponseData.builder()
                    .status(200)
                    .message("Car images created successfully")
                    .data(carImageService.createListImages(carId, listImagesRequest))
                    .build();
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating car image: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('owner')")
    @PostMapping("/upload/car/{carId}")
    public ResponseEntity<?> createCarImage(@PathVariable("carId") long carId, @RequestBody CarImageRequest carImageRequest) {
        try {
            ResponseData<?> response = ResponseData.builder()
                    .status(200)
                    .message("Car image created successfully")
                    .data(carImageService.createCarImage(carId, carImageRequest))
                    .build();
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating car image: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/delete/car/{carId}/list")
    public ResponseEntity<?> deleteCarImage(@PathVariable("carId") long carId) {
        try {
            carImageService.deleteImageByCarId(carId);
            ResponseData<?> response = ResponseData.builder()
                    .status(200)
                    .message("Car image deleted successfully")
                    .build();
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting car image: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImageById(@PathVariable("id") long id) {
        try {
            carImageService.deleteImageById(id);
            ResponseData<?> response = ResponseData.builder()
                    .status(200)
                    .message("Image deleted successfully")
                    .build();
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting image: " + e.getMessage());
        }
    }

}
