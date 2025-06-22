-- Chèn danh sách 20 thương hiệu xe hơi phổ biến vào bảng brands
INSERT INTO brands (name, description, logo, create_at, update_at) VALUES
                                                                       ('Toyota', 'A Japanese multinational automotive manufacturer.', 'https://placehold.co/200x200/c92127/FFFFFF?text=Toyota', NOW(), NOW()),
                                                                       ('VinFast', 'A Vietnamese automotive manufacturer, a member of Vingroup.', 'https://placehold.co/200x200/c92127/FFFFFF?text=VinFast', NOW(), NOW()),
                                                                       ('Hyundai', 'A South Korean multinational automotive manufacturer.', 'https://placehold.co/200x200/002c5f/FFFFFF?text=Hyundai', NOW(), NOW()),
                                                                       ('Ford', 'An American multinational automobile manufacturer.', 'https://placehold.co/200x200/003478/FFFFFF?text=Ford', NOW(), NOW()),
                                                                       ('Mercedes-Benz', 'A German luxury and commercial vehicle automotive brand.', 'https://placehold.co/200x200/000000/FFFFFF?text=Mercedes', NOW(), NOW()),
                                                                       ('Honda', 'A Japanese public multinational conglomerate manufacturer of automobiles, motorcycles, and power equipment.', 'https://placehold.co/200x200/E40521/FFFFFF?text=Honda', NOW(), NOW()),
                                                                       ('Kia', 'South Korea''s second largest automobile manufacturer, following Hyundai.', 'https://placehold.co/200x200/C8142D/FFFFFF?text=Kia', NOW(), NOW()),
                                                                       ('Mazda', 'A Japanese multinational automaker based in Hiroshima, Japan.', 'https://placehold.co/200x200/004B8C/FFFFFF?text=Mazda', NOW(), NOW()),
                                                                       ('BMW', 'A German multinational company which produces luxury vehicles and motorcycles.', 'https://placehold.co/200x200/0066B2/FFFFFF?text=BMW', NOW(), NOW()),
                                                                       ('Audi', 'A German automotive manufacturer of luxury vehicles, headquartered in Ingolstadt, Bavaria.', 'https://placehold.co/200x200/A8A8A8/000000?text=Audi', NOW(), NOW()),
                                                                       ('Nissan', 'A Japanese multinational automobile manufacturer headquartered in Nishi-ku, Yokohama, Japan.', 'https://placehold.co/200x200/C3002F/FFFFFF?text=Nissan', NOW(), NOW()),
                                                                       ('Chevrolet', 'An American automobile division of the American manufacturer General Motors (GM).', 'https://placehold.co/200x200/FDBB2D/000000?text=Chevy', NOW(), NOW()),
                                                                       ('Volkswagen', 'A German motor vehicle manufacturer headquartered in Wolfsburg, Lower Saxony, Germany.', 'https://placehold.co/200x200/1E4B8C/FFFFFF?text=VW', NOW(), NOW()),
                                                                       ('Mitsubishi', 'A Japanese multinational automotive manufacturer headquartered in Minato, Tokyo, Japan.', 'https://placehold.co/200x200/E60012/FFFFFF?text=Mitsubishi', NOW(), NOW()),
                                                                       ('Subaru', 'The automobile manufacturing division of Japanese transportation conglomerate Subaru Corporation.', 'https://placehold.co/200x200/0033A0/FFFFFF?text=Subaru', NOW(), NOW()),
                                                                       ('Lexus', 'The luxury vehicle division of the Japanese automaker Toyota.', 'https://placehold.co/200x200/292929/FFFFFF?text=Lexus', NOW(), NOW()),
                                                                       ('Porsche', 'A German automobile manufacturer specializing in high-performance sports cars, SUVs and sedans.', 'https://placehold.co/200x200/D4001A/FFFFFF?text=Porsche', NOW(), NOW()),
                                                                       ('Ferrari', 'An Italian luxury sports car manufacturer based in Maranello, Italy.', 'https://placehold.co/200x200/FF2800/FFFFFF?text=Ferrari', NOW(), NOW()),
                                                                       ('Lamborghini', 'An Italian brand and manufacturer of luxury sports cars and SUVs based in Sant''Agata Bolognese.', 'https://placehold.co/200x200/DFB13F/000000?text=Lambo', NOW(), NOW()),
                                                                       ('Volvo', 'A Swedish multinational manufacturing company headquartered in Gothenburg.', 'https://placehold.co/200x200/003057/FFFFFF?text=Volvo', NOW(), NOW());

