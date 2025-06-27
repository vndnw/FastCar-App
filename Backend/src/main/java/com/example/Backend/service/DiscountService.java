package com.example.Backend.service;

import com.example.Backend.dto.request.BookingRequest;
import com.example.Backend.dto.request.DiscountResquest;
import com.example.Backend.dto.response.DiscountResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.DiscountMapper;
import com.example.Backend.model.Discount;
import com.example.Backend.model.enums.DiscountStatus;
import com.example.Backend.repository.DiscountRepository;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class DiscountService {

    private final DiscountRepository discountRepository;
    private final DiscountMapper discountMapper;

    public DiscountService(DiscountRepository discountRepository, DiscountMapper discountMapper) {
        this.discountRepository = discountRepository;
        this.discountMapper = discountMapper;
    }

    public DiscountResponse createDiscount(@NotNull DiscountResquest discountResquest) {
        Discount discount = Discount.builder()
                .code(discountResquest.getCode())
                .description(discountResquest.getDiscription())
                .percent(discountResquest.getPercent())
                .quantity(discountResquest.getQuantity())
                .startDate(discountResquest.getStartDate())
                .endDate(discountResquest.getEndDate())
                .build();
        return discountMapper.mapToResponse(discountRepository.save(discount));
    }
    public DiscountResponse updateDiscount(long discountId , @NotNull DiscountResquest discountResquest) {
        Discount discount = discountRepository.findById(discountId).orElseThrow(()->new ResourceNotFoundException("Discount not found"));
        discount.setCode(discountResquest.getCode());
        discount.setDescription(discountResquest.getDiscription());
        discount.setPercent(discountResquest.getPercent());
        discount.setQuantity(discountResquest.getQuantity());
        discount.setStartDate(discountResquest.getStartDate());
        discount.setEndDate(discountResquest.getEndDate());
        return discountMapper.mapToResponse(discountRepository.save(discount));
    }
    public void deleteDiscount(long discountId) {
        Discount discount = discountRepository.findById(discountId).orElseThrow(()->new ResourceNotFoundException("Discount not found"));
        discountRepository.deleteById(discountId);
    }
    public Page<DiscountResponse> getAllDiscount(Pageable pageable) {
        Page<Discount> discounts = discountRepository.findAll(pageable);
        if (discounts.getTotalElements() < 0) {
            throw new ResourceNotFoundException("No discount found");
        }
        return discounts.map(discountMapper::mapToResponse);
    }

    public List<DiscountResponse> getAllDiscountActive() {
        List<Discount> discounts = discountRepository.findAllByStatus(DiscountStatus.ACTIVE);

        if (discounts.isEmpty()) {
            throw new ResourceNotFoundException("No active discount found");
        }

        return discounts.stream().map(discountMapper::mapToResponse).toList();
    }

    public DiscountResponse getDiscountById(long discountId) {
        Discount discount = discountRepository.findById(discountId).orElseThrow(()->new ResourceNotFoundException("Discount not found"));
        return discountMapper.mapToResponse(discount);
    }

    private boolean checkDiscount(@NotNull Discount discount) {
        if (discount.getQuantity() <= 0) {
            log.warn("Discount with code " + discount.getCode() + "is negative");
            return false; // Discount is out of stock
        }
        else if (discount.getStartDate() != null && discount.getEndDate() != null) {
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(discount.getStartDate()) || now.isAfter(discount.getEndDate())) {
                log.warn("Discount with code " + discount.getCode() + " is not valid at this time");
                return false; // Discount is not valid at this time
            }
        }else {
            return true; // Discount is valid
        }
        return true; // Discount is valid
    }

    public int useDiscount(String discountCode) {
        Discount discount = discountRepository.findDiscountByCode(discountCode)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
        if(!checkDiscount(discount)){
            log.warn("Discount with code " + discountCode + " is not valid or out of stock");
            return 0;
        }

        discount.setQuantity(discount.getQuantity() - 1);
        if(discount.getQuantity() <= 0){
            discount.setStatus(DiscountStatus.INACTIVE);
        }
        discountRepository.save(discount);
        return discount.getPercent();
    }

    public boolean updateStatus(long id ,DiscountStatus discountStatus) {
        Discount discount = discountRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
        if (discount.getStatus() == discountStatus) {
            log.warn("Discount with id " + id + " already has status " + discountStatus);
            return false; // No change in status
        }
        discount.setStatus(discountStatus);
        discountRepository.save(discount);
        return true; // Status updated successfully
    }

    public DiscountResponse getDiscountByCode(String discountCode) {
        return discountMapper.mapToResponse(discountRepository.findDiscountByCode(discountCode).orElseThrow(() -> new ResourceNotFoundException("Discount not found")));
    }
}
