package com.example.Backend.mapper;

import com.example.Backend.dto.response.UserResponse;
import com.example.Backend.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {
    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth())
                .profilePicture(user.getProfilePicture())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName())
                        .toList())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
