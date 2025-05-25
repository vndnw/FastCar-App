package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.CarBrandRequest;
import com.example.Backend.service.CarBrandService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carbrand")
public class CarBrandController {
    private final CarBrandService carBrandService;

    public CarBrandController(CarBrandService carBrandService) {
        this.carBrandService = carBrandService;
    }

    @PostMapping
    public ResponseEntity<?> createCarBrand(CarBrandRequest carBrandRequest) {
        ResponseData responseData = ResponseData.builder()
                .message("Success")
                .data(carBrandService.createCarBrand(carBrandRequest))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @GetMapping
    public ResponseEntity<?> getAllCarBrand(Pageable pageable) {
        ResponseData responseData = ResponseData.builder()
                .message("Success")
                .data(carBrandService.getAllCarBrands(pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCarBrandById(@PathVariable Long id) {
        ResponseData responseData = ResponseData.builder()
                .message("Success")
                .data(carBrandService.getCarBrandById(id))
                .build();
        return ResponseEntity.ok(responseData);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCarBrand(@PathVariable Long id, @RequestBody CarBrandRequest carBrandRequest) {
        ResponseData responseData = ResponseData.builder()
                .message("Success")
                .data(carBrandService.updateCarBrand(id, carBrandRequest))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCarBrand(@PathVariable Long id) {
        carBrandService.deleteCarBrand(id);
        return ResponseEntity.ok().build();
    }
}
