package com.example.Backend.controller;

import com.example.Backend.config.VNPAYConfig;
import com.example.Backend.service.PaymentService;
import com.example.Backend.service.VNPAYService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final VNPAYService vnpayService;

    public PaymentController(PaymentService paymentService, VNPAYService vnpayService) {
        this.paymentService = paymentService;
        this.vnpayService = vnpayService;
    }

    @GetMapping("/vnpay-payment-return")
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

    @GetMapping("/vnpay-ipn")
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

    @PostMapping("/extra-charge")
    public ResponseEntity<?> processExtraCharge(String transactionId, String reason) {
        // paymentService.processExtraCharge(transactionId, reason);
        return ResponseEntity.ok("Extra charge processed successfully");
    }
}
