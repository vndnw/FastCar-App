package com.example.Backend.dto.response;

import com.example.Backend.model.Car;
import com.example.Backend.model.enums.DocumentType;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    private String documentNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String imageFrontUrl;
    private String imageBackUrl;
    private String description;
    private boolean active;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
