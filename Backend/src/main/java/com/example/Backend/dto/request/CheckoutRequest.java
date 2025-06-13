package com.example.Backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CheckoutRequest {
    private String note; // Lý do thanh toán
    private CarConditionCheckRequest carConditionCheck; // Thông tin kiểm tra tình trạng xe
    private List<ExtraChargeRequest> extraCharges; // Danh sách các khoản phụ phí
}