INSERT INTO discounts (code, description, percent, quantity, start_date, end_date, created_at) VALUES
                                                                                                   (
                                                                                                       'SUMMER2025',
                                                                                                       'Chương trình khuyến mãi mùa hè, giảm 15% cho tất cả các dòng xe.',
                                                                                                       15,
                                                                                                       100,
                                                                                                       '2025-06-01 00:00:00',
                                                                                                       '2025-08-31 23:59:59',
                                                                                                       NOW()
                                                                                                   ),
                                                                                                   (
                                                                                                       'WELCOME10',
                                                                                                       'Giảm giá 10% cho khách hàng lần đầu đặt xe.',
                                                                                                       10,
                                                                                                       500,
                                                                                                       '2025-01-01 00:00:00',
                                                                                                       '2025-12-31 23:59:59',
                                                                                                       NOW()
                                                                                                   ),
                                                                                                   (
                                                                                                       'TET2025',
                                                                                                       'Khuyến mãi đặc biệt dịp Tết Nguyên Đán 2025 (đã hết hạn).',
                                                                                                       20,
                                                                                                       200,
                                                                                                       '2025-01-20 00:00:00',
                                                                                                       '2025-02-10 23:59:59',
                                                                                                       NOW()
                                                                                                   ),
                                                                                                   (
                                                                                                       'WEEKEND25',
                                                                                                       'Giảm giá 25% cho các chuyến đi vào cuối tuần (thứ 7, chủ nhật).',
                                                                                                       25,
                                                                                                       50,
                                                                                                       '2025-05-01 00:00:00',
                                                                                                       '2025-09-30 23:59:59',
                                                                                                       NOW()
                                                                                                   ),
                                                                                                   (
                                                                                                       'LUXURYCAR',
                                                                                                       'Giảm 1,000,000 VND (tương đương 5%) cho các dòng xe sang.',
                                                                                                       5,
                                                                                                       30,
                                                                                                       '2025-06-10 00:00:00',
                                                                                                       '2025-07-10 23:59:59',
                                                                                                       NOW()
                                                                                                   ),
                                                                                                   (
                                                                                                       'LONGTRIP',
                                                                                                       'Giảm giá 12% cho các chuyến đi dài hơn 3 ngày.',
                                                                                                       12,
                                                                                                       80,
                                                                                                       '2025-03-01 00:00:00',
                                                                                                       '2025-11-30 23:59:59',
                                                                                                       NOW()
                                                                                                   ),
                                                                                                   (
                                                                                                       'MIDYEARSALE',
                                                                                                       'Giảm giá giữa năm (đã hết hạn).',
                                                                                                       30,
                                                                                                       25,
                                                                                                       '2025-05-25 00:00:00',
                                                                                                       '2025-06-10 23:59:59',
                                                                                                       NOW()
                                                                                                   ),
                                                                                                   (
                                                                                                       'FLASH SALE',
                                                                                                       'Giảm giá chớp nhoáng chỉ trong 1 ngày.',
                                                                                                       40,
                                                                                                       10,
                                                                                                       '2025-06-20 00:00:00',
                                                                                                       '2025-06-20 23:59:59',
                                                                                                       NOW()
                                                                                                   ),
                                                                                                   (
                                                                                                       'SEPTEMBER',
                                                                                                       'Ưu đãi tháng 9 cho mùa tựu trường (sắp diễn ra).',
                                                                                                       18,
                                                                                                       150,
                                                                                                       '2025-09-01 00:00:00',
                                                                                                       '2025-09-30 23:59:59',
                                                                                                       NOW()
                                                                                                   ),
                                                                                                   (
                                                                                                       'YEAR END',
                                                                                                       'Đại tiệc giảm giá cuối năm (sắp diễn ra).',
                                                                                                       22,
                                                                                                       120,
                                                                                                       '2025-12-01 00:00:00',
                                                                                                       '2025-12-31 23:59:59',
                                                                                                       NOW()
                                                                                                   );
