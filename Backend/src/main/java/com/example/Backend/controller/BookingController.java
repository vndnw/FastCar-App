package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.example.Backend.dto.response.BookingResponse;
import com.example.Backend.dto.response.CarBookingScheduleResponse;
import com.example.Backend.dto.response.PaymentResponse;
import com.example.Backend.dto.response.ReservationFeeResponse;
import com.example.Backend.model.Payment;
import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.PaymentType;
import com.example.Backend.service.BookingService;
import com.example.Backend.service.CarConditionCheckService;
import com.example.Backend.service.PaymentService;
import com.example.Backend.service.VNPAYService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService;
    private final CarConditionCheckService carConditionCheckService;
    private final PaymentService paymentService;
    private final VNPAYService vnpayService;

    @Autowired
    public BookingController(BookingService bookingService,
                             CarConditionCheckService carConditionCheckService  ,
                             PaymentService paymentService,
                             VNPAYService vnpayService) {
        this.bookingService = bookingService;
        this.carConditionCheckService = carConditionCheckService;
        this.paymentService = paymentService;
        this.vnpayService = vnpayService;
    }
    @PreAuthorize("hasRole('admin')")
    @PostMapping
    public ResponseEntity<ResponseData<?>> createBooking(HttpServletRequest request, @RequestBody BookingRequest bookingRequest) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.CREATED.value())
                .message("Booking created successfully")
                .data(bookingService.createBookingIsLogin(request, bookingRequest))
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<?>> getBookingById(@PathVariable Long id) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Booking retrieved successfully")
                .data(bookingService.getBookingById(id))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/history")
    public ResponseEntity<ResponseData<?>> getBookingHistory(@RequestParam("userId") Long userId , @PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Booking history retrieved successfully")
                .data(bookingService.getBookingsByUserId(userId,pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/my-bookings")
    public ResponseEntity<ResponseData<?>> getUserBookings(
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("User bookings retrieved successfully")
                .data(bookingService.getUserBookings(pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/my-bookings/now")
    public ResponseEntity<ResponseData<?>> getUserBookingsNow(@PageableDefault(size = 10, page = 0, sort = "createdAt") Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("User bookings for now retrieved successfully")
                .data(bookingService.getUserBookingsNow(pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/my-bookings/status/{status}")
    public ResponseEntity<ResponseData<?>> getUserBookingsByStatus(
            @PathVariable BookingStatus status) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("User bookings with status " + status + " retrieved successfully")
                .data(bookingService.getUserBookingsByStatus(status))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/my-bookings/upcoming")
    public ResponseEntity<ResponseData<?>> getUpcomingBookings() {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Upcoming bookings retrieved successfully")
                .data(bookingService.getUpcomingUserBookings())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping
    public ResponseEntity<ResponseData<?>> getAllBookings(
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("All bookings retrieved successfully")
                .data(bookingService.getAllBookings(pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/status/{status}")
    public ResponseEntity<ResponseData<?>> getBookingsByStatus(
            @PathVariable BookingStatus status,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Bookings with status " + status + " retrieved successfully")
                .data(bookingService.getBookingsByStatus(status, pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponseData<?>> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateRequest request) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Booking status updated successfully")
                .data(bookingService.updateBookingStatus(id, request))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PreAuthorize("hasRole('admin')")
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ResponseData<?>> cancelBooking(
            @PathVariable Long id,
            @RequestBody CancellationRequest request) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Booking cancelled successfully")
                .data(bookingService.cancelBooking(id, request.getReason()))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PreAuthorize("hasRole('admin')")
    @GetMapping("/check-availability")
    public ResponseEntity<ResponseData<?>> checkCarAvailability(
            @RequestParam Long carId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        boolean isAvailable = bookingService.isCarAvailable(carId, startDate, endDate);

        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Car availability checked successfully")
                .data(isAvailable)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('owner')")
    @GetMapping("/car/{carId}")
    public ResponseEntity<ResponseData<?>> getBookingsByCarId(
            @PathVariable Long carId,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Car bookings retrieved successfully")
                .data(bookingService.getBookingsByCarId(carId, pageable))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/car/{carId}/schedule")
    public ResponseEntity<?> getCarBookingSchedule(@PathVariable Long carId) {
        List<CarBookingScheduleResponse> schedule = bookingService.getCarBookingSchedule(carId);
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Car booking schedule retrieved successfully")
                .data(schedule)
                .build();
        return ResponseEntity.ok(response);
    }

    // tải thông tin hình ảnh xe để check
    @PreAuthorize("hasRole('owner')")
    @PostMapping("/{bookingId}/condition-check")
    public ResponseEntity<ResponseData<?>> createCarConditionCheckBefore(
            @PathVariable Long bookingId,
            @RequestBody CarConditionCheckRequest carConditionCheckRequest) {

        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.CREATED.value())
                .message("Car condition check before rental created successfully")
                .data(carConditionCheckService.createCarConditionCheck(bookingId, carConditionCheckRequest))
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('user')")
    @PostMapping("/{id}/checkin")
    public ResponseEntity<ResponseData<?>> createCheckin(@PathVariable long id){
        if (!carConditionCheckService.isCarConditionCheckExists(id)) {
            return new ResponseEntity<>(ResponseData.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Car condition check does not exist for this booking")
                    .build(), HttpStatus.BAD_REQUEST);
        }
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Check-in created successfully")
                .data(bookingService.createCheckin(id))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('owner')")
    @PostMapping("/{id}/checkout")
    public ResponseEntity<ResponseData<?>> createCheckout(@PathVariable long id, @RequestBody CheckoutRequest checkoutRequest) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Checkout created successfully")
                .data(bookingService.createCheckout(id, checkoutRequest))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{id}/finalize")
    public ResponseEntity<ResponseData<?>> finalizeBooking(@PathVariable long id) {
        ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Booking finalized successfully")
//                .data(bookingService.finalizeBooking(id))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @PostMapping("/{id}/refund")
    public ResponseEntity<?> createRefund(HttpServletRequest request, @PathVariable Long id) {
        Payment refundPayment = paymentService.getPaymentByBookingIdAndType(id, PaymentType.REFUND);
        if (refundPayment == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy yêu cầu hoàn tiền cho booking này"));
        }
        String vnp_TxnRef = "14389106";
        BigDecimal originalAmount = refundPayment.getAmount();

        String createBy = SecurityContextHolder.getContext().getAuthentication().getName();

        Map<String, String> vnPayResponse = vnpayService.refund(
                request,
                vnp_TxnRef,
                originalAmount,
                createBy
        );
        String responseCode = vnPayResponse.get("vnp_ResponseCode");
        if ("00".equals(responseCode)) {
            paymentService.processRefund(id);
            return ResponseEntity.ok(Map.of("message", "Yêu cầu hoàn tiền thành công", "data", vnPayResponse));
        } else {

            return ResponseEntity.badRequest().body(Map.of("message", "Yêu cầu hoàn tiền thất bại", "data", vnPayResponse));
        }
    }

    @PreAuthorize("hasRole('admin')")
    @PostMapping("/{id}/extra-charge")
    public ResponseEntity<?> processExtraCharge(HttpServletRequest request,@PathVariable long id) {
         ResponseData<?> response = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Extra charge processed successfully")
                .data(paymentService.processExtraCharge(request,id))
                .build();
        return ResponseEntity.ok(response);
    }
}
