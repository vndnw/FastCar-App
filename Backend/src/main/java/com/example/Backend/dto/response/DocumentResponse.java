package com.example.Backend.dto.response;

import com.example.Backend.model.enums.DocumentStatus;
import com.example.Backend.model.enums.DocumentType;
import com.example.Backend.model.enums.RankLicense;
import com.example.Backend.model.enums.Gender;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentResponse {
    private long id;
    private DocumentType documentType;
    private String serialNumber;
    private String name;
    private RankLicense rankLicense;
    private Gender gender;
    private LocalDate dateOfBirth;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String placeOfIssue;
    private String address;
    private String imageFrontUrl;
    private String imageBackUrl;
    private boolean active;
    private DocumentStatus status;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
