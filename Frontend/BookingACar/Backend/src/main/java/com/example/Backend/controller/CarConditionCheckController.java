package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.response.CarConditionCheckResponse;
import com.example.Backend.model.enums.CheckStatus;
import com.example.Backend.service.CarConditionCheckService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/car-condition-check")
public class CarConditionCheckController {

    private final CarConditionCheckService carConditionCheckService;

    public CarConditionCheckController(CarConditionCheckService carConditionCheckService) {
        this.carConditionCheckService = carConditionCheckService;
    }

    @PutMapping("/{id}/accepted")
    public ResponseEntity<?> acceptedCarConditionCheck(@PathVariable long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Car condition check accepted before rental.")
                .data(carConditionCheckService.acceptedCarConditionCheck(id, CheckStatus.ACCEPTED))
                .build();
        return ResponseEntity.ok(responseData);
    }
    @PutMapping("/{id}/rejected")
    public ResponseEntity<?> rejectedCarConditionCheck(@PathVariable long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Car condition check rejected before rental.")
                .data(carConditionCheckService.acceptedCarConditionCheck(id, CheckStatus.REJECTED))
                .build();
        return ResponseEntity.ok(responseData);
    }
    @GetMapping
    public ResponseEntity<?> getAllCarConditionChecks(@PageableDefault(size = 10, page = 0, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Getting all car condition checks.")
                .data(carConditionCheckService.getAllCarConditionChecks(pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getCarConditionCheckById(@PathVariable long id) {
        ResponseData<CarConditionCheckResponse> responseData = ResponseData.<CarConditionCheckResponse>builder()
                .status(200)
                .message("Getting car condition check by id.")
                .data(carConditionCheckService.getCarConditionCheckById(id))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCarConditionCheck(@PathVariable long id) {
        carConditionCheckService.deleteCarConditionCheckById(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Car condition check deleted successfully.")
                .build();
        return ResponseEntity.ok(responseData);
    }
}
