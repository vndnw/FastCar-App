package com.example.Backend.service;

import com.example.Backend.dto.request.BookingRequest;
import com.example.Backend.dto.request.DiscountResquest;
import com.example.Backend.dto.response.DiscountResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.DiscountMapper;
import com.example.Backend.model.Discount;
import com.example.Backend.repository.DiscountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class DiscountService {

    private final DiscountRepository discountRepository;
    private final DiscountMapper discountMapper;

    public DiscountService(DiscountRepository discountRepository, DiscountMapper discountMapper) {
        this.discountRepository = discountRepository;
        this.discountMapper = discountMapper;
    }

    public DiscountResponse createDiscount(DiscountResquest discountResquest) {
        Discount discount = Discount.builder()
                .name(discountResquest.getName())
                .price(discountResquest.getPrice())
                .description(discountResquest.getDiscription())
                .percent(discountResquest.getPercent())
                .quantity(discountResquest.getQuantity())
                .build();
        return discountMapper.mapToResponse(discountRepository.save(discount));
    }
    public DiscountResponse updateDiscount(long discountId , DiscountResquest discountResquest) {
        Discount discount = discountRepository.findById(discountId).orElseThrow(()->new ResourceNotFoundException("Discount not found"));
        discount.setName(discountResquest.getName());
        discount.setPrice(discountResquest.getPrice());
        discount.setDescription(discountResquest.getDiscription());
        discount.setPercent(discountResquest.getPercent());
        discount.setQuantity(discountResquest.getQuantity());
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
        return discounts.map(discount -> discountMapper.mapToResponse(discount));
    }
    public DiscountResponse getDiscountById(long discountId) {
        Discount discount = discountRepository.findById(discountId).orElseThrow(()->new ResourceNotFoundException("Discount not found"));
        return discountMapper.mapToResponse(discount);
    }

    private boolean checkDiscount(String discountCode) {
        Discount discount = discountRepository.findByName(discountCode)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
        if (discount.getQuantity() <= 0) {
            log.warn("Discount with code " + discountCode + "is negative");
            return false; // Discount is out of stock
        }else if (discount.getStartDate() != null && discount.getEndDate() != null) {
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(discount.getStartDate()) || now.isAfter(discount.getEndDate())) {
                log.warn("Discount with code " + discountCode + " is not valid at this time");
                return false; // Discount is not valid at this time
            }
        }else {
            return true; // Discount is valid
        }
        return true; // Discount is valid
    }

    public boolean useDiscount(String discountCode) {
        Discount discount = discountRepository.findByName(discountCode)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
        if(!checkDiscount(discountCode)){
            log.warn("Discount with code " + discountCode + " is not valid or out of stock");
            return false;
        }
        discount.setQuantity(discount.getQuantity() - 1);
        discountRepository.save(discount);
        return true; // Discount used successfully
    }

    public Discount getDiscountByName(String discountCode) {
        return discountRepository.findByName(discountCode).orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
    }
}
