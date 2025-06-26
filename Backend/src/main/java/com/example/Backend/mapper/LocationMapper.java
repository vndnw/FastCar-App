package com.example.Backend.mapper;

import com.example.Backend.dto.response.LocationResponse;
import com.example.Backend.model.Location;
import org.springframework.stereotype.Service;

@Service
public class LocationMapper {
    public LocationResponse mapToResponse(Location location) {
        return LocationResponse.builder()
                .id(location.getId())
                .address(location.getAddress())
                .street(location.getStreet())
                .ward(location.getWard())
                .district(location.getDistrict())
                .city(location.getCity())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .build();

    }
}
