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
                .description(document.getDescription() != null ? document.getDescription() : "")
                .imageBackUrl(document.getImageBackUrl() != null ? document.getImageBackUrl() : "")
                .imageFrontUrl(document.getImageFrontUrl() != null ? document.getImageFrontUrl() : "")
                .updateAt(document.getUpdateAt())
                .active(document.isActive())
                .createAt(document.getCreateAt())
                .build();
    }
}
