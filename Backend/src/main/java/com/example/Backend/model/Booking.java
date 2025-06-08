package com.example.Backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
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
    private BigDecimal totalAmount; // ✅ Tổng số tiền thanh toán (bao gồm phí giữ chỗ, tiền thuê xe, và các khoản phụ thu nếu có)
    private BigDecimal totalPaid; // ✅ Tổng số tiền đã thanh toán
    private BigDecimal totalRefunded; // ✅ Tổng số tiền đã hoàn trả (nếu có)
    private BigDecimal totalExtraCharges; // ✅ Tổng phụ thu (nếu có)
    private BigDecimal totalDiscount; // ✅ Tổng số tiền giảm giá (nếu có)
    private BigDecimal totalLateFee; // ✅ Phí trễ hạn (nếu có)

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExtraCharge> extraCharges;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CarConditionCheck> carConditionChecks;

}