-- Chèn dữ liệu cho các tính năng xe hơi phổ biến (bằng tiếng Việt)
INSERT INTO features (name, description, icon_url, created_at, updated_at) VALUES
                                                                               ('Định vị GPS', 'Hệ thống định vị GPS tích hợp để dẫn đường cho chuyến đi của bạn.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=GPS', NOW(), NOW()),
                                                                               ('Kết nối Bluetooth', 'Kết nối điện thoại để nghe gọi rảnh tay và phát nhạc.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=Bluetooth', NOW(), NOW()),
                                                                               ('Cửa sổ trời', 'Một tấm panel có thể mở trên nóc xe để có thêm ánh sáng và không khí.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=CuaSoTroi', NOW(), NOW()),
                                                                               ('Ghế da', 'Ghế da cao cấp để tăng cường sự thoải mái và sang trọng.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=GheDa', NOW(), NOW()),
                                                                               ('Camera lùi', 'Camera hỗ trợ việc lùi và đỗ xe một cách an toàn.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=Camera', NOW(), NOW()),
                                                                               ('Kiểm soát hành trình', 'Hệ thống tự động điều khiển và duy trì tốc độ của xe (Cruise Control).', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=Cruise', NOW(), NOW()),
                                                                               ('Apple CarPlay', 'Tích hợp iPhone của bạn với màn hình và bộ điều khiển của xe.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=CarPlay', NOW(), NOW()),
                                                                               ('Android Auto', 'Tích hợp điện thoại Android của bạn với màn hình và bộ điều khiển của xe.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=Android', NOW(), NOW()),
                                                                               ('Cảm biến đỗ xe', 'Cảm biến phát hiện chướng ngại vật khi lùi hoặc đỗ xe.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=CamBien', NOW(), NOW()),
                                                                               ('Chìa khóa thông minh', 'Mở khóa và khởi động xe mà không cần dùng đến chìa khóa vật lý (Keyless Entry).', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=Keyless', NOW(), NOW()),
                                                                               ('Sưởi ghế', 'Ghế có chức năng sưởi ấm cho thời tiết lạnh.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=SuoiGhe', NOW(), NOW()),
                                                                               ('Cảnh báo điểm mù', 'Hệ thống phát hiện các phương tiện trong điểm mù của người lái.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=DiemMu', NOW(), NOW()),
                                                                               ('Ghế trẻ em (ISOFIX)', 'Trang bị các điểm neo ISOFIX để lắp đặt ghế trẻ em một cách an toàn.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=GheTreEm', NOW(), NOW()),
                                                                               ('Cổng sạc USB', 'Các cổng USB để sạc thiết bị di động và phát media.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=USB', NOW(), NOW()),
                                                                               ('Camera hành trình', 'Camera phía trước để ghi lại video hành trình của bạn.', 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=CamHT', NOW(), NOW());


INSERT INTO locations (city, district, ward, street, address, latitude, longitude, created_at, updated_at) VALUES
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'Quận 1',
                                                                                                                   'Phường Bến Nghé',
                                                                                                                   'Nguyễn Huệ',
                                                                                                                   '72 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
                                                                                                                   10.7760,
                                                                                                                   106.7037,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               ),
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'Quận 7',
                                                                                                                   'Phường Tân Phú',
                                                                                                                   'Nguyễn Lương Bằng',
                                                                                                                   '101 Tôn Dật Tiên, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
                                                                                                                   10.7295,
                                                                                                                   106.7139,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               ),
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'Quận Tân Bình',
                                                                                                                   'Phường 2',
                                                                                                                   'Trường Sơn',
                                                                                                                   '45 Trường Sơn, Phường 2, Quận Tân Bình, TP. Hồ Chí Minh (Sân bay Tân Sơn Nhất)',
                                                                                                                   10.8189,
                                                                                                                   106.6585,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               ),
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'TP. Thủ Đức',
                                                                                                                   'Phường Thảo Điền',
                                                                                                                   'Xuân Thủy',
                                                                                                                   '197 Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
                                                                                                                   10.8030,
                                                                                                                   106.7408,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               ),
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'Quận Bình Thạnh',
                                                                                                                   'Phường 22',
                                                                                                                   'Nguyễn Hữu Cảnh',
                                                                                                                   '208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh (Landmark 81)',
                                                                                                                   10.7951,
                                                                                                                   106.7219,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               ),
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'Quận 3',
                                                                                                                   'Phường Võ Thị Sáu',
                                                                                                                   'Hai Bà Trưng',
                                                                                                                   '289 Hai Bà Trưng, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
                                                                                                                   10.7865,
                                                                                                                   106.6917,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               ),
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'Quận 10',
                                                                                                                   'Phường 12',
                                                                                                                   'Sư Vạn Hạnh',
                                                                                                                   '88 Đường số 7, Phường 12, Quận 10, TP. Hồ Chí Minh (Vạn Hạnh Mall)',
                                                                                                                   10.7749,
                                                                                                                   106.6681,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               ),
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'Quận 5',
                                                                                                                   'Phường 11',
                                                                                                                   'Trần Hưng Đạo',
                                                                                                                   '1020 Trần Hưng Đạo, Phường 11, Quận 5, TP. Hồ Chí Minh',
                                                                                                                   10.7516,
                                                                                                                   106.6601,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               ),
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'Quận Phú Nhuận',
                                                                                                                   'Phường 9',
                                                                                                                   'Phan Xích Long',
                                                                                                                   '235 Phan Xích Long, Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh',
                                                                                                                   10.7945,
                                                                                                                   106.6853,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               ),
                                                                                                               (
                                                                                                                   'TP. Hồ Chí Minh',
                                                                                                                   'Quận Gò Vấp',
                                                                                                                   'Phường 10',
                                                                                                                   'Quang Trung',
                                                                                                                   '190 Quang Trung, Phường 10, Quận Gò Vấp, TP. Hồ Chí Minh',
                                                                                                                   10.8354,
                                                                                                                   106.6661,
                                                                                                                   NOW(),
                                                                                                                   NOW()
                                                                                                               );
