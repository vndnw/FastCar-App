package com.example.Backend.service;

import com.example.Backend.dto.request.CarFeatureRequest;
import com.example.Backend.dto.response.CarFeatureResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarFeatureMapper;
import com.example.Backend.model.CarFeature;
import com.example.Backend.repository.CarFeatureRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CarFeatureService {

    private final CarFeatureRepository carFeatureRepository;
    private final CarFeatureMapper carFeatureMapper;

    public CarFeatureService(CarFeatureRepository carFeatureRepository, CarFeatureMapper carFeatureMapper) {
        this.carFeatureRepository = carFeatureRepository;
        this.carFeatureMapper = carFeatureMapper;
    }

    public CarFeatureResponse createCarFeature(CarFeatureRequest carFeatureRequest) {
        CarFeature carFeature = CarFeature.builder()
                .name(carFeatureRequest.getName())
                .description(carFeatureRequest.getDescription())
                .iconUrl(carFeatureRequest.getIconUrl())
                .build();
        return carFeatureMapper.mapToResponse(carFeatureRepository.save(carFeature));
    }

    public CarFeatureResponse updateCarFeature(long carFeatureId , CarFeatureRequest carFeatureRequest) {
        CarFeature carFeature = carFeatureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
        carFeature.setName(carFeatureRequest.getName());
        carFeature.setDescription(carFeatureRequest.getDescription());
        carFeature.setIconUrl(carFeatureRequest.getIconUrl());
        return carFeatureMapper.mapToResponse(carFeatureRepository.save(carFeature));
    }

    public void deleteCarFeature(long carFeatureId) {
        CarFeature carFeature = carFeatureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
        carFeatureRepository.delete(carFeature);
    }

    public CarFeature getCarFeatureById(long carFeatureId) {
        return carFeatureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
    }

    public CarFeatureResponse getCarFeature(long carFeatureId) {
        CarFeature carFeature = carFeatureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
        return carFeatureMapper.mapToResponse(carFeature);
    }

    public Page<CarFeatureResponse> getCarFeatures(Pageable pageable) {
        Page<CarFeature> carFeaturePage = carFeatureRepository.findAll(pageable);
        return carFeaturePage.map(carFeatureMapper::mapToResponse);
    }


}
