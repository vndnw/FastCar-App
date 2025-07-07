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

            if (StringUtils.hasText(criteria.getFistName())) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("fistName")),
                    "%" + criteria.getFistName().toLowerCase() + "%"
                ));
            }

            if (StringUtils.hasText(criteria.getLastName())) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("lastName")),
                    "%" + criteria.getLastName().toLowerCase() + "%"
                ));
            }

            if (StringUtils.hasText(criteria.getEmail())) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")),
                    "%" + criteria.getEmail().toLowerCase() + "%"
                ));
            }

            if (StringUtils.hasText(criteria.getPhone())) {
                predicates.add(criteriaBuilder.like(
                    root.get("phone"),
                    "%" + criteria.getPhone() + "%"
                ));
            }

            if (criteria.getActive() != null) {
                predicates.add(criteriaBuilder.equal(
                    root.get("active"),
                    criteria.getActive()
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

