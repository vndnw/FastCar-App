package com.example.Backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchCriteriaRequest {
    private String fistName;
    private String lastName;
    private String email;
    private String phone;
    private Boolean active;
}

