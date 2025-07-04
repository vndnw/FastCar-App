package com.example.Backend.repository.specification;

import com.example.Backend.dto.request.UserSearchCriteriaRequest;
import com.example.Backend.model.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> buildSearchSpecification(UserSearchCriteriaRequest criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(criteria.getName())) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    "%" + criteria.getName().toLowerCase() + "%"
                ));
            }

            if (StringUtils.hasText(criteria.getEmail())) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")),
                    "%" + criteria.getEmail().toLowerCase() + "%"
                ));
            }

            if (StringUtils.hasText(criteria.getPhoneNumber())) {
                predicates.add(criteriaBuilder.like(
                    root.get("phoneNumber"),
                    "%" + criteria.getPhoneNumber() + "%"
                ));
            }

            if (StringUtils.hasText(criteria.getRole())) {
                predicates.add(criteriaBuilder.equal(
                    root.get("role"),
                    criteria.getRole().toUpperCase()
                ));
            }

            if (criteria.getIsActive() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("isActive"),
                    criteria.getIsActive()
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

