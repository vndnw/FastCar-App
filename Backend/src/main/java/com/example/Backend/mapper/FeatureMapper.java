package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarFeatureResponse;
import com.example.Backend.model.Feature;
import org.springframework.stereotype.Service;

@Service
public class FeatureMapper {
    public CarFeatureResponse mapToResponse(Feature feature) {
        return CarFeatureResponse.builder()
                .id(feature.getId())
                .description(feature.getDescription())
                .iconUrl(feature.getIconUrl())
                .name(feature.getName())
                .createdAt(feature.getCreatedAt())
                .updatedAt( feature.getUpdatedAt())
                .build();
    }
}
