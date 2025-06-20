package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.*;
import com.example.Backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest registerRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully registered")
                .data(authService.register(registerRequest))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> confirm(@RequestBody @Valid ConfirmRegister confirmRegister) {
        ResponseData<?> responseData;
        if(authService.verifyOtp(confirmRegister.getEmail(), confirmRegister.getOtp())){
            responseData = ResponseData.builder()
                    .status(200)
                    .message("Successfully verify otp")
                    .build();
        }else{
            responseData = ResponseData.builder()
                    .status(200)
                    .message("Unsuccessfully verify otp")
                    .build();
        }
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

    @PreAuthorize("hasRole('user')")
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

    @PostMapping("/validate_token")
    public ResponseEntity<?> validateToken(@RequestBody ValidateTokenRequest token) {
        ResponseData<?> responseData ;
        if(authService.validateToken(token.getToken())) {
            responseData = ResponseData.builder()
                    .status(200)
                    .message("Token is valid")
                    .data(null)
                    .build();
        } else {
            responseData = ResponseData.builder()
                    .status(400)
                    .message("Token is invalid")
                    .data(null)
                    .build();
        }
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/check-email-exists")
    public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
        boolean exists = authService.checkEmailExists(email);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Email existence check completed")
                .data(exists)
                .build();
        return ResponseEntity.ok(responseData);
    }

    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestParam String email, @RequestParam String newPassword) {
        if(authService.changePassword(email, newPassword)) {
            ResponseData<?> responseData = ResponseData.builder()
                    .status(200)
                    .message("Password changed successfully")
                    .data(null)
                    .build();
            return ResponseEntity.ok(responseData);
        }else {
            ResponseData<?> responseData = ResponseData.builder()
                    .status(400)
                    .message("Failed to change password")
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(responseData);
        }
    }
}
