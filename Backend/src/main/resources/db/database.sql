-- I. ĐỊNH NGHĨA CÁC KIỂU ENUM TÙY CHỈNH
-- Tạo các kiểu dữ liệu ENUM để sử dụng trong các bảng
CREATE TYPE car_type_enum AS ENUM ('LUXURY', 'STANDARD', 'SUPER_LUXURY');
CREATE TYPE fuel_type_enum AS ENUM ('ELECTRIC', 'GASOLINE', 'HYBRID', 'OIL');
CREATE TYPE car_status_enum AS ENUM ('AVAILABLE', 'BOOKED', 'MAINTENANCE');
CREATE TYPE transmission_enum AS ENUM ('AUTO', 'MANUAL');
CREATE TYPE document_type_enum AS ENUM ('CCCD', 'INSPECTION', 'INSURANCE', 'REGISTRATION');
CREATE TYPE document_status_enum AS ENUM ('APPROVED', 'EXPIRED', 'PENDING', 'REJECTED');
CREATE TYPE driver_status_enum AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE'); -- Đã sửa lỗi chính tả 'AVALIABLE'
CREATE TYPE booking_status_enum AS ENUM ('CANCELLED', 'COMPLETED', 'PENDING', 'RESERVED', 'USE_IN', 'WAITING_EXTRA_CHARGE', 'WAITING_REFUND');
CREATE TYPE booking_type_enum AS ENUM ('DRIVER', 'VEHICLE');
CREATE TYPE condition_check_status_enum AS ENUM ('ACCEPTED', 'PENDING', 'REJECTED');
CREATE TYPE condition_check_type_enum AS ENUM ('AFTER_RENTAL', 'BEFORE_RENTAL');
CREATE TYPE image_type_enum AS ENUM ('BACK', 'FRONT', 'INTERIOR', 'LEFT', 'LUGGAGE', 'RIGHT');
CREATE TYPE payment_status_enum AS ENUM ('FAILED', 'PENDING', 'REFUNDED', 'SUCCESS');
CREATE TYPE payment_type_enum AS ENUM ('DEPOSIT', 'EXTRA_CHARGE', 'REFUND', 'RENTAL', 'RESERVED');


-- II. TẠO CÁC BẢNG

CREATE TABLE brands
(
    id          BIGSERIAL PRIMARY KEY,
    create_at   TIMESTAMP(6) NULL,
    description TEXT         NULL,
    logo        TEXT         NULL,
    name        VARCHAR(255) NULL,
    update_at   TIMESTAMP(6) NULL
);

CREATE TABLE discounts
(
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(255) NULL,
    created_at  TIMESTAMP(6) NULL,
    description TEXT         NULL,
    end_date    TIMESTAMP(6) NULL,
    percent     INTEGER      NOT NULL,
    quantity    INTEGER      NOT NULL,
    start_date  TIMESTAMP(6) NULL
);

CREATE TABLE features
(
    id          BIGSERIAL PRIMARY KEY,
    created_at  TIMESTAMP(6) NULL,
    description VARCHAR(255) NULL,
    icon_url    VARCHAR(255) NULL,
    name        VARCHAR(255) NULL,
    updated_at  TIMESTAMP(6) NULL
);

CREATE TABLE locations
(
    id          BIGSERIAL PRIMARY KEY,
    address     VARCHAR(255)   NULL,
    city        VARCHAR(255)   NULL,
    created_at  TIMESTAMP(6)   NULL,
    district    VARCHAR(255)   NULL,
    latitude    DOUBLE PRECISION NULL,
    longitude   DOUBLE PRECISION NULL,
    street      VARCHAR(255)   NULL,
    updated_at  TIMESTAMP(6)   NULL,
    ward        VARCHAR(255)   NULL
);

CREATE TABLE roles
(
    id         BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP(6) NULL,
    name       VARCHAR(255) NULL,
    updated_at TIMESTAMP(6) NULL
);

CREATE TABLE users
(
    id                BIGSERIAL PRIMARY KEY,
    active            BOOLEAN      NOT NULL,
    created_at        TIMESTAMP(6) NULL,
    date_of_birth     DATE         NULL,
    email             VARCHAR(255) NULL,
    first_name        VARCHAR(255) NULL,
    last_name         VARCHAR(255) NULL,
    password          VARCHAR(255) NULL,
    phone             VARCHAR(255) NULL,
    profile_picture   VARCHAR(500) NULL,
    updated_at        TIMESTAMP(6) NULL,
    location_id       BIGINT       NULL,
    CONSTRAINT UK6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email),
    CONSTRAINT UKdu5v5sr43g5bfnji4vb8hg5s3 UNIQUE (phone),
    CONSTRAINT FKdk0xfnnthbj8afp1ira6sndte FOREIGN KEY (location_id) REFERENCES locations (id)
);

