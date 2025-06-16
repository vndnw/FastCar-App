package com.example.Backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class BankInformationRequest {
    private String bankName;
    private String accountNumber;
    private String accountHolderName;
}
