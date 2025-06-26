package com.example.Backend.controller;

import com.example.Backend.config.VNPAYConfig;
import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.PaymentRequest;
import com.example.Backend.service.PaymentService;
import com.example.Backend.service.VNPAYService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final VNPAYService vnpayService;

    public PaymentController(PaymentService paymentService, VNPAYService vnpayService) {
        this.paymentService = paymentService;
        this.vnpayService = vnpayService;
    }


    @PostMapping("/callback")
    public ResponseEntity<String> paymentReturn(HttpServletRequest request) {
        Map<String, String> fields = vnpayService.extractVnpParams(request);

        String vnp_SecureHash = fields.remove("vnp_SecureHash");

        String signValue = VNPAYConfig.hashAllFields(fields); // custom function

        if (!signValue.equalsIgnoreCase(vnp_SecureHash)) {
            return ResponseEntity.badRequest().body("INVALID HASH");
        }

        String externalRef = fields.get("vnp_TxnRef");
        String responseCode = fields.get("vnp_ResponseCode");
        String transactionStatus = fields.get("vnp_TransactionStatus");

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            // ✅ Giao dịch thành công → cập nhật đơn hàng
            paymentService.processPaymentCallback(externalRef, "success");
            return ResponseEntity.ok("OK");
        } else {
            // ❌ Giao dịch thất bại
            paymentService.processPaymentCallback(externalRef, "failed");
            return ResponseEntity.ok("FAILED");
        }
    }

    @PostMapping("/vnpay-ipn")
    public ResponseEntity<?> vnpayIpn(HttpServletRequest request) {
        Map<String, String> fields = vnpayService.extractVnpParams(request);

        String vnp_SecureHash = fields.remove("vnp_SecureHash");
        String signValue = VNPAYConfig.hashAllFields(fields); // custom function

        if (!signValue.equalsIgnoreCase(vnp_SecureHash)) {
            return ResponseEntity.badRequest().body("INVALID HASH");
        }

        String externalRef = fields.get("vnp_TxnRef");
        String responseCode = fields.get("vnp_ResponseCode");
        String transactionStatus = fields.get("vnp_TransactionStatus");

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            // ✅ Giao dịch thành công → cập nhật đơn hàng
            paymentService.processPaymentCallback(externalRef, "success");
            return ResponseEntity.ok("OK");
        } else {
            // ❌ Giao dịch thất bại
            paymentService.processPaymentCallback(externalRef, "failed");
            return ResponseEntity.ok("FAILED");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPayments(@PageableDefault(page = 0, size = 10, sort = "createdAt") Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Success")
                .status(200)
                .data(paymentService.getAllPayments(pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Payment retrieved successfully")
                .status(200)
                .data(paymentService.getPaymentById(id))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayment(@PathVariable Long id, @RequestBody PaymentRequest paymentDetails) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Payment updated successfully")
                .status(200)
                .data(paymentService.updatePayment(id, paymentDetails))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentsByBookingId(@PathVariable Long bookingId) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Payments retrieved successfully")
                .status(200)
                .data(paymentService.getPaymentsByBookingId(bookingId))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        ResponseData<?> responseData = ResponseData.builder()
                .message("Payment deleted successfully")
                .status(200)
                .build();
        return ResponseEntity.ok(responseData);
    }

}
