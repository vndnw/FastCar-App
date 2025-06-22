package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.FeatureRequest;
import com.example.Backend.service.FeatureService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feature")
public class FeatureController {

    private final FeatureService featureService;

    public  FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @PostMapping
    public ResponseEntity<?> addFeature(@RequestBody FeatureRequest feature) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Feature added successfully")
                .data(featureService.createFeature(feature))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeature(@PathVariable("id") long carFeatureId, @RequestBody FeatureRequest feature) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Feature updated successfully")
                .data(featureService.updateFeature(carFeatureId, feature))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeature(@PathVariable("id") long carFeatureId) {
        featureService.deleteFeature(carFeatureId);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Feature deleted successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }

    @GetMapping
    public ResponseEntity<?> getAllFeatures(@PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Features retrieved successfully")
                .data(featureService.getFeatures(pageable))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeatureById(@PathVariable("id") long carFeatureId) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Feature retrieved successfully")
                .data(featureService.getFeature(carFeatureId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }
}
