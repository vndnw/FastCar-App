package com.example.Backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardResponse {
    private long totalUsers;
    private long totalCars;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private long carsPendingApproval;
    private long documentsPendingApproval;
    private long bookingsAwaitingAction;
}
