package com.example.Backend.service;

import com.example.Backend.dto.request.LocationRequest;
import com.example.Backend.dto.response.LocationResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.LocationMapper;
import com.example.Backend.model.Location;
import com.example.Backend.repository.LocationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class LocationService {
    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    public LocationService(LocationRepository locationRepository, LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    public Page<LocationResponse> getAllLocations(Pageable pageable) {
        Page<Location> locations = locationRepository.findAll(pageable);
        return locations.map(location -> locationMapper.mapToResponse(location));
    }

    public LocationResponse getLocationById(Long id) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        return locationMapper.mapToResponse(location);
    }

    public LocationResponse addLocation(LocationRequest locationRequest) {
        Location location = Location.builder()
                .name(locationRequest.getName())
                .address(locationRequest.getAddress())
                .longitude(locationRequest.getLongitude())
                .latitude(locationRequest.getLatitude())
                .build();
        return locationMapper.mapToResponse(locationRepository.save(location));
    }
    public LocationResponse updateLocation(Long id, LocationRequest locationRequest) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        location.setName(locationRequest.getName());
        location.setAddress(locationRequest.getAddress());
        location.setLongitude(locationRequest.getLongitude());
        location.setLatitude(locationRequest.getLatitude());
        return locationMapper.mapToResponse(locationRepository.save(location));
    }
    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }
//    public Page<LocationResponse> getLocationsByCity(String city, Pageable pageable) {
//
//    }
    public Page<LocationResponse> getLocationByName(String name, Pageable pageable) {
        Page<Location> locations = locationRepository.findByLocationName(name,pageable);
        return locations.map(location -> locationMapper.mapToResponse(location));
    }
}
