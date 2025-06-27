package com.example.Backend.repository;

import com.example.Backend.model.Booking;
import com.example.Backend.model.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    @Query(value = "SELECT * FROM bookingacar.bookings b WHERE b.car_id = :carId AND b.status != 'CANCELLED' AND " +
            "((b.pickup_time <= :returnDate AND :pickupDate <= b.return_time) OR " +
            "(b.pickup_time BETWEEN :pickupDate AND :returnDate))", nativeQuery = true)
    List<Booking> findOverlappingBookings(@Param("carId") Long carId, @Param("pickupDate") LocalDateTime pickupDate, @Param("returnDate") LocalDateTime returnDate);

    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    Page<Booking> findByUserIdAndStatusNotAndStatusNot(long userId, BookingStatus status1, BookingStatus status2, Pageable pageable);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    Page<Booking> findByCarId(Long carId, Pageable pageable);

    List<Booking> findByCarId(Long carId);
    
    @Query(value = "SELECT * FROM bookingacar.bookings b WHERE b.driver_id = :driverId AND b.status NOT IN ('CANCELLED', 'COMPLETED') AND " +
            "((b.pickup_time <= :returnDate AND :pickupDate <= b.return_time) OR " +
            "(b.pickup_time BETWEEN :pickupDate AND :returnDate))", nativeQuery = true)
    List<Booking> findDriverOverlappingBookings(
            @Param("driverId") Long driverId,
            @Param("pickupDate") LocalDateTime pickupDate,
            @Param("returnDate") LocalDateTime returnDate);

    @Query("SELECT SUM(b.rentalPrice) FROM Booking b WHERE b.status = 'COMPLETED'")
    Optional<BigDecimal> calculateTotalRevenue();

    long countByStatusIn(Collection<BookingStatus> statuses);

    Page<Booking> findByStatusIn(Collection<BookingStatus> statuses, Pageable pageable);
}
