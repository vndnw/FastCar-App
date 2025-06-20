# Booking Car Application

Đây là một ứng dụng web cho phép người dùng tìm kiếm, đặt và quản lý việc thuê xe ô tô một cách dễ dàng và hiệu quả.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Cài đặt ( thủ công )](#cài-đặt-với-thủ-công)
  - [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
  - [Các bước cài đặt](#các-bước-cài-đặt)
  - [Cấu hình](#cấu-hình)
- [Cài đặt ( Docker )](#cài-đặt-với-docker-compose)
- [Sử dụng](#sử-dụng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)

## Giới thiệu

Chưa biết giới thiệu cái qq gì ở đây để search AI hỏi thử đã 

## Tính năng

- **Tìm kiếm xe:** Cho phép người dùng tìm kiếm xe theo địa điểm, ngày tháng, loại xe, và các bộ lọc khác.
- **Đặt xe trực tuyến:** Quy trình đặt xe đơn giản, nhanh chóng.
- **Quản lý đơn đặt:** Người dùng có thể xem, sửa đổi hoặc hủy các đơn đặt xe đã tạo.
- **Hệ thống thanh toán tích hợp:** Hỗ trợ phương thức thanh toán VNPAY.

## Cài đặt với Thủ Công 

### Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các phần mềm sau:

* [Node.js](https://nodejs.org/) (phiên bản 18 trở lên)
* [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) (phiên bản 21)
* [Docker](https://www.docker.com/products/docker-desktop/) (Tùy chọn, nếu bạn muốn chạy bằng Docker)
* [PostgreSQL](https://www.postgresql.org/)
* [Redis](https://redis.io/)

### Các bước cài đặt

Thực hiện theo các bước sau để cài đặt và chạy dự án:

1.  **Clone repository:**
    ```bash
    git clone https://github.com/Vo-Xuan-Duong/BookingACar.git
    cd BookingACar
    ```

2.  **Cài đặt Backend (Spring Boot):**
    ```bash
    cd Backend
    mvn clean install
    mvn spring-boot:run
    ```
    Backend sẽ chạy trên `http://localhost:8080`.

3.  **Cài đặt Frontend (React):**
    ```bash
    cd ../Frontend # Quay lại thư mục gốc dự án rồi vào thư mục Frontend
    npm install
    npm start
    ```
    Frontend sẽ chạy trên `http://localhost:3000`.
### Cấu hình

Bạn có thể cấu hình các biến môi trường sau trong file `.env` (đã có file `.env.example` mẫu) (hoặc `application.properties` cho Backend):

 ```bash
ví dụ file `.env.example`
    DB_URL=

    DB_USERNAME=
    DB_PASSWORD=

    JWT_SECRETKEY_ACCESS=
    JWT_SECRETKEY_REFRESH=
    JWT_EXPIRATION_ACCESS=3600000
    JWT_EXPIRATION_REFRESH=86400000
    JWT_ISSUER=

    MAIL_USERNAME=
    MAIL_PASSWORK=

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
 ```

## Cài đặt với Docker Compose

1.  **Clone repository:**
    ```bash
    git clone https://github.com/Vo-Xuan-Duong/BookingACar.git
    cd BookingACar
    ```
2. **Cài đặt Docker**
  ```bash
  # Từ thư mục gốc của dự án (BookingACar/)
  # docker-compose up --build
  ```
Lệnh này sẽ xây dựng lại các image và khởi chạy tất cả các service được định nghĩa trong `docker-compose.yml`.
    `chỉ mới có thể sử dụng với backend vì frontend chưa hoàn thành`
   ```bash
  #đảm bảo docker desktop đã khởi động
  cd Backend
  docker-compose up --build
  ```
    
## Sử dụng

Trang chủ : [BookingACar]().

Sau khi cài đặt thành công, bạn có thể:

1.  Truy cập ứng dụng tại `http://localhost:3000` trên trình duyệt của bạn.
2.  Đăng ký tài khoản hoặc đăng nhập nếu bạn đã có.
3.  Sử dụng chức năng tìm kiếm để tìm xe theo các tiêu chí khác nhau.
4.  Chọn một chiếc xe và tiến hành đặt lịch.
5.  ...

## Công nghệ sử dụng

* **Backend:** [Spring Boot](https://spring.io/projects/spring-boot), [Java 21](https://www.java.com/)
* **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
* **Cơ sở dữ liệu:** [Postgres](https://www.postgresql.org/), [Redis](https://redis.io/)
* **Quản lý gói:** [Maven](https://maven.apache.org/) (Backend), [npm](https://www.npmjs.com/) (Frontend)
* **Containerization:** [Docker](https://www.docker.com/)
