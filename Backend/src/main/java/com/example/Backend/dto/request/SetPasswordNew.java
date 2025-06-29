package com.example.Backend.dto.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class SetPasswordNew {
    private String email;
    private String newPassword;
}
