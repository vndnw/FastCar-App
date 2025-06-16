package com.example.Backend.mapper;

import com.example.Backend.dto.response.BankInformationResponse;
import com.example.Backend.model.BankInformation;
import org.springframework.stereotype.Service;

@Service
public class BankInformationMapper {
    public BankInformationResponse mapToResponse(BankInformation bankInformation) {
        return BankInformationResponse.builder()
                .bankName(bankInformation.getBankName())
                .accountNumber(bankInformation.getAccountNumber())
                .accountHolderName(bankInformation.getAccountHolderName())
                .createdAt(bankInformation.getCreatedAt())
                .updatedAt(bankInformation.getUpdatedAt())
                .build();
    }
}
