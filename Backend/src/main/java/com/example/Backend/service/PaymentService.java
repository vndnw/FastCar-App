package com.example.Backend.service;

import com.example.Backend.dto.request.PaymentRequest;
import com.example.Backend.dto.response.PaymentResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.PaymentMapper;
import com.example.Backend.model.Booking;
import com.example.Backend.model.Payment;
import com.example.Backend.model.enums.PaymentStatus;
import com.example.Backend.model.enums.PaymentType;
import com.example.Backend.repository.BookingRepository;
import com.example.Backend.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PaymentMapper paymentMapper;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository,
                          PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.paymentMapper = paymentMapper;
    }

//    String transactionCode = "TXN-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

    public String generateTransactionCode(PaymentType paymentType) {
        String prefix = switch (paymentType) {
            case DEPOSIT -> "DEP-";
            case RENTAL_FEE -> "RENT-";
            case EXTRA_CHARGE -> "EXTRA-";
            case REFUND -> "REFUND-";
            case RESERVATION_FEE -> "RES-";
//            default -> throw new IllegalArgumentException("Invalid payment type: " + paymentType);
        };
        return prefix + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    public PaymentResponse createPayment(long bookingId, PaymentRequest  paymentRequest) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(paymentRequest.getAmount())
                .method(paymentRequest.getMethod())
                .type(paymentRequest.getType())
                .status(PaymentStatus.PENDING)
                .transactionCode(generateTransactionCode(paymentRequest.getType()))
                .build();
        return paymentMapper.mapToResponse(paymentRepository.save(payment));
    }

    public PaymentResponse getPaymentById(long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        return paymentMapper.mapToResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByBookingId(long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        List<Payment> payments = paymentRepository.findPaymentByBooking(booking);
        if (payments.isEmpty()) {
            throw new ResourceNotFoundException("No payments found for booking id: " + bookingId);
        }
        return payments.stream().map(paymentMapper::mapToResponse).collect(Collectors.toList());
    }

    public void deletePayment(long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        paymentRepository.delete(payment);
    }

    public PaymentResponse updatePayment(long paymentId, PaymentRequest paymentRequest) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        payment.setAmount(paymentRequest.getAmount());
        payment.setMethod(paymentRequest.getMethod());
        payment.setType(paymentRequest.getType());
        return paymentMapper.mapToResponse(paymentRepository.save(payment));
    }


    public PaymentResponse updatePaymentStatus(long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        payment.setStatus(status);
        return paymentMapper.mapToResponse(paymentRepository.save(payment));
    }

}
