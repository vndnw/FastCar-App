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
import java.util.List;

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

    private List<String> images;

    @Enumerated(EnumType.STRING)
    private CheckStatus status;

    private boolean isChecked; // Trạng thái đã kiểm tra hay chưa

    @CreationTimestamp
    private LocalDateTime createdAt;
}
