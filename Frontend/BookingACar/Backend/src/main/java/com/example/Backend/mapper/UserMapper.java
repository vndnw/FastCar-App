package com.example.Backend.mapper;

import com.example.Backend.dto.response.LocationResponse;
import com.example.Backend.dto.response.UserResponse;
import com.example.Backend.model.Role;
import com.example.Backend.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    private final LocationMapper locationMapper;

    public UserMapper(LocationMapper locationMapper) {
        this.locationMapper = locationMapper;
    }

    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .address(user.getAddress() == null ? new LocationResponse() : locationMapper.mapToResponse(user.getAddress()))
                .dateOfBirth(user.getDateOfBirth())
                .profilePicture(user.getProfilePicture())
                .active(user.isActive())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .toList())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
