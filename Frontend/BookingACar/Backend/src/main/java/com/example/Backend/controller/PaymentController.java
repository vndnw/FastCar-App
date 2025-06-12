package com.example.Backend.controller;

import com.example.Backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/callback")
    public ResponseEntity<?> paymentCallback(String transactionId, String status) {
//        paymentService.processPaymentCallback(transactionId, status);
        return ResponseEntity.ok("Payment callback processed successfully");
    }
    @PostMapping("/refund")
    public ResponseEntity<?> processRefund(String transactionId, String reason) {
//        paymentService.processRefund(transactionId, reason);
        return ResponseEntity.ok("Refund processed successfully");
    }

    @PostMapping("/extra-charge")
    public ResponseEntity<?> processExtraCharge(String transactionId, String reason) {
        // paymentService.processExtraCharge(transactionId, reason);
        return ResponseEntity.ok("Extra charge processed successfully");
    }
}
