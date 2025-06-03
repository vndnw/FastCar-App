package com.example.Backend.dto.request;

import com.example.Backend.model.enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class DocumentRequest {
    private DocumentType documentType;
    private String documentNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String imageFrontUrl;
    private String imageBackUrl;
    private String description;
}