-- Chèn dữ liệu mẫu cho 15 chiếc xe
INSERT INTO cars (active, car_type, color, created_at, description, fuel_consumption, fuel_type, license_plate, model, name, price_per_hour, price_per4hour, price_per8hour, price_per12hour, price_per24hour, seats, status, transmission, updated_at, year, car_brand_id, location_id, user_id) VALUES
                                                                                                                                                                                                                                                                                                      (TRUE, 'STANDARD', 'Trắng', NOW(), 'Xe sedan quốc dân, bền bỉ và tiết kiệm nhiên liệu, phù hợp cho gia đình.', '7 L/100km', 'GASOLINE', '51K-123.45', 'Vios G', 'Toyota Vios', 150000, 500000, 900000, 1200000, 1500000, 5, 'AVAILABLE', 'AUTO', NOW(), 2022, 1, 1, 1),
                                                                                                                                                                                                                                                                                                      (TRUE, 'STANDARD', 'Đỏ', NOW(), 'Mẫu Crossover đô thị năng động và hiện đại từ VinFast.', '8 L/100km', 'GASOLINE', '30H-543.21', 'VF 6', 'VinFast VF 6', 180000, 600000, 1100000, 1500000, 1900000, 5, 'AVAILABLE', 'AUTO', NOW(), 2023, 2, 2, 2),
                                                                                                                                                                                                                                                                                                      (TRUE, 'LUXURY', 'Đen', NOW(), 'Sedan hạng sang của Đức với thiết kế tinh tế và công nghệ vượt trội.', '9 L/100km', 'GASOLINE', '51K-987.65', 'C300 AMG', 'Mercedes-Benz C300', 400000, 1500000, 2800000, 3800000, 4500000, 5, 'PENDING', 'AUTO', NOW(), 2023, 5, 3, 1),
                                                                                                                                                                                                                                                                                                      (TRUE, 'STANDARD', 'Bạc', NOW(), 'Mẫu SUV 7 chỗ rộng rãi, lý tưởng cho các chuyến đi xa cùng gia đình.', '8.5 L/100km', 'GASOLINE', '43A-112.23', 'Santa Fe', 'Hyundai Santa Fe', 250000, 800000, 1500000, 2000000, 2500000, 7, 'AVAILABLE', 'AUTO', NOW(), 2022, 3, 1, 3),
                                                                                                                                                                                                                                                                                                      (TRUE, 'STANDARD', 'Xanh', NOW(), 'Xe bán tải mạnh mẽ và đa dụng, sẵn sàng chinh phục mọi địa hình.', '9.5 L/100km', 'OIL', '29C-334.45', 'Ranger Wildtrak', 'Ford Ranger', 220000, 750000, 1400000, 1800000, 2200000, 5, 'AVAILABLE', 'AUTO', NOW(), 2023, 4, 2, 2),
                                                                                                                                                                                                                                                                                                      (FALSE, 'STANDARD', 'Xám', NOW(), 'Xe đang trong quá trình bảo dưỡng định kỳ, chưa sẵn sàng cho thuê.', '7.5 L/100km', 'GASOLINE', '60A-556.67', 'Civic RS', 'Honda Civic', 190000, 650000, 1200000, 1600000, 2000000, 5, 'MAINTENANCE', 'AUTO', NOW(), 2022, 6, 3, 1),
                                                                                                                                                                                                                                                                                                      (TRUE, 'LUXURY', 'Trắng', NOW(), 'SUV hạng sang cỡ lớn với hiệu suất mạnh mẽ và không gian nội thất đẳng cấp.', '11 L/100km', 'GASOLINE', '51K-778.89', 'X5', 'BMW X5', 500000, 1800000, 3400000, 4500000, 5500000, 5, 'AVAILABLE', 'AUTO', NOW(), 2023, 9, 1, 3),
                                                                                                                                                                                                                                                                                                      (TRUE, 'STANDARD', 'Cam', NOW(), 'Mẫu Crossover nhỏ gọn, linh hoạt trong đô thị.', '7.2 L/100km', 'GASOLINE', '92A-998.87', 'Seltos', 'Kia Seltos', 170000, 550000, 1000000, 1400000, 1800000, 5, 'AVAILABLE', 'AUTO', NOW(), 2023, 7, 2, 2),
                                                                                                                                                                                                                                                                                                      (TRUE, 'STANDARD', 'Đen', NOW(), 'Phong cách thiết kế KODO độc đáo cùng trải nghiệm lái thú vị.', '6.8 L/100km', 'GASOLINE', '43A-121.21', 'CX-5', 'Mazda CX-5', 200000, 700000, 1300000, 1700000, 2100000, 5, 'PENDING', 'AUTO', NOW(), 2022, 8, 3, 1),
                                                                                                                                                                                                                                                                                                      (TRUE, 'SUPER_LUXURY', 'Đỏ', NOW(), 'Biểu tượng xe thể thao Ý với tốc độ và thiết kế không thể nhầm lẫn.', '15 L/100km', 'GASOLINE', '51K-001.01', '488 GTB', 'Ferrari 488', 2000000, 7000000, 13000000, 18000000, 25000000, 2, 'AVAILABLE', 'AUTO', NOW(), 2021, 18, 1, 3),
                                                                                                                                                                                                                                                                                                      (TRUE, 'STANDARD', 'Xanh Dương', NOW(), 'Mẫu xe 7 chỗ MPV phổ biến, lựa chọn kinh tế cho dịch vụ.', '8.2 L/100km', 'GASOLINE', '75A-345.67', 'Xpander', 'Mitsubishi Xpander', 160000, 520000, 950000, 1300000, 1600000, 7, 'AVAILABLE', 'MANUAL', NOW(), 2022, 14, 1, 2),
                                                                                                                                                                                                                                                                                                      (TRUE, 'LUXURY', 'Xám', NOW(), 'SUV sang trọng với hệ dẫn động 4 bánh toàn thời gian danh tiếng.', '10.5 L/100km', 'GASOLINE', '30H-876.54', 'Q7', 'Audi Q7', 450000, 1600000, 3000000, 4000000, 5000000, 7, 'AVAILABLE', 'AUTO', NOW(), 2022, 10, 2, 3),
                                                                                                                                                                                                                                                                                                      (TRUE, 'STANDARD', 'Trắng', NOW(), 'Chiếc hatchback nhỏ gọn, dễ dàng di chuyển trong thành phố đông đúc.', '6.5 L/100km', 'GASOLINE', '51K-456.78', 'Polo', 'Volkswagen Polo', 140000, 480000, 850000, 1100000, 1400000, 5, 'AVAILABLE', 'AUTO', NOW(), 2021, 13, 3, 1),
                                                                                                                                                                                                                                                                                                      (TRUE, 'STANDARD', 'Nâu', NOW(), 'SUV với hệ dẫn động S-AWD và an toàn là ưu tiên hàng đầu.', '8.8 L/100km', 'GASOLINE', '29C-654.32', 'Forester', 'Subaru Forester', 210000, 720000, 1350000, 1750000, 2150000, 5, 'AVAILABLE', 'AUTO', NOW(), 2023, 15, 1, 2),
                                                                                                                                                                                                                                                                                                      (TRUE, 'LUXURY', 'Đen', NOW(), 'Sự kết hợp hoàn hảo giữa sang trọng, tiện nghi và độ tin cậy từ thương hiệu Lexus.', '9.2 L/100km', 'GASOLINE', '51K-111.22', 'RX 350', 'Lexus RX 350', 550000, 1900000, 3600000, 4800000, 6000000, 5, 'PENDING', 'AUTO', NOW(), 2023, 16, 2, 3);

