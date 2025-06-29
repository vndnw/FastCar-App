package com.example.Backend.service;


import com.example.Backend.dto.request.*;
import com.example.Backend.dto.response.AuthResponse;
import com.example.Backend.dto.response.AuthValidateResponse;
import com.example.Backend.dto.response.UserResponse;
import com.example.Backend.exception.RefreshTokenExpiredException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.enums.TokenType;
import com.example.Backend.repository.RefreshTokenRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final BlackListService blackListService;
    private final UserService userService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailService emailService;
    private final OtpService otpService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       JwtService jwtService,
                       BlackListService blackListService,
                       UserService userService,
                       RefreshTokenRepository refreshTokenRepository,
                       EmailService emailService,
                       OtpService otpService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.blackListService = blackListService;
        this.userService = userService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailService = emailService;
        this.otpService = otpService;
    }

    public AuthResponse login(@NotNull AuthRequest authRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmailOrPhone(), authRequest.getPassword()));
        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmailOrPhone());
        if (userDetails == null) {
            throw new ResourceNotFoundException("User not found ở login");
        }
        String idToken = UUID.randomUUID().toString();
        String accessToken = jwtService.generateToken(userDetails, TokenType.ACCESS_TOKEN, idToken);
        String refreshToken = jwtService.generateToken(userDetails, TokenType.REFRESH_TOKEN, idToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userService.getUserByEmail(userDetails.getUsername()))
                .build();
    }

    public UserResponse register(RegisterRequest registerRequest) {
        UserResponse userResponse = userService.registerUser(registerRequest);
        String otp = otpService.generateOtp(registerRequest.getEmail());
        log.info("OTP register email "+ registerRequest.getEmail() +": " + otp);
        emailService.sendOTPEmail(registerRequest.getEmail(), otp);
        return userResponse;
    }
    public boolean verifyOtpActive(String email, String otp) {
        if (!otpService.validateOtp(otp, email)) {
            throw new RuntimeException("OTP không hợp lệ");
        }
        if(userService.activeUser(email)){
            log.info("User with email {} has been activated", email);
            return true;
        } else {
            log.error("Failed to activate user with email {}", email);
            throw new ResourceNotFoundException("User not found or already activated");
        }
    }



    public AuthResponse refreshToken(RefreshRequest refreshRequest) {
        if(jwtService.isTokenExpired(refreshRequest.getRefreshToken())) {
            throw new RefreshTokenExpiredException("Refresh token expired");
        }
        String email = jwtService.extractEmail(refreshRequest.getRefreshToken(), TokenType.REFRESH_TOKEN);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String idToken = jwtService.extractId(refreshRequest.getRefreshToken(), TokenType.REFRESH_TOKEN);
        String token = jwtService.generateToken(userDetails, TokenType.ACCESS_TOKEN, idToken);

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshRequest.getRefreshToken())
                .user(userService.getUserByEmail(email))
                .build();
    }
    public void logout(String accessToken) {

        accessToken = accessToken.replace("Bearer ", "");

        String idToken = jwtService.extractId(accessToken, TokenType.ACCESS_TOKEN);

        blackListService.saveTokenToBlacklist(accessToken, idToken);

        refreshTokenRepository.deleteById(idToken);

    }
    public boolean validateToken(String token) {
        if (blackListService.isTokenBlacklisted(token)) {
            return false;
        }
        if (jwtService.isExpiration(token, TokenType.ACCESS_TOKEN)) {
            return false;
        }
        return jwtService.validateToken(token, userDetailsService.loadUserByUsername(jwtService.extractEmail(token, TokenType.ACCESS_TOKEN)));
    }

    public boolean checkEmailExists(String email) {
        return userService.checkEmailExists(email);
    }

    public boolean setPassword(String email, String newPassword) {
        return userService.setPassword(email, newPassword);
    }

    public boolean changePassword(String email, String oldPassword, String newPassword) {
        if (!userService.checkEmailExists(email)) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }
        return userService.changePassword(email, oldPassword, newPassword);
    }

    public boolean changePasswordForAdmin(String email, String newPassword) {
        return userService.changePasswordForAdmin(email, newPassword);
    }

    public boolean forgotPassword(String email) {
        if (!userService.checkEmailExists(email)) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }
        String otp = otpService.generateOtp(email);
        log.info("OTP forgot password email "+ email +": " + otp);
        emailService.sendOTPEmail(email, otp);
        return true;
    }

    public boolean verifyOtpPassword(String email, String otp) {
        if (!otpService.validateOtp(otp, email)) {
            throw new RuntimeException("OTP không hợp lệ");
        }
        if(userService.verifyOtpPassword(email)){
            log.info("User with email {} has been activated", email);
            return true;
        } else {
            log.error("Failed to activate user with email {}", email);
            throw new ResourceNotFoundException("User not found or already activated");
        }
    }

    public boolean changePassword(@Valid ChangePasswordRequest changePasswordRequest) {

        return false;
    }
}
