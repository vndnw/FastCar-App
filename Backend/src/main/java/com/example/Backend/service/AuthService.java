package com.example.Backend.service;


import com.example.Backend.dto.request.AuthRequest;
import com.example.Backend.dto.request.RefreshRequest;
import com.example.Backend.dto.request.UserRequest;
import com.example.Backend.dto.response.AuthResponse;
import com.example.Backend.dto.response.AuthValidateResponse;
import com.example.Backend.dto.response.UserResponse;
import com.example.Backend.exception.RefreshTokenExpiredException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.enums.TokenType;
import com.example.Backend.repository.RefreshTokenRepository;
import lombok.extern.slf4j.Slf4j;
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

    public AuthResponse login(AuthRequest authRequest) {
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

    public UserResponse register(UserRequest userRequest) {
        UserResponse userResponse = userService.createUser(userRequest);

        String otp = otpService.generateOtp(userRequest.getEmail());
        log.info("OTP register email "+ userRequest.getEmail() +": " + otp);
        emailService.sendOTPEmail(userRequest.getEmail(), otp);

        return userResponse;
    }

    public AuthResponse confirm(String email, String otp) {

        if (!otpService.validateOtp(otp, email)) {
            throw new ResourceNotFoundException("OTP không hợp lệ");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        if (userDetails == null) {
            throw new ResourceNotFoundException("User not found ở confirm");
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

    public AuthValidateResponse validateToken(String token) {

        if (blackListService.isTokenBlacklisted(token)) {
            return AuthValidateResponse.builder()
                    .status(false)
                    .message("Token is blacklisted")
                    .build();
        }
        if (jwtService.isExpiration(token, TokenType.ACCESS_TOKEN)) {
            return AuthValidateResponse.builder()
                    .status(false)
                    .message("Token is expired")
                    .build();
        }
        return AuthValidateResponse.builder()
                .status(true)
                .message("Token is valid")
                .build();
    }
}
