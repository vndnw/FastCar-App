package com.example.Backend.mapper;

import com.example.Backend.dto.response.DriverResponse;
import com.example.Backend.model.Driver;
import org.springframework.stereotype.Service;

@Service
public class DriverMapper {

    private final UserMapper userMapper;

    public DriverMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public DriverResponse mapToResponse(Driver driver) {
        return DriverResponse.builder()
                .id(driver.getId())
                .user(userMapper.mapToResponse(driver.getUser()))
                .licenseNumber(driver.getLicenseNumber())
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt())
                .status(driver.getStatus())
                .build();
    }
}
