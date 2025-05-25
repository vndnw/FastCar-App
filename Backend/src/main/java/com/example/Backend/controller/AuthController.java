package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.AuthRequest;
import com.example.Backend.dto.request.ConfirmRegister;
import com.example.Backend.dto.request.RefreshRequest;
import com.example.Backend.dto.request.UserRequest;
import com.example.Backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully logged in")
                .data(authService.login(authRequest))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequest userRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully registered")
                .data(authService.register(userRequest))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestBody ConfirmRegister confirmRegister) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully confirmed")
                .data(authService.confirm(confirmRegister.getEmail(), confirmRegister.getOtp()))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest refreshRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully refreshed")
                .data(authService.refreshToken(refreshRequest))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully logged out")
                .build();
        authService.logout(token);
        return ResponseEntity.ok(responseData);
    }
    @PostMapping("validate_token")
    public ResponseEntity<?> validateToken(@RequestBody String token) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully validated")
                .data(authService.validateToken(token))
                .build();
        return ResponseEntity.ok(responseData);
    }
}
