package com.example.Backend.dto.request;

import com.example.Backend.model.enums.DocumentType;
import com.example.Backend.model.enums.RankLicense;
import com.example.Backend.model.enums.Gender;
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
    private String serialNumber;
    private String fullName;
    private Gender gender;
    private RankLicense rankLicense;
    private LocalDate dateOfBirth;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String placeOfIssue;
    private LocationRequest location;
    private String imageFrontUrl;
    private String imageBackUrl;


}
