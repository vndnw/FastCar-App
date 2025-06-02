package com.example.Backend.repository;

import com.example.Backend.model.Booking;
import com.example.Backend.model.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);
    @Query(value = "SELECT * FROM bookings b WHERE b.car_id = :carId AND b.status != 'CANCELLED' AND " +
            "((b.pickup_time <= :endDate AND :startDate <= DATE_ADD(b.pickup_time, INTERVAL 1 DAY)) OR " +
            "(b.pickup_time BETWEEN :startDate AND :endDate))", nativeQuery = true)
    List<Booking> findOverlappingBookings(
            @Param("carId") Long carId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);


    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    Page<Booking> findByCarId(Long carId, Pageable pageable);
}
