package com.example.Backend.dto.request;

import com.example.Backend.model.Location;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UserRequest {

    @NotBlank(message = "Last name cannot be null")
    private String lastName;
    @NotBlank(message = "First name cannot be null")
    private String firstName;
    private String email;
    private String phone;
    private String password;
    private LocationRequest address;
    private String profilePicture;
    private LocalDate dateOfBirth;
    private List<String> roles;
}
