package com.example.Backend.service;


import com.example.Backend.dto.request.*;
import com.example.Backend.dto.response.UserResponse;
import com.example.Backend.exception.ResourceAlreadyExistsException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.UserMapper;
import com.example.Backend.model.Document;
import com.example.Backend.model.Role;
import com.example.Backend.model.User;
import com.example.Backend.model.enums.DocumentStatus;
import com.example.Backend.repository.RoleRepository;
import com.example.Backend.repository.UserRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final LocationService locationService;
    private final DocumentService documentService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       UserMapper userMapper,
                       RoleRepository roleRepository,
                       LocationService locationService,
                       DocumentService documentService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.roleRepository = roleRepository;
        this.locationService = locationService;
        this.documentService = documentService;
    }

    public UserResponse registerUser(@NotNull RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("User with email " + registerRequest.getEmail() + " already exists");
        }else if(userRepository.existsByPhone(registerRequest.getPhone())){
            throw new ResourceAlreadyExistsException("User with phone " + registerRequest.getPhone() + " already exists");
        }
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match");
        }

        List<Role> roles = new ArrayList<>();
        roles.add(roleRepository.findByName("user")
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: user")));

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .phone(registerRequest.getPhone())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(roles)
                .active(false)
                .requiredChangePassword(false)
                .build();
        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse updateUserInfo(long id, @NotNull UpdateInfoRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setAddress(locationService.checkLocation(userRequest.getAddress()));
        user.setProfilePicture(userRequest.getProfilePicture());
        user.setDateOfBirth(userRequest.getDateOfBirth());
        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse updateAvatar(long id, String avatar) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setProfilePicture(avatar);
        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse createUser(@NotNull UserRequest userRequest) {
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
                .address(locationService.checkLocation(userRequest.getAddress()))
                .profilePicture(userRequest.getProfilePicture())
                .dateOfBirth(userRequest.getDateOfBirth())
                .active(false)
                .requiredChangePassword(false)
                .roles(userRequest.getRoles().stream().map(role -> roleRepository.findByName(role).orElseThrow(() -> new ResourceNotFoundException("Role not found: " + role))).collect(Collectors.toList()))
                .build();
        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse updateUser(long id, @NotNull UpdateUserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setPhone(userRequest.getPhone());
        user.setAddress(locationService.checkLocation(userRequest.getAddress()));
        user.setProfilePicture(userRequest.getProfilePicture());
        user.setDateOfBirth(userRequest.getDateOfBirth());
        user.setRoles(userRequest.getRoles().stream().map(role -> roleRepository.findByName(role).orElseThrow(() -> new ResourceNotFoundException("Role not found: " + role))).collect(Collectors.toList()));
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
        user.getRoles().clear();
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
    public boolean activeUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(true);
        userRepository.save(user);
        return true; // User activation status updated successfully
    }

    public boolean inActiveUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(false);
        userRepository.save(user);
        return true;
    }

    public boolean updateAvatar(String avatar){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setProfilePicture(avatar);
        userRepository.save(user);
        return true;
    }


    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean addRoleToUser(long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
        if (user.getRoles().contains(role)) {
            return false; // Role already exists for user
        }
        user.getRoles().add(role);
        userRepository.save(user);
        return true; // Role added successfully
    }

    public boolean changePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if(!user.isRequiredChangePassword()){
            throw new IllegalArgumentException("User is not required to change password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    public boolean forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRequiredChangePassword(true);
        userRepository.save(user);
        return true; // Password reset initiated successfully
    }

    public boolean verifyOtpPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRequiredChangePassword(true);
        userRepository.save(user);
        return true; // OTP verified successfully
    }

    public boolean changePasswordForAdmin(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }


    public Object addCccd(long id, DocumentRequest cccdRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Document cccd = Document.builder()
                .user(user)
                .documentType(cccdRequest.getDocumentType())
                .documentNumber(cccdRequest.getDocumentNumber())
                .imageFrontUrl(cccdRequest.getImageFrontUrl())
                .imageBackUrl(cccdRequest.getImageBackUrl())
                .description(cccdRequest.getDescription())
                .status(DocumentStatus.PENDING)
                .active(true)
                .build();

        user.getDocuments().add(cccd);
        userRepository.save(user);
        return userMapper.mapToResponse(user);
    }

    public Object addLicense(long id, DocumentRequest licenseRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Document license = Document.builder()
                .user(user)
                .documentType(licenseRequest.getDocumentType())
                .documentNumber(licenseRequest.getDocumentNumber())
                .imageFrontUrl(licenseRequest.getImageFrontUrl())
                .imageBackUrl(licenseRequest.getImageBackUrl())
                .description(licenseRequest.getDescription())
                .status(DocumentStatus.PENDING)
                .active(true)
                .build();

        user.getDocuments().add(license);
        userRepository.save(user);
        return userMapper.mapToResponse(user);
    }

    public Object updateCccd(long id, DocumentRequest cccdRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Document cccd = user.getDocuments().stream()
                .filter(doc -> doc.getDocumentType() == cccdRequest.getDocumentType())
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cccd document not found for user"));

        cccd.setDocumentNumber(cccdRequest.getDocumentNumber());
        cccd.setImageFrontUrl(cccdRequest.getImageFrontUrl());
        cccd.setImageBackUrl(cccdRequest.getImageBackUrl());
        cccd.setDescription(cccdRequest.getDescription());
        cccd.setStatus(DocumentStatus.PENDING);
        cccd.setActive(true);

        userRepository.save(user);
        return userMapper.mapToResponse(user);
    }

    public Object updateLicense(long id, DocumentRequest licenseRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Document license = user.getDocuments().stream()
                .filter(doc -> doc.getDocumentType() == licenseRequest.getDocumentType())
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("License document not found for user"));

        license.setDocumentNumber(licenseRequest.getDocumentNumber());
        license.setImageFrontUrl(licenseRequest.getImageFrontUrl());
        license.setImageBackUrl(licenseRequest.getImageBackUrl());
        license.setDescription(licenseRequest.getDescription());
        license.setStatus(DocumentStatus.PENDING);
        license.setActive(true);

        userRepository.save(user);
        return userMapper.mapToResponse(user);
    }
}
