package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarFeatureResponse;
import com.example.Backend.model.CarFeature;
import org.springframework.stereotype.Service;

@Service
public class CarFeatureMapper {
    public CarFeatureResponse mapToResponse(CarFeature carFeature) {
        return CarFeatureResponse.builder()
                .id(carFeature.getId())
                .description(carFeature.getDescription())
                .iconUrl(carFeature.getIconUrl())
                .name(carFeature.getName())
                .createdAt(carFeature.getCreatedAt())
                .updatedAt( carFeature.getUpdatedAt())
                .build();
    }
}
