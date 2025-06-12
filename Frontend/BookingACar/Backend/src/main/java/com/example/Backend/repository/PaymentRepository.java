package com.example.Backend.repository;

import com.example.Backend.model.Booking;
import com.example.Backend.model.Payment;
import com.example.Backend.model.enums.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findPaymentByBooking(Booking booking);

    Optional<Payment> findByExternalRef(String externalRef);

    Optional<Payment> findPaymentByBookingAndType(Booking booking, PaymentType paymentType);
}
