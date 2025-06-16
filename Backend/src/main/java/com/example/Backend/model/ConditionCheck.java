package com.example.Backend.model;

import com.example.Backend.model.enums.CheckStatus;
import com.example.Backend.model.enums.CheckType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "condition_checks")
public class ConditionCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking; // Assuming Booking is another entity in your application

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id")
    private Car car; // Assuming Car is another entity in your application

    @Enumerated(EnumType.STRING)
    private CheckType type; // BEFORE_RENTAL hoặc AFTER_RENTAL

    private int odometer;
    private String fuelLevel;
    private String interiorStatus;
    private String damageNote;

    private String imageFrontUrl;
    private String imageRearUrl;
    private String imageLeftUrl;
    private String imageRightUrl;
    private String imageOdoUrl;
    private String imageFuelUrl;
    private String imageOtherUrl;

    @Enumerated(EnumType.STRING)
    private CheckStatus status;

    private boolean isChecked; // Trạng thái đã kiểm tra hay chưa

    @CreationTimestamp
    private LocalDateTime createdAt;
}
