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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CarSpecification {

    public static Specification<Car> findByCriteria(CarSearchCriteriaRequest criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            // Sử dụng LEFT JOIN cho location để đảm bảo tất cả xe đều được xem xét,
            // kể cả khi location có thể bị null (tùy thuộc vào thiết kế DB)
            // Nếu Car luôn có Location, INNER JOIN mặc định là đủ.
            // Tuy nhiên, việc LEFT JOIN thường linh hoạt hơn trong Spec.
            Join<Car, Location> locationJoin = root.join("location", JoinType.LEFT);

            // --- Điều kiện cơ bản ---
            predicates.add(criteriaBuilder.equal(root.get("active"), true));
            predicates.add(criteriaBuilder.equal(root.get("status"), CarStatus.AVAILABLE));

            // --- Lọc theo thuộc tính xe ---
            if (criteria.getBrandId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("brand").get("id"), criteria.getBrandId()));
            }
            if (StringUtils.hasText(criteria.getName())) {
                // Tối ưu: Nếu có thể, hãy dùng LIKE 'value%' thay vì '%value%'
                // Nếu cần tìm kiếm toàn văn bản, hãy cân nhắc Full-Text Search hoặc pg_trgm (PostgreSQL)
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + criteria.getName().toLowerCase() + "%"));
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
                // IMPORTANT: Đảm bảo bảng Booking có các chỉ mục trên car_id, pickupTime, returnTime, status
                // Ví dụ: CREATE INDEX idx_booking_car_time_status ON booking (car_id, pickup_time, return_time, status);

                LocalDateTime searchStartTime = criteria.getStartDate().atStartOfDay();
                LocalDateTime searchEndTime = criteria.getEndDate().atTime(23, 59, 59);

                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Booking> bookingRoot = subquery.from(Booking.class);
                subquery.select(bookingRoot.get("car").get("id")); // Chọn ID của xe

                // Các trạng thái booking được coi là "đã chiếm chỗ"
                Predicate statusMatch = bookingRoot.get("status").in(
                        BookingStatus.CONFIRMED, BookingStatus.PENDING, BookingStatus.USE_IN);

                // Điều kiện khoảng thời gian đặt bị trùng lặp
                Predicate overlap = criteriaBuilder.or(
                        // Booking bắt đầu trong khoảng tìm kiếm
                        criteriaBuilder.between(bookingRoot.get("pickupTime"), searchStartTime, searchEndTime),
                        // Booking kết thúc trong khoảng tìm kiếm
                        criteriaBuilder.between(bookingRoot.get("returnTime"), searchStartTime, searchEndTime),
                        // Khoảng tìm kiếm nằm hoàn toàn trong booking hiện có
                        criteriaBuilder.and(
                                criteriaBuilder.lessThan(bookingRoot.get("pickupTime"), searchStartTime),
                                criteriaBuilder.greaterThan(bookingRoot.get("returnTime"), searchEndTime)
                        )
                );

                subquery.where(
                        criteriaBuilder.equal(bookingRoot.get("car"), root), // Booking thuộc về xe đang xét
                        statusMatch, // Trạng thái booking bị trùng lặp
                        overlap      // Khoảng thời gian bị trùng lặp
                );

                // Thêm điều kiện NOT EXISTS: Chỉ lấy xe mà KHÔNG CÓ booking nào thỏa mãn subquery
                predicates.add(criteriaBuilder.not(criteriaBuilder.exists(subquery)));
            }

            // --- Lọc địa điểm (Xử lý theo thứ tự ưu tiên) ---
            if (criteria.getLatitude() != null && criteria.getLongitude() != null) {
                // ƯU TIÊN 1: TÌM THEO BÁN KÍNH
                // Để tối ưu, bạn nên đánh chỉ mục trên latitude và longitude của bảng Location.
                // Đối với hiệu suất cao hơn nữa, hãy cân nhắc sử dụng Spatial Extensions của DB (PostGIS, MySQL Spatial).

                double radius = criteria.getRadiusInKm() != null ? criteria.getRadiusInKm() : 10.0; // Mặc định 10km

                // Thêm Bounding Box Predicate để lọc sơ bộ, giảm số lượng bản ghi cần tính toán Haversine đầy đủ
                double latDeg = criteria.getLatitude();
                double lonDeg = criteria.getLongitude();

                // Ước lượng delta độ dựa trên bán kính (1 độ vĩ độ ~ 111 km)
                // Lon delta phức tạp hơn do cos(latitude)
                double latDelta = radius / 111.0;
                double lonDelta = radius / (111.0 * Math.cos(Math.toRadians(latDeg)));

                predicates.add(criteriaBuilder.between(locationJoin.get("latitude"), latDeg - latDelta, latDeg + latDelta));
                predicates.add(criteriaBuilder.between(locationJoin.get("longitude"), lonDeg - lonDelta, lonDeg + lonDelta));

                // Sau đó mới tính toán khoảng cách Haversine chính xác
                Expression<Double> distanceInKm = createDistanceExpression(criteriaBuilder, locationJoin, criteria.getLatitude(), criteria.getLongitude());
                predicates.add(criteriaBuilder.lessThanOrEqualTo(distanceInKm, radius));

                // Sắp xếp kết quả theo khoảng cách gần nhất
                query.orderBy(criteriaBuilder.asc(distanceInKm));

            } else if (StringUtils.hasText(criteria.getCity()) || StringUtils.hasText(criteria.getDistrict())) {
                // ƯU TIÊN 2: TÌM THEO CITY/DISTRICT
                // Đảm bảo có chỉ mục trên các cột city và district của bảng Location.
                if (StringUtils.hasText(criteria.getCity())) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder.lower(locationJoin.get("city")), "%" + criteria.getCity().toLowerCase() + "%"));
                }
                if (StringUtils.hasText(criteria.getDistrict())) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder.lower(locationJoin.get("district")), "%" + criteria.getDistrict().toLowerCase() + "%"));
                }
            } else if (StringUtils.hasText(criteria.getLocation())) {
                // ƯU TIÊN 3: TÌM THEO TEXT CHUNG
                // Như đã nói ở trên, LIKE %...% không hiệu quả với chỉ mục B-tree thông thường.
                // Cân nhắc Full-Text Search hoặc pg_trgm nếu tìm kiếm này chậm.
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
    // Lưu ý: Việc gọi các hàm toán học này trên DB có thể chậm.
    // Ưu tiên sử dụng Spatial Extensions của database nếu có thể.
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