package com.example.Backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ConfirmRegister {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @Size(min = 6 ,message = "OTP is required")
    private String otp;
}
