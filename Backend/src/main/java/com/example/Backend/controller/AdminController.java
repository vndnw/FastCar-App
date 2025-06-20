package com.example.Backend.controller;

import com.example.Backend.service.AdminService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStatistics() {
        return ResponseEntity.ok(adminService.getDashboardStatistics());
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/new-users-in-last-7-days")
    public ResponseEntity<?> getNewUsersInLast7Days(Pageable pageable) {
        return ResponseEntity.ok(adminService.getNewUsersInLast7Days(pageable));
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/booking-waiting-approval")
    public ResponseEntity<?> getBookingWaitingApproval(Pageable pageable) {
        return ResponseEntity.ok(adminService.getBookingsAwaitingAction(pageable));
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/car-pending-approval")
    public ResponseEntity<?> getCarPendingApproval(Pageable pageable) {
        return ResponseEntity.ok(adminService.getCarsPendingApproval(pageable));
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/document-pending-approval")
    public ResponseEntity<?> getDocumentPendingApproval(Pageable pageable) {
        return ResponseEntity.ok(adminService.getDocumentsPendingApproval(pageable));
    }

}
