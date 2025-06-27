package com.example.Backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.BookingType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String bookingCode = "BOOKFC-" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name  = "car_id")
    private Car car;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location pickupLocation;
    @Column(name = "pickup_time", nullable = false)
    private LocalDateTime pickupTime;
    @Column(name = "return_time", nullable = false)
    private LocalDateTime returnTime;

    @Enumerated(EnumType.STRING)
    private BookingType type;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private String discountCode; // ✅ Mã giảm giá (nếu có)

    private BigDecimal rentalPrice; // ✅ Tổng giá thuê xe
    private BigDecimal reservationFee; // ✅ Phí giữ chỗ
    private BigDecimal depositAmount;  // ✅ Số tiền cọc (tạm tính)
    private BigDecimal totalRefunded; // ✅ Tổng số tiền đã hoàn trả (nếu có)
    private BigDecimal totalExtraCharges; // ✅ Tổng phụ thu (nếu có)
    private BigDecimal totalDiscount; // ✅ Tổng số tiền giảm giá (nếu có)

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Payment> payments;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ConditionCheck> conditionChecks;

}
