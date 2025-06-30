# Giai đoạn 1: Build ứng dụng
FROM maven:3.9.9-amazoncorretto-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests


# Giai đoạn 2: Chạy ứng dụng
FROM amazoncorretto:21.0.7
WORKDIR /app

# --- THÊM DÒNG NÀY ĐỂ ĐỒNG BỘ MÚI GIỜ ---
# Đặt múi giờ cho container là "Asia/Ho_Chi_Minh" (múi giờ của Việt Nam)
ENV TZ=Asia/Ho_Chi_Minh
# Lệnh này sẽ tạo symbolic link và cập nhật timezone, đảm bảo múi giờ được áp dụng đúng
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# --- KẾT THÚC THÊM ---

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
