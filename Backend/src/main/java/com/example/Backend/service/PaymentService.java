package com.example.Backend.service;

import com.example.Backend.dto.request.CheckoutRequest;
import com.example.Backend.dto.request.PaymentRequest;
import com.example.Backend.dto.response.PaymentResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.PaymentMapper;
import com.example.Backend.model.Booking;
import com.example.Backend.model.ExtraCharge;
import com.example.Backend.model.Payment;
import com.example.Backend.model.User;
import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.PaymentStatus;
import com.example.Backend.model.enums.PaymentType;
import com.example.Backend.repository.BookingRepository;
import com.example.Backend.repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PaymentMapper paymentMapper;
    private final EmailService emailService;
    private final VNPAYService vnpayService;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository,
                          PaymentMapper paymentMapper,
                          EmailService emailService,
                          VNPAYService vnpayService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.paymentMapper = paymentMapper;
        this.emailService = emailService;
        this.vnpayService = vnpayService;
    }

    public Payment addPayment(long bookingId, @NotNull PaymentRequest  paymentRequest) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        Payment payment = new Payment();
        payment.setBooking(booking);
        if(paymentRequest.getType().equals(PaymentType.EXTRA_CHARGE)) {
            payment.setType(PaymentType.EXTRA_CHARGE);
            payment.setStatus(PaymentStatus.PENDING);
            List<ExtraCharge> extraCharges = paymentRequest.getExtraChargeRequest().stream()
                    .map(extraChargeRequest -> ExtraCharge.builder()
                            .reason(extraChargeRequest.getReason())
                            .amount(extraChargeRequest.getAmount())
                            .image(extraChargeRequest.getImage())
                            .payment(payment)
                            .build())
                    .toList();
            payment.setAmount(extraCharges.stream().map(ExtraCharge::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add));
            payment.setExtraCharges(extraCharges);
            payment.setExternalRef(generateExternalRef());
        } else {
            payment.setType(paymentRequest.getType());
            payment.setAmount(paymentRequest.getAmount());
            payment.setStatus(PaymentStatus.PENDING);
            payment.setExternalRef(generateExternalRef());
        }
        return paymentRepository.save(payment);
    }

    public String generateExternalRef() {
        return "VNPAY-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6);
    }

    public PaymentResponse getPaymentById(long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        return paymentMapper.mapToResponse(payment);
    }

    public void processPaymentCallback(String externalRef, String status) {
        Payment payment = paymentRepository.findByExternalRef(externalRef)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with externalRef: " + externalRef));
        Booking booking = payment.getBooking();
        if ("success".equalsIgnoreCase(status)) {
            payment.setStatus(PaymentStatus.SUCCESS);
            switch (payment.getType()) {
                case RESERVED -> booking.setStatus(BookingStatus.CONFIRMED);
                case RENTAL, DEPOSIT -> booking.setStatus(BookingStatus.USE_IN);
                case REFUND, EXTRA_CHARGE -> booking.setStatus(BookingStatus.COMPLETED);
            }
            bookingRepository.save(booking);

            emailService.sendMailSuccess(booking, payment);

            if(payment.getType() == PaymentType.RENTAL) {
                emailService.sendMailCheckIn(booking);
                emailService.sendMailContract(booking);
            }

        } else if ("failed".equalsIgnoreCase(status)) {
            payment.setStatus(PaymentStatus.FAILED);
            if (payment.getType() == PaymentType.RESERVED) {
                booking.setStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);
            } else if (payment.getType() == PaymentType.RENTAL || payment.getType() == PaymentType.DEPOSIT) {
              //gửi thông báo cho người dùng về việc thanh toán không thành công
                // có thể thêm logic gửi email hoặc thông báo khác ở đây
            }
            emailService.sendMailFailed(booking, payment);
        } else {
            throw new IllegalArgumentException("Invalid payment status: " + status);
        }
        paymentRepository.save(payment);
    }

//    public PaymentResponse retryPayment(long id) {
//        Booking booking = bookingRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
//        if (booking.getStatus() != BookingStatus.USE_IN) {
//            throw new IllegalStateException("Không thể thanh toán lại với trạng thái booking hiện tại");
//        }
//        Payment payment = Payment.builder()
//                .booking(booking)
//                .type(request.getType())
//                .status(PaymentStatus.PENDING)
//                .amount(amount)
//                .externalRef(UUID.randomUUID().toString())
//                .build();
//        paymentRepository.save(payment);
//        return PaymentResponse.builder()
//                .id(payment.getId())
//                .amount(amount)
//                .externalRef(payment.getExternalRef())
//                .paymentUrl(paymentUrl)
//                .build();
//    }
    public PaymentResponse processRefund(long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        if (booking.getStatus() != BookingStatus.WAITING_REFUND && booking.getStatus() == BookingStatus.COMPLETED) {
            throw new IllegalStateException("Cannot process refund for booking with status: " + booking.getStatus());
        }
        Payment payment = paymentRepository.findPaymentByBookingAndType(booking, PaymentType.REFUND)
                .orElseThrow(() -> new ResourceNotFoundException("No refund payment found for booking with id: " + bookingId));

        payment.setStatus(PaymentStatus.REFUNDED);
        Payment payment2 = paymentRepository.save(payment);
        emailService.sendMailRefund(booking, payment2);
        return paymentMapper.mapToResponse(payment2);
    }

    public PaymentResponse processExtraCharge(HttpServletRequest request, long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        if(booking.getStatus() != BookingStatus.WAITING_EXTRA_CHARGE && booking.getStatus() == BookingStatus.COMPLETED) {
            throw new IllegalStateException("Cannot process extra charge for booking with status: " + booking.getStatus());
        }
        Payment payment = paymentRepository.findPaymentByBookingAndType(booking, PaymentType.EXTRA_CHARGE)
                .orElseThrow(() -> new ResourceNotFoundException("No extra charge payment found for booking with id: " + bookingId));

        String paymentUrl = vnpayService.generatePayUrl(request, payment.getAmount(),payment.getExternalRef());

        emailService.sendMailExtra(booking, payment, paymentUrl);

        return paymentMapper.mapToResponse(payment);
    }

    public Payment getPaymentByBookingIdAndType(long bookingId, PaymentType type) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return paymentRepository.findPaymentByBookingAndType(booking, type)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id: " + bookingId + " and type: " + type));
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

    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        Page<Payment> payments = paymentRepository.findAll(pageable);
        return payments.map(paymentMapper::mapToResponse);
    }

    public PaymentResponse updatePayment(long paymentId, @NotNull PaymentRequest paymentRequest) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        payment.setAmount(paymentRequest.getAmount());
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
