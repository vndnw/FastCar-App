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

    Page<Booking> findByUserId(Long userId, Pageable pageable);    @Query(value = "SELECT * FROM bookings b WHERE b.car_id = :carId AND b.status != 'CANCELLED' AND " +
            "((b.pickup_time <= :returnDate AND :pickupDate <= b.return_time) OR " +
            "(b.pickup_time BETWEEN :pickupDate AND :returnDate))", nativeQuery = true)
    List<Booking> findOverlappingBookings(
            @Param("carId") Long carId,
            @Param("pickupDate") LocalDateTime pickupDate,
            @Param("returnDate") LocalDateTime returnDate);
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    Page<Booking> findByCarId(Long carId, Pageable pageable);
    
    @Query(value = "SELECT * FROM bookings b WHERE b.driver_id = :driverId AND b.status NOT IN ('CANCELLED', 'COMPLETED') AND " +
            "((b.pickup_time <= :returnDate AND :pickupDate <= b.return_time) OR " +
            "(b.pickup_time BETWEEN :pickupDate AND :returnDate))", nativeQuery = true)
    List<Booking> findDriverOverlappingBookings(
            @Param("driverId") Long driverId,
            @Param("pickupDate") LocalDateTime pickupDate,
            @Param("returnDate") LocalDateTime returnDate);
}
