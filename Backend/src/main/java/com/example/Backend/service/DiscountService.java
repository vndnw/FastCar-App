package com.example.Backend.service;

import com.example.Backend.dto.request.DiscountResquest;
import com.example.Backend.dto.response.DiscountResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.DiscountMapper;
import com.example.Backend.model.Discount;
import com.example.Backend.repository.DiscountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
                .discription(discountResquest.getDiscription())
                .percent(discountResquest.getPercent())
                .quantity(discountResquest.getQuantity())
                .build();
        return discountMapper.mapToResponse(discountRepository.save(discount));
    }
    public DiscountResponse updateDiscount(long discountId , DiscountResquest discountResquest) {
        Discount discount = discountRepository.findById(discountId).orElseThrow(()->new ResourceNotFoundException("Discount not found"));
        discount.setName(discountResquest.getName());
        discount.setPrice(discountResquest.getPrice());
        discount.setDiscription(discountResquest.getDiscription());
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
}