-- Chèn dữ liệu mẫu cho 10 người dùng
INSERT INTO users (active, date_of_birth, email, first_name, last_name, password, phone, profile_picture, location_id, created_at, updated_at) VALUES
                                                                                                                                                   (
                                                                                                                                                       TRUE, '1990-05-15', 'nguyenvana@example.com', 'An', 'Nguyễn Văn',
                                                                                                                                                       '$2a$10$N0mJ4.gC2yv6.4bZ2p.C/e1P0E.f6z9I.0j7H.e3p8U.n2f5j7G.e',
                                                                                                                                                       '0901234567', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=A', 1, NOW(), NOW()
                                                                                                                                                   ),
                                                                                                                                                   (
                                                                                                                                                       TRUE, '1995-11-20', 'tranthib@example.com', 'Bình', 'Trần Thị',
                                                                                                                                                       '$2a$10$R9oP3oE7s8tA/gH2kL.n4e5V6b.7c8d.9f0G.e1h2I.j3k4l5m6N.o',
                                                                                                                                                       '0912345678', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=B', 2, NOW(), NOW()
                                                                                                                                                   ),
                                                                                                                                                   (
                                                                                                                                                       TRUE, '1988-01-30', 'lehoangc@example.com', 'Cường', 'Lê Hoàng',
                                                                                                                                                       '$2a$10$X1y2Z3a4B5c6D7e8F9g0H.i1j2k3l4m5n6o7p8q9r.s0t1u2v3w4x.y',
                                                                                                                                                       '0987654321', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=C', 3, NOW(), NOW()
                                                                                                                                                   ),
                                                                                                                                                   (
                                                                                                                                                       TRUE, '2001-09-10', 'phamthud@example.com', 'Dung', 'Phạm Thu',
                                                                                                                                                       '$2a$10$M8n7O6p5Q4r3S2t1U.v0w.x9y8z7A6b5C4d3e2f1g.h0i9j8k7l6m.n',
                                                                                                                                                       '0978123456', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=D', 4, NOW(), NOW()
                                                                                                                                                   ),
                                                                                                                                                   (
                                                                                                                                                       TRUE, '1992-07-22', 'vovanes@example.com', 'Em', 'Võ Văn',
                                                                                                                                                       '$2a$10$K1l2M3n4O5p6Q7r8S9t0U.v1w2x3y4z5A6b7c8d.e9f0g.h1i2j3k4l.m',
                                                                                                                                                       '0939876543', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=E', 5, NOW(), NOW()
                                                                                                                                                   ),
                                                                                                                                                   (
                                                                                                                                                       FALSE, '1998-03-12', 'dothig@example.com', 'Giang', 'Đỗ Thị',
                                                                                                                                                       '$2a$10$C5d4E3f2G1h0I9j8K7l6M.n5o4p3q2r1s0t.u9v8w.x7y6z5A.B4c3D.e',
                                                                                                                                                       '0945111222', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=G', 6, NOW(), NOW()
                                                                                                                                                   ),
                                                                                                                                                   (
                                                                                                                                                       TRUE, '1999-12-01', 'hoangvanh@example.com', 'Hải', 'Hoàng Văn',
                                                                                                                                                       '$2a$10$W6x5Y4z3A2b1C0d.e9f8G.h7i6j5k4l3m2n1o.p9q8r.s7t6u5v4w.x',
                                                                                                                                                       '0966333444', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=H', 7, NOW(), NOW()
                                                                                                                                                   ),
                                                                                                                                                   (
                                                                                                                                                       TRUE, '1993-08-08', 'ngotuyeti@example.com', 'Yến', 'Ngô Tuyết',
                                                                                                                                                       '$2a$10$T1u2V3w4X5y6Z7a8B9c0D.e1f2g3h4i5j6k.l7m8n.o9p0q.r8s7t6u.v',
                                                                                                                                                       '0905987123', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=Y', 8, NOW(), NOW()
                                                                                                                                                   ),
                                                                                                                                                   (
                                                                                                                                                       TRUE, '1985-02-18', 'trinhvank@example.com', 'Khánh', 'Trịnh Văn',
                                                                                                                                                       '$2a$10$P9q8R7s6T5u4V3w2X1y.z0a.b9c8d7e6f5g4h.i3j2k.l1m0n.o9p8q.r',
                                                                                                                                                       '0918456789', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=K', 9, NOW(), NOW()
                                                                                                                                                   ),
                                                                                                                                                   (
                                                                                                                                                       TRUE, '2000-04-25', 'buihail@example.com', 'Long', 'Bùi Hải',
                                                                                                                                                       '$2a$10$F7g6H5i4J3k2L1m0N.o9p8Q7r6S5t4u3v2w.x1y0z.A9b8c.d7e6f.g',
                                                                                                                                                       '0922789456', 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=L', 10, NOW(), NOW()
                                                                                                                                                   );


