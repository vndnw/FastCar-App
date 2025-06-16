package com.example.Backend.service;

import com.example.Backend.dto.request.CarFeatureRequest;
import com.example.Backend.dto.response.CarFeatureResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarFeatureMapper;
import com.example.Backend.model.Feature;
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
        Feature feature = Feature.builder()
                .name(carFeatureRequest.getName())
                .description(carFeatureRequest.getDescription())
                .iconUrl(carFeatureRequest.getIconUrl())
                .build();
        return carFeatureMapper.mapToResponse(carFeatureRepository.save(feature));
    }

    public CarFeatureResponse updateCarFeature(long carFeatureId , CarFeatureRequest carFeatureRequest) {
        Feature feature = carFeatureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
        feature.setName(carFeatureRequest.getName());
        feature.setDescription(carFeatureRequest.getDescription());
        feature.setIconUrl(carFeatureRequest.getIconUrl());
        return carFeatureMapper.mapToResponse(carFeatureRepository.save(feature));
    }

    public void deleteCarFeature(long carFeatureId) {
        Feature feature = carFeatureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
        carFeatureRepository.delete(feature);
    }

    public Feature getCarFeatureById(long carFeatureId) {
        return carFeatureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
    }

    public CarFeatureResponse getCarFeature(long carFeatureId) {
        Feature feature = carFeatureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
        return carFeatureMapper.mapToResponse(feature);
    }

    public Page<CarFeatureResponse> getCarFeatures(Pageable pageable) {
        Page<Feature> carFeaturePage = carFeatureRepository.findAll(pageable);
        return carFeaturePage.map(carFeatureMapper::mapToResponse);
    }


}
