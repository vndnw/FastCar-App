package com.example.Backend.model;

import com.example.Backend.model.enums.DocumentStatus;
import com.example.Backend.model.enums.DocumentType;
import com.example.Backend.model.enums.RankLicense;
import com.example.Backend.model.enums.Gender;
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
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private DocumentType documentType;
    private String serialNumber;
    private String name;
    private LocalDate dateOfBirth;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String placeOfIssue;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "location_id")
    private Location location;

    private String imageFrontUrl;
    private String imageBackUrl;

    private RankLicense rankLicense;
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;
    @Column(columnDefinition = "boolean default false")
    private boolean active;
    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;
}
