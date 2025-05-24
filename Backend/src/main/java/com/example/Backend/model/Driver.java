package com.example.Backend.model;

import com.example.Backend.model.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 500)
    private String licenseNumber;

    @Column(length = 500)
    private String imageCCCDBefore;

    @Column(length = 500)
    private String imageCCCDAfter;

    @Column(length = 500)
    private String imageFaceID;

    @Enumerated(EnumType.STRING)
    private DriverStatus status;

    private boolean active;

    private boolean online;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
