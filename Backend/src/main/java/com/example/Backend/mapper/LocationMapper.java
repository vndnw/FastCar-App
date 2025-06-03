package com.example.Backend.mapper;

import com.example.Backend.dto.response.LocationResponse;
import com.example.Backend.model.Location;
import org.springframework.stereotype.Service;

@Service
public class LocationMapper {
    public LocationResponse mapToResponse(Location location) {
        return LocationResponse.builder()
                .id(location.getId())
                .name(location.getName())
                .address(location.getAddress())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .createdAt(location.getCreatedAt())
                .updatedAt(location.getUpdatedAt())
                .build();

    }
}