-- Chèn dữ liệu mẫu cho thông tin ngân hàng của người dùng
INSERT INTO bank_informations (user_id, bank_name, account_holder_name, account_number, created_at, updated_at) VALUES
                                                                                                                    (
                                                                                                                        1,
                                                                                                                        'Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)',
                                                                                                                        'NGUYEN VAN AN',
                                                                                                                        '19031234567890',
                                                                                                                        NOW(),
                                                                                                                        NOW()
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        2,
                                                                                                                        'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
                                                                                                                        'TRAN THI BINH',
                                                                                                                        '0071001234567',
                                                                                                                        NOW(),
                                                                                                                        NOW()
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        3,
                                                                                                                        'Ngân hàng TMCP Á Châu (ACB)',
                                                                                                                        'LE HOANG CUONG',
                                                                                                                        '88889999',
                                                                                                                        NOW(),
                                                                                                                        NOW()
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        4,
                                                                                                                        'Ngân hàng TMCP Quân đội (MB Bank)',
                                                                                                                        'PHAM THU DUNG',
                                                                                                                        '0978123456',
                                                                                                                        NOW(),
                                                                                                                        NOW()
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        5,
                                                                                                                        'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
                                                                                                                        'VO VAN EM',
                                                                                                                        '58110000123456',
                                                                                                                        NOW(),
                                                                                                                        NOW()
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        6,
                                                                                                                        'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)',
                                                                                                                        'DO THI GIANG',
                                                                                                                        '3100205123456',
                                                                                                                        NOW(),
                                                                                                                        NOW()
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        8,
                                                                                                                        'Ngân hàng TMCP Tiên Phong (TPBank)',
                                                                                                                        'NGO TUYET YEN',
                                                                                                                        '0905987123',
                                                                                                                        NOW(),
                                                                                                                        NOW()
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        10,
                                                                                                                        'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
                                                                                                                        'BUI HAI LONG',
                                                                                                                        '9876543210',
                                                                                                                        NOW(),
                                                                                                                        NOW()
                                                                                                                    );