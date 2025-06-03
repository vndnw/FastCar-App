package com.example.Backend.mapper;

import com.example.Backend.dto.response.DocumentResponse;
import com.example.Backend.model.Document;
import org.springframework.stereotype.Service;

@Service
public class DocumentMapper {
    public DocumentResponse mapToResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .documentType(document.getDocumentType())
                .documentNumber(document.getDocumentNumber())
                .description(document.getDescription())
                .expiryDate(document.getExpiryDate())
                .imageBackUrl(document.getImageBackUrl())
                .imageFrontUrl(document.getImageFrontUrl())
                .issueDate(document.getIssueDate())
                .updateAt(document.getUpdateAt())
                .active(document.isActive())
                .createAt(document.getCreateAt())
                .build();
    }
}
