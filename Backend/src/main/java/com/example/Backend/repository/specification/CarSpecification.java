package com.example.Backend.repository.specification;

import com.example.Backend.dto.request.CarSearchCriteriaRequest;
import com.example.Backend.model.Booking;
import com.example.Backend.model.Car;
import com.example.Backend.model.Location;
import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.CarStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class CarSpecification {
    public static Specification<Car> findByCriteria(CarSearchCriteriaRequest criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Car, Location> locationJoin = root.join("location");

            // --- Điều kiện cơ bản ---
            predicates.add(criteriaBuilder.equal(root.get("active"), true));
            predicates.add(criteriaBuilder.equal(root.get("status"), CarStatus.AVAILABLE));

            // --- Lọc theo thuộc tính xe ---
            if (criteria.getBrandId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("brand").get("id"), criteria.getBrandId()));
            }
            if (StringUtils.hasText(criteria.getCarType())) {
                predicates.add(criteriaBuilder.equal(root.get("carType").as(String.class), criteria.getCarType().toUpperCase()));
            }
            if (StringUtils.hasText(criteria.getFuelType())) {
                predicates.add(criteriaBuilder.equal(root.get("fuelType").as(String.class), criteria.getFuelType().toUpperCase()));
            }
            if (criteria.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("pricePerHour"), criteria.getMinPrice()));
            }
            if (criteria.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("pricePerHour"), criteria.getMaxPrice()));
            }
            if (criteria.getMinSeats() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("seats"), criteria.getMinSeats()));
            }

            // --- Lọc theo ngày có sẵn (Availability) ---
            if (criteria.getStartDate() != null && criteria.getEndDate() != null) {
                assert query != null;
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Booking> bookingRoot = subquery.from(Booking.class);
                subquery.select(bookingRoot.get("car").get("id"));

                // Các trạng thái booking được coi là "đã chiếm chỗ"
                Predicate statusMatch = bookingRoot.get("status").in(
                        BookingStatus.CONFIRMED, BookingStatus.PENDING, BookingStatus.USE_IN);

                // Điều kiện khoảng thời gian đặt bị trùng lặp
                Predicate overlap = criteriaBuilder.or(
                        criteriaBuilder.between(bookingRoot.get("pickupTime"), criteria.getStartDate().atStartOfDay(), criteria.getEndDate().atTime(23, 59, 59)),
                        criteriaBuilder.between(bookingRoot.get("returnTime"), criteria.getStartDate().atStartOfDay(), criteria.getEndDate().atTime(23, 59, 59)),
                        criteriaBuilder.and(
                                criteriaBuilder.lessThan(bookingRoot.get("pickupTime"), criteria.getStartDate().atStartOfDay()),
                                criteriaBuilder.greaterThan(bookingRoot.get("returnTime"), criteria.getEndDate().atTime(23, 59, 59))
                        )
                );

                subquery.where(criteriaBuilder.equal(bookingRoot.get("car"), root), statusMatch, overlap);
                predicates.add(criteriaBuilder.not(criteriaBuilder.exists(subquery)));
            }

            // --- Lọc địa điểm (Xử lý theo thứ tự ưu tiên) ---
            if (criteria.getLatitude() != null && criteria.getLongitude() != null) {
                // ƯU TIÊN 1: TÌM THEO BÁN KÍNH
                double radius = criteria.getRadiusInKm() != null ? criteria.getRadiusInKm() : 10.0; // Mặc định 10km
                Expression<Double> distanceInKm = createDistanceExpression(criteriaBuilder, locationJoin, criteria.getLatitude(), criteria.getLongitude());
                predicates.add(criteriaBuilder.lessThanOrEqualTo(distanceInKm, radius));

                // Sắp xếp kết quả theo khoảng cách gần nhất
                assert query != null;
                query.orderBy(criteriaBuilder.asc(distanceInKm));

            } else if (StringUtils.hasText(criteria.getCity()) || StringUtils.hasText(criteria.getDistrict())) {
                // ƯU TIÊN 2: TÌM THEO CITY/DISTRICT
                if (StringUtils.hasText(criteria.getCity())) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder.lower(locationJoin.get("city")), "%" + criteria.getCity().toLowerCase() + "%"));
                }
                if (StringUtils.hasText(criteria.getDistrict())) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder.lower(locationJoin.get("district")), "%" + criteria.getDistrict().toLowerCase() + "%"));
                }
            } else if (StringUtils.hasText(criteria.getLocation())) {
                // ƯU TIÊN 3: TÌM THEO TEXT CHUNG
                String pattern = "%" + criteria.getLocation().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(locationJoin.get("city")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(locationJoin.get("district")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(locationJoin.get("address")), pattern)
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Hàm private để tạo biểu thức tính khoảng cách Haversine
    private static Expression<Double> createDistanceExpression(CriteriaBuilder cb, Join<Car, Location> locationJoin, double lat, double lon) {
        Expression<Double> carLatRad = cb.function("radians", Double.class, locationJoin.get("latitude"));
        Expression<Double> carLonRad = cb.function("radians", Double.class, locationJoin.get("longitude"));
        Expression<Double> userLatRad = cb.function("radians", Double.class, cb.literal(lat));
        Expression<Double> userLonRad = cb.function("radians", Double.class, cb.literal(lon));

        Expression<Double> deltaLon = cb.diff(carLonRad, userLonRad);
        Expression<Double> deltaLat = cb.diff(carLatRad, userLatRad);

        Expression<Double> a = cb.sum(
                cb.prod(cb.function("sin", Double.class, cb.quot(deltaLat, 2)), cb.function("sin", Double.class, cb.quot(deltaLat, 2))),
                cb.prod(
                        cb.prod(cb.function("cos", Double.class, userLatRad), cb.function("cos", Double.class, carLatRad)),
                        cb.prod(cb.function("sin", Double.class, cb.quot(deltaLon, 2)), cb.function("sin", Double.class, cb.quot(deltaLon, 2)))
                )
        );

        Expression<Double> c = cb.prod(2.0, cb.function("asin", Double.class, cb.function("sqrt", Double.class, a)));

        return cb.prod(c, 6371.0); // 6371.0 là bán kính Trái Đất (km)
    }
}
