package com.example.Backend.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class UpdateInfoRequest {
    @NotBlank(message = "Last name cannot be null")
    private String lastName;
    @NotBlank(message = "First name cannot be null")
    private String firstName;
    private LocationRequest address;
    private String profilePicture;
    private LocalDate dateOfBirth;
    private BankInformationRequest bankInformation;
}
