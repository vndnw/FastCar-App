package com.example.Backend.repository;

import com.example.Backend.model.Booking;
import com.example.Backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findPaymentByBooking(Booking booking);
}
