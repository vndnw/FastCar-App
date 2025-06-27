package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.DiscountResquest;
import com.example.Backend.model.enums.DiscountStatus;
import com.example.Backend.service.DiscountService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/discount")
public class DiscountController {

    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @PreAuthorize("hasRole('admin')")
    @PostMapping
    public ResponseEntity<?> addDiscount(@RequestBody DiscountResquest discountResquest) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Successfully added discount")
                .data(discountService.createDiscount(discountResquest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping
    public ResponseEntity<?> getAllDiscount(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Successfully retrieved all discounts")
                .data(discountService.getAllDiscount(pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDiscountById(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Successfully retrieved discount")
                .data(discountService.getDiscountById(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDiscount(@PathVariable Long id, @RequestBody DiscountResquest discountResquest) {
        ResponseData<?> responseData  = ResponseData.builder()
                .message("Successfully updated discount")
                .data(discountService.updateDiscount(id, discountResquest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Successfully deleted discount")
                .build();
        discountService.deleteDiscount(id);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("get-discounts-active")
    public ResponseEntity<?> getAllActiveDiscounts() {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Successfully retrieved all active discounts")
                .data(discountService.getAllDiscountActive())
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<?> updateDiscountStatus(@PathVariable Long id, @PathVariable DiscountStatus status) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Successfully updated discount status")
                .data(discountService.updateStatus(id, status))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


    @GetMapping("/code/{code}")
    public ResponseEntity<?> checkDiscountCode(@PathVariable String code) {
        ResponseData<?> responseData = ResponseData.builder()
                .message("Successfully checked discount code")
                .data(discountService.getDiscountByCode(code))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
