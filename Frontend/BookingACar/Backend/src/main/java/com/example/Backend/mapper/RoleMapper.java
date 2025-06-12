package com.example.Backend.mapper;

import com.example.Backend.dto.response.RoleResponse;
import com.example.Backend.model.Role;
import org.springframework.stereotype.Service;

@Service
public class RoleMapper {
    public RoleResponse mapToResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .role(role.getName())
                .build();
    }
}
