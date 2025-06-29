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
                .name(document.getName())
                .gender(document.getGender() != null ? document.getGender() : null)
                .rankLicense(document.getRankLicense() != null ? document.getRankLicense() : null)
                .serialNumber(document.getSerialNumber())
                .dateOfBirth(document.getDateOfBirth())
                .issueDate(document.getIssueDate())
                .expiryDate(document.getExpiryDate())
                .placeOfIssue(document.getPlaceOfIssue())
                .address(document.getLocation() != null ? document.getLocation().getAddress() : "")
                .imageBackUrl(document.getImageBackUrl() != null ? document.getImageBackUrl() : "")
                .imageFrontUrl(document.getImageFrontUrl() != null ? document.getImageFrontUrl() : "")
                .updateAt(document.getUpdateAt())
                .active(document.isActive())
                .status(document.getStatus())
                .createAt(document.getCreateAt())
                .build();
    }

}
