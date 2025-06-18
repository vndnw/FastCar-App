# Giai đoạn 1: Build ứng dụng
# Sử dụng một image có sẵn Maven và JDK (ở đây là Amazon Corretto 21) để build file .jar
FROM maven:3.9.9-amazoncorretto-21 AS build

# Thiết lập thư mục làm việc bên trong image
WORKDIR /app

# Sao chép file pom.xml để tải các dependency trước
COPY pom.xml .
RUN mvn dependency:go-offline

# Sao chép toàn bộ mã nguồn của bạn vào image
COPY src ./src

# Chạy lệnh build của Maven để tạo file .jar. Lệnh -DskipTests sẽ bỏ qua việc chạy test.
RUN mvn clean package -DskipTests

# Giai đoạn 2: Chạy ứng dụng
# Sử dụng một image Amazon Corretto runtime nhẹ (chỉ chứa JRE 21) để giảm kích thước image cuối cùng
FROM amazoncorretto:21.0.7

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file .jar đã được build từ giai đoạn 'build' vào image hiện tại
# THAY ĐỔI 'target/*.jar' nếu file jar của bạn có tên hoặc đường dẫn khác
COPY --from=build /app/target/*.jar app.jar
COPY .env .env

# Expose port mà ứng dụng Spring Boot của bạn đang chạy (mặc định là 8080)
EXPOSE 8080

# Lệnh để khởi chạy ứng dụng khi container bắt đầu
ENTRYPOINT ["java", "-jar", "app.jar"]