CREATE TABLE bank_informations
(
    id                  BIGSERIAL PRIMARY KEY,
    account_holder_name VARCHAR(255) NULL,
    account_number      VARCHAR(255) NULL,
    bank_name           VARCHAR(255) NULL,
    created_at          TIMESTAMP(6) NULL,
    updated_at          TIMESTAMP(6) NULL,
    user_id             BIGINT       NULL,
    CONSTRAINT UKdv6u4epk78g6yv5yb7j4utnm UNIQUE (user_id),
    CONSTRAINT FK7atkfolo4sae6b7py46qlvl12 FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE cars
(
    id               BIGSERIAL PRIMARY KEY,
    active           BOOLEAN        DEFAULT FALSE NULL,
    car_type         car_type_enum  NULL,
    color            VARCHAR(255)   NULL,
    created_at       TIMESTAMP(6)   NULL,
    description      TEXT           NULL,
    fuel_consumption VARCHAR(255)   NULL,
    fuel_type        fuel_type_enum NULL,
    license_plate    VARCHAR(255)   NULL,
    model            VARCHAR(255)   NULL,
    name             VARCHAR(255)   NULL,
    price_per12hour  NUMERIC(38, 2) NULL,
    price_per24hour  NUMERIC(38, 2) NULL,
    price_per4hour   NUMERIC(38, 2) NULL,
    price_per8hour   NUMERIC(38, 2) NULL,
    price_per_hour   NUMERIC(38, 2) NULL,
    seats            INTEGER        NOT NULL,
    status           car_status_enum NULL,
    transmission     transmission_enum NULL,
    updated_at       TIMESTAMP(6)   NULL,
    year             INTEGER        NOT NULL,
    car_brand_id     BIGINT         NULL,
    location_id      BIGINT         NULL,
    user_id          BIGINT         NULL,
    CONSTRAINT FKotatcltd9hda79r9y01u1y1es FOREIGN KEY (location_id) REFERENCES locations (id),
    CONSTRAINT FKq7bcdosg1yxowebf60g77fkbh FOREIGN KEY (car_brand_id) REFERENCES brands (id),
    CONSTRAINT FKqw4c8e6nqrvy3ti1xj8w8wyc9 FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE car_features
(
    car_id     BIGINT NOT NULL,
    feature_id BIGINT NOT NULL,
    CONSTRAINT FKm2wabn2clpmrh88peejarqbwr FOREIGN KEY (car_id) REFERENCES cars (id),
    CONSTRAINT FKt2nqq8b43mdsjwjb3bfv80u60 FOREIGN KEY (feature_id) REFERENCES features (id)
);

CREATE TABLE documents
(
    id              BIGSERIAL PRIMARY KEY,
    active          BOOLEAN            DEFAULT FALSE NULL,
    create_at       TIMESTAMP(6)       NULL,
    description     TEXT               NULL,
    document_number VARCHAR(255)       NULL,
    document_type   document_type_enum NULL,
    expiry_date     DATE               NULL,
    image_back_url  VARCHAR(255)       NULL,
    image_front_url VARCHAR(255)       NULL,
    issue_date      DATE               NULL,
    status          document_status_enum NULL,
    update_at       TIMESTAMP(6)       NULL,
    car_id          BIGINT             NULL,
    CONSTRAINT FK4jo7dqyedhus29jot3vid2qd1 FOREIGN KEY (car_id) REFERENCES cars (id)
);

CREATE TABLE drivers
(
    id             BIGSERIAL PRIMARY KEY,
    created_at     TIMESTAMP(6)     NULL,
    license_number VARCHAR(500)     NULL,
    status         driver_status_enum NULL,
    updated_at     TIMESTAMP(6)     NULL,
    user_id        BIGINT           NULL,
    CONSTRAINT UKojm6yjeacqc5cthc73k5twsnj UNIQUE (user_id),
    CONSTRAINT FKfscpnjt46gco44xh86l99rxh7 FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE bookings
(
    id                  BIGSERIAL PRIMARY KEY,
    booking_code        VARCHAR(255)      NULL,
    created_at          TIMESTAMP(6)      NULL,
    deposit_amount      NUMERIC(38, 2)    NULL,
    description         TEXT              NULL,
    discount_code       VARCHAR(255)      NULL,
    pickup_time         TIMESTAMP(6)      NOT NULL,
    rental_price        NUMERIC(38, 2)    NULL,
    reservation_fee     NUMERIC(38, 2)    NULL,
    return_time         TIMESTAMP(6)      NOT NULL,
    status              booking_status_enum NULL,
    total_discount      NUMERIC(38, 2)    NULL,
    total_extra_charges NUMERIC(38, 2)    NULL,
    total_refunded      NUMERIC(38, 2)    NULL,
    type                booking_type_enum NULL,
    updated_at          TIMESTAMP(6)      NULL,
    car_id              BIGINT            NULL,
    driver_id           BIGINT            NULL,
    location_id         BIGINT            NULL,
    user_id             BIGINT            NULL,
    CONSTRAINT FKb7go5cbavwr8upc5gt0vlc2fa FOREIGN KEY (location_id) REFERENCES locations (id),
    CONSTRAINT FKeyog2oic85xg7hsu2je2lx3s6 FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT FKj0bxwbe92tfc6xwp7pdffo3pq FOREIGN KEY (driver_id) REFERENCES drivers (id),
    CONSTRAINT FKj1y19nc7wf0rdp24pyhomn7ck FOREIGN KEY (car_id) REFERENCES cars (id)
);

CREATE TABLE condition_checks
(
    id              BIGSERIAL PRIMARY KEY,
    created_at      TIMESTAMP(6)                NULL,
    damage_note     VARCHAR(255)                NULL,
    fuel_level      VARCHAR(255)                NULL,
    image_front_url VARCHAR(255)                NULL,
    image_fuel_url  VARCHAR(255)                NULL,
    image_left_url  VARCHAR(255)                NULL,
    image_odo_url   VARCHAR(255)                NULL,
    image_other_url VARCHAR(255)                NULL,
    image_rear_url  VARCHAR(255)                NULL,
    image_right_url VARCHAR(255)                NULL,
    interior_status VARCHAR(255)                NULL,
    is_checked      BOOLEAN                     NOT NULL,
    odometer        INTEGER                     NOT NULL,
    status          condition_check_status_enum NULL,
    type            condition_check_type_enum   NULL,
    booking_id      BIGINT                      NULL,
    car_id          BIGINT                      NULL,
    CONSTRAINT FK6sp9mpjtyot12feljsa1ojw91 FOREIGN KEY (car_id) REFERENCES cars (id),
    CONSTRAINT FKg5rnya7wd67onu4iil1232jb6 FOREIGN KEY (booking_id) REFERENCES bookings (id)
);

CREATE TABLE images
(
    id          BIGSERIAL PRIMARY KEY,
    creation_at TIMESTAMP(6)    NULL,
    image_type  image_type_enum NULL,
    image_url   VARCHAR(500)    NULL,
    update_at   TIMESTAMP(6)    NULL,
    car_id      BIGINT          NULL,
    CONSTRAINT FK79gaadgp4fm6x4f6mm3yeuk8 FOREIGN KEY (car_id) REFERENCES cars (id)
);

CREATE TABLE payments
(
    id           BIGSERIAL PRIMARY KEY,
    amount       NUMERIC(38, 2)      NULL,
    created_at   TIMESTAMP(6)        NULL,
    external_ref VARCHAR(255)        NULL,
    status       payment_status_enum NULL,
    type         payment_type_enum   NULL,
    booking_id   BIGINT              NULL,
    CONSTRAINT FKc52o2b1jkxttngufqp3t7jr3h FOREIGN KEY (booking_id) REFERENCES bookings (id)
);

CREATE TABLE extra_charges
(
    id         BIGSERIAL PRIMARY KEY,
    amount     NUMERIC(38, 2) NULL,
    created_at TIMESTAMP(6)   NULL,
    image      VARCHAR(255)   NULL,
    reason     VARCHAR(255)   NULL,
    booking_id BIGINT         NULL,
    payment_id BIGINT         NULL,
    CONSTRAINT FK9fcn1p5aiveoy3e05rshyy2oy FOREIGN KEY (payment_id) REFERENCES payments (id),
    CONSTRAINT FKf6u01qjafv5ehaci4pjkv2j3b FOREIGN KEY (booking_id) REFERENCES bookings (id)
);

CREATE TABLE refresh_token
(
    id         VARCHAR(255) NOT NULL PRIMARY KEY,
    created_at TIMESTAMP(6) NULL,
    token      VARCHAR(500) NULL,
    user_id    BIGINT       NULL,
    CONSTRAINT FKjtx87i0jvq2svedphegvdwcuy FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE review_cars
(
    id         BIGSERIAL PRIMARY KEY,
    comment    TEXT         NULL,
    created_at TIMESTAMP(6) NULL,
    rating     INTEGER      NOT NULL,
    updated_at TIMESTAMP(6) NULL,
    car_id     BIGINT       NULL,
    user_id    BIGINT       NULL,
    CONSTRAINT FK52m96tcdj44ec1afpf3eei552 FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT FKfrneh1cbhgdrxprnmcnrar3gq FOREIGN KEY (car_id) REFERENCES cars (id)
);

CREATE TABLE review_drivers
(
    id         BIGSERIAL PRIMARY KEY,
    comment    TEXT         NULL,
    created_at TIMESTAMP(6) NULL,
    rating     INTEGER      NOT NULL,
    updated_at TIMESTAMP(6) NULL,
    driver_id  BIGINT       NULL,
    user_id    BIGINT       NULL,
    CONSTRAINT FKkjax4hexjbwly9dbocwhq5jqv FOREIGN KEY (driver_id) REFERENCES drivers (id),
    CONSTRAINT FKm3qigqxds3essjyycqufeuuhp FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE user_roles
(
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    CONSTRAINT FKh8ciramu9cc9q3qcqiv4ue8a6 FOREIGN KEY (role_id) REFERENCES roles (id),
    CONSTRAINT FKhfh9dx7w3ubf1co1vdev94g3f FOREIGN KEY (user_id) REFERENCES users (id)
);