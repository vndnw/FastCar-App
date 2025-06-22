package com.example.Backend.service;

import com.example.Backend.dto.request.FeatureRequest;
import com.example.Backend.dto.response.CarFeatureResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarFeatureMapper;
import com.example.Backend.model.Feature;
import com.example.Backend.repository.FeatureRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FeatureService {

    private final FeatureRepository featureRepository;
    private final CarFeatureMapper carFeatureMapper;

    public FeatureService(FeatureRepository featureRepository, CarFeatureMapper carFeatureMapper) {
        this.featureRepository = featureRepository;
        this.carFeatureMapper = carFeatureMapper;
    }

    public CarFeatureResponse createFeature(FeatureRequest featureRequest) {
        Feature feature = Feature.builder()
                .name(featureRequest.getName())
                .description(featureRequest.getDescription())
                .iconUrl(featureRequest.getIconUrl())
                .build();
        return carFeatureMapper.mapToResponse(featureRepository.save(feature));
    }

    public CarFeatureResponse updateFeature(long carFeatureId , FeatureRequest featureRequest) {
        Feature feature = featureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
        feature.setName(featureRequest.getName());
        feature.setDescription(featureRequest.getDescription());
        feature.setIconUrl(featureRequest.getIconUrl());
        return carFeatureMapper.mapToResponse(featureRepository.save(feature));
    }

    public void deleteFeature(long carFeatureId) {
        Feature feature = featureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
        featureRepository.delete(feature);
    }

    public Feature getCarFeatureById(long carFeatureId) {
        return featureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
    }

    public CarFeatureResponse getFeature(long carFeatureId) {
        Feature feature = featureRepository.findById(carFeatureId).orElseThrow(() -> new ResourceNotFoundException("CarFeature not found"));
        return carFeatureMapper.mapToResponse(feature);
    }

    public Page<CarFeatureResponse> getFeatures(Pageable pageable) {
        Page<Feature> carFeaturePage = featureRepository.findAll(pageable);
        return carFeaturePage.map(carFeatureMapper::mapToResponse);
    }


}
