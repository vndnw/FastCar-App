package com.example.Backend.service;


import com.example.Backend.dto.response.RoleResponse;
import com.example.Backend.exception.ResourceAlreadyExistsException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.RoleMapper;
import com.example.Backend.model.Role;
import com.example.Backend.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public RoleService(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
    }

    public RoleResponse createRole(String roleName) {

        if (roleRepository.existsByName(roleName)) {
            throw new ResourceAlreadyExistsException("Role already exists");
        }
        Role role = Role.builder()
                .name(roleName)
                .build();
        Role savedRole = roleRepository.save(role);
        return roleMapper.mapToResponse(savedRole);
    }
    public RoleResponse getRoleById(long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        return roleMapper.mapToResponse(role);
    }
    public RoleResponse getRoleByName(String name) {
        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        return roleMapper.mapToResponse(role);
    }
    public RoleResponse updateRole(long id, String roleName) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        role.setName(roleName);
        Role updatedRole = roleRepository.save(role);
        return roleMapper.mapToResponse(updatedRole);
    }
    public void deleteRole(long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        roleRepository.delete(role);
    }

    public List<RoleResponse> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        if (roles.isEmpty()) {
            throw new ResourceNotFoundException("No roles found");
        }
        return roles.stream()
                .map(roleMapper::mapToResponse)
                .toList();
    }
}
