package com.example.Backend.dto.response;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UserResponse {
    private long id;
    private String lastName;
    private String firstName;
    private String email;
    private String phone;
    private BankInformationResponse bankInformation;
    private LocationResponse address;
    private String profilePicture;
    private LocalDate dateOfBirth;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> roles;
}
