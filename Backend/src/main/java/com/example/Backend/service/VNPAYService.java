package com.example.Backend.service;

import com.example.Backend.config.VNPAYConfig;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor // Thêm constructor cho các dependency được inject
public class VNPAYService {

    private final RestTemplate restTemplate; // Sử dụng RestTemplate để gọi API

    public String generatePayUrl(HttpServletRequest request, @NotNull BigDecimal amount, String vnp_TxnRef) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_IpAddr = VNPAYConfig.getIpAddress(request);
//        String vnp_IpAddr = "127.0.0.1";
        log.info("vnp_IpAddr: {}", vnp_IpAddr);
        String vnp_TmnCode = VNPAYConfig.vnp_TmnCode;
        String vnp_Amount = String.valueOf(amount.multiply(new BigDecimal(100)).longValue());
        String vnp_CurrCode = "VND";
        String vnp_OrderType = "other"; // Sửa lại thành "other" hoặc một loại hợp lệ
        String vnp_Locale = "vn";
        String vnp_ReturnUrl = VNPAYConfig.vnp_ReturnUrl;
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        String vnp_OrderInfo = "Thanh toan don hang #" + vnp_TxnRef;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
//        vnp_Params.put("vnp_IpnUrl", vnp_IpnUrl);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String secretKey = VNPAYConfig.secretKey;
        String vnp_SecureHash = VNPAYConfig.hmacSHA512(secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPAYConfig.vnp_PayUrl + "?" + queryUrl;

        log.info("VNPAYService paymentUrl:{}", paymentUrl);
        return paymentUrl;
    }


    public Map<String, String> refund(HttpServletRequest request,
                                      String vnp_TxnRef,
                                      @NotNull BigDecimal amount,
                                      String createBy) {
        String vnp_RequestId = VNPAYConfig.getRandomNumber(8);
        String vnp_Version = "2.1.0";
        String vnp_Command = "refund";
        String vnp_TmnCode = VNPAYConfig.vnp_TmnCode;
        String vnp_Amount = String.valueOf(amount.multiply(new BigDecimal(100)).longValue());
        String vnp_OrderInfo = "Hoan tien cho don hang #" + vnp_TxnRef;
        String vnp_IpAddr = VNPAYConfig.getIpAddress(request);
        String vnp_TransactionNo = ""; // Nếu có thì điền, không thì để trống

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_RequestId", vnp_RequestId);
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_TransactionType", "02"); // 02: Hoàn tiền
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_TransactionNo", vnp_TransactionNo);
        vnp_Params.put("vnp_TransactionDate", vnp_CreateDate);
        vnp_Params.put("vnp_CreateBy", createBy);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Build hash data
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                hashData.append(fieldName).append('=').append(fieldValue).append('|');
            }
        }
        // Remove the last '|'
        String hashDataString = hashData.substring(0, hashData.length() - 1);

        String vnp_SecureHash = VNPAYConfig.hmacSHA512(VNPAYConfig.secretKey, hashDataString);
        vnp_Params.put("vnp_SecureHash", vnp_SecureHash);

        // GỌI API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(vnp_Params, headers);

        log.info("Sending Refund Request to VNPAY: {}", vnp_Params);

        // Sử dụng RestTemplate để gửi request
        @SuppressWarnings("unchecked")
        Map<String, String> response = restTemplate.postForObject(VNPAYConfig.vnp_ApiUrl, entity, Map.class);

        log.info("Received Refund Response from VNPAY: {}", response);

        return response;
    }

    public Map<String, String> extractVnpParams(@NotNull HttpServletRequest request) {
        Map<String, String>  fields = new HashMap<> ();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName ;
            String fieldValue ;
            fieldName = URLEncoder.encode(params.nextElement(), StandardCharsets.US_ASCII);
            fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                fields.put(fieldName, fieldValue);
            }
        }
        return fields;
    }
}