package com.example.Backend.service;


import com.example.Backend.dto.request.UserRequest;
import com.example.Backend.dto.response.UserResponse;
import com.example.Backend.exception.ResourceAlreadyExistsException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.UserMapper;
import com.example.Backend.model.User;
import com.example.Backend.repository.RoleRepository;
import com.example.Backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.roleRepository = roleRepository;
    }

    public UserResponse createUser(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("User with email " + userRequest.getEmail() + " already exists");
        }else if(userRepository.existsByPhone(userRequest.getPhone())){
            throw new ResourceAlreadyExistsException("User with phone " + userRequest.getPhone() + " already exists");
        }
        User user = User.builder()
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .phone(userRequest.getPhone())
                .address(userRequest.getAddress())
                .profilePicture(userRequest.getProfilePicture())
                .dateOfBirth(userRequest.getDateOfBirth())
                .roles(userRequest.getRoles().stream().map(role -> roleRepository.findByName(role).orElseThrow(() -> new ResourceNotFoundException("Role not found: " + role))).collect(Collectors.toList()))
                .build();
        return userMapper.mapToResponse(userRepository.save(user));
    }
    public UserResponse updateUser(long id, UserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setAddress(userRequest.getAddress());
        user.setProfilePicture(userRequest.getProfilePicture());
        user.setDateOfBirth(userRequest.getDateOfBirth());
        return userMapper.mapToResponse(userRepository.save(user));
    }
    public UserResponse getUserById(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.mapToResponse(user);
    }
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.mapToResponse(user);
    }
    public void deleteUser(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }
        return users.map(userMapper::mapToResponse);
    }

    public UserResponse getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.mapToResponse(user);
    }

//    public Object searchUser(String name, String email, String phone, Pageable pageable) {
//        Page<User> users = userRepository.searchUser(name, email, phone, pageable);
//        if (users.isEmpty()) {
//            throw new ResourceNotFoundException("No users found");
//        }
//        return users.map(userMapper::mapToResponse);
//    }
}
