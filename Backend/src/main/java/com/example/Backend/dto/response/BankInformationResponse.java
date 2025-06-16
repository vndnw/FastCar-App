package com.example.Backend.dto.response;

import com.example.Backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class BankInformationResponse {
    private String bankName;
    private String accountNumber;
    private String accountHolderName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
