package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.LocationRequest;
import com.example.Backend.service.LocationService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/location")
public class LocationController {
    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping
    public ResponseEntity<?> addLocation(@RequestBody LocationRequest locationRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Created Location Successfully")
                .data(locationService.addLocation(locationRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<?> getAllLocations(Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Get All Location Successfully")
                .data(locationService.getAllLocations(pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @GetMapping("/allnamelocation/{name}")
    public ResponseEntity<?> getAllLocationsByName(@PathVariable String name, Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Get All Location Successfully")
                .data(locationService.getLocationByName(name, pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Get Location Successfully")
                .data(locationService.getLocationById(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLocation(@PathVariable Long id, @RequestBody LocationRequest locationRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Update Location Successfully")
                .data(locationService.updateLocation(id, locationRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Deleted Location Successfully")
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
