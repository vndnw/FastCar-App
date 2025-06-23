// Xe có ngay , xe thường
export const sampleCars = [{
    id: 1,
    username: "Nguyễn Văn A",
    name: "Hyundai Stargazer",
    carBrand: {
        id: 1,
        name: "Hyundai",
        logo: "https://placehold.co/200x200/002C5F/FFFFFF?text=Hyundai",
        description: "Hyundai là hãng xe Hàn Quốc nổi tiếng với thiết kế hiện đại và giá cả hợp lý.",
        createAt: "2025-06-01T10:00:00",
        updateAt: "2025-06-01T10:00:00"
    },
    model: "Stargazer",
    year: 2024,
    seats: 7,
    transmission: "AUTO",
    carType: "NORMAL",
    licensePlate: "51A-123.45",
    pricePerHour: 430000,
    pricePer4Hour: 1500000,
    pricePer8Hour: 2800000,
    pricePer12Hour: 3500000,
    pricePer24Hour: 4500000,
    fuelType: "GASOLINE",
    fuelConsumption: "7 L/100km",
    status: "AVAILABLE",
    color: "Trắng",
    description: "Xe gia đình 7 chỗ tiện nghi, rộng rãi, phù hợp du lịch cuối tuần.",
    images: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"
    ],
    features: null,
    location: {
        id: 1,
        address: "Quận 2, TP. Hồ Chí Minh",
        latitude: 10.789,
        longitude: 106.748,
        createdAt: "2025-06-10T09:00:00",
        updatedAt: "2025-06-10T09:00:00"
    },
    createdAt: "2025-06-22T08:00:00",
    updatedAt: "2025-06-22T08:00:00"
},
{
    id: 2,
    username: "Trần Thị B",
    name: "Toyota Veloz Cross",
    carBrand: {
        id: 2,
        name: "Toyota",
        logo: "https://placehold.co/200x200/F50000/FFFFFF?text=Toyota",
        description: "Toyota nổi tiếng với độ bền bỉ và chi phí sử dụng thấp.",
        createAt: "2025-06-01T10:00:00",
        updateAt: "2025-06-01T10:00:00"
    },
    model: "Veloz Cross",
    year: 2024,
    seats: 7,
    transmission: "AUTO",
    carType: "NORMAL",
    licensePlate: "51G-567.89",
    pricePerHour: 450000,
    pricePer4Hour: 1600000,
    pricePer8Hour: 2900000,
    pricePer12Hour: 3600000,
    pricePer24Hour: 4700000,
    fuelType: "GASOLINE",
    fuelConsumption: "6.8 L/100km",
    status: "AVAILABLE",
    color: "Xám",
    description: "MPV 7 chỗ thiết kế hiện đại, phù hợp cho cả gia đình và công việc.",
    images: [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"
    ],
    features: null,
    location: {
        id: 2,
        address: "Quận 12, TP. Hồ Chí Minh",
        latitude: 10.862,
        longitude: 106.696,
        createdAt: "2025-06-11T09:00:00",
        updatedAt: "2025-06-11T09:00:00"
    },
    createdAt: "2025-06-22T08:00:00",
    updatedAt: "2025-06-22T08:00:00"
},
{
    id: 3,
    username: "Lê Văn C",
    name: "SUZUKI XL7 GLX",
    carBrand: {
        id: 3,
        name: "Suzuki",
        logo: "https://placehold.co/200x200/00205B/FFFFFF?text=Suzuki",
        description: "Suzuki là hãng xe Nhật nổi bật với sự thực dụng và tiết kiệm nhiên liệu.",
        createAt: "2025-06-01T10:00:00",
        updateAt: "2025-06-01T10:00:00"
    },
    model: "XL7 GLX",
    year: 2022,
    seats: 7,
    transmission: "AUTO",
    carType: "NORMAL",
    licensePlate: "51D-789.01",
    pricePerHour: 430000,
    pricePer4Hour: 1500000,
    pricePer8Hour: 2800000,
    pricePer12Hour: 3500000,
    pricePer24Hour: 4400000,
    fuelType: "GASOLINE",
    fuelConsumption: "7.5 L/100km",
    status: "AVAILABLE",
    color: "Cam",
    description: "Mẫu SUV lai MPV thiết kế khỏe khoắn, tiết kiệm nhiên liệu.",
    images: [
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
    ],
    features: null,
    location: {
        id: 3,
        address: "Quận Gò Vấp, TP. Hồ Chí Minh",
        latitude: 10.835,
        longitude: 106.668,
        createdAt: "2025-06-12T09:00:00",
        updatedAt: "2025-06-12T09:00:00"
    },
    createdAt: "2025-06-22T08:00:00",
    updatedAt: "2025-06-22T08:00:00"
}
];

// cập nhật thêm
// Xế xịn - Xe sang - Xe cao cấp
// === THÊM LUXURY CARS DATA ===
export const luxuryCars = [
    {
        "id": 9,
        "username": "Chủ xe 1",
        "name": "Mercedes E-Class",
        "carBrand": {
            "id": 1,
            "name": "Mercedes-Benz",
            "logo": "https://placehold.co/200x200/000000/FFFFFF?text=Mercedes",
            "description": "A German manufacturer of luxury vehicles.",
            "createAt": "2025-06-01T10:00:00",
            "updateAt": "2025-06-01T10:00:00"
        },
        "model": "E-Class",
        "year": 2023,
        "seats": 5,
        "transmission": "AUTO",
        "carType": "LUXURY",
        "licensePlate": "51H-999.99",
        "pricePerHour": 132000,
        "pricePer4Hour": 500000,
        "pricePer8Hour": 950000,
        "pricePer12Hour": 1250000,
        "pricePer24Hour": 1500000,
        "fuelType": "GASOLINE",
        "fuelConsumption": "10 L/100km",
        "status": "AVAILABLE",
        "color": "Đen",
        "description": "Dòng sedan hạng sang nổi bật với thiết kế hiện đại và công nghệ tiên tiến.",
        "images": [],
        "features": null,
        "location": {
            "id": 1,
            "address": "Quận Bình Thạnh, TP. Hồ Chí Minh",
            "latitude": 10.803,
            "longitude": 106.707,
            "createdAt": "2025-06-10T09:00:00",
            "updatedAt": "2025-06-10T09:00:00"
        },
        "createdAt": "2025-06-22T08:00:00",
        "updatedAt": "2025-06-22T08:00:00"
    },
    {
        "id": 10,
        "username": "Chủ xe 2",
        "name": "Mercedes E200",
        "carBrand": {
            "id": 1,
            "name": "Mercedes-Benz",
            "logo": "https://placehold.co/200x200/000000/FFFFFF?text=Mercedes",
            "description": "A German manufacturer of luxury vehicles.",
            "createAt": "2025-06-01T10:00:00",
            "updateAt": "2025-06-01T10:00:00"
        },
        "model": "E200",
        "year": 2017,
        "seats": 5,
        "transmission": "AUTO",
        "carType": "LUXURY",
        "licensePlate": "51A-888.88",
        "pricePerHour": 102000,
        "pricePer4Hour": 400000,
        "pricePer8Hour": 750000,
        "pricePer12Hour": 1000000,
        "pricePer24Hour": 1125000,
        "fuelType": "GASOLINE",
        "fuelConsumption": "10.5 L/100km",
        "status": "AVAILABLE",
        "color": "Trắng",
        "description": "Mercedes E200 đời 2017 vẫn giữ được đẳng cấp sang trọng và độ ổn định cao.",
        "images": [],
        "features": null,
        "location": {
            "id": 2,
            "address": "Quận Tân Bình, TP. Hồ Chí Minh",
            "latitude": 10.801,
            "longitude": 106.652,
            "createdAt": "2025-06-10T10:00:00",
            "updatedAt": "2025-06-10T10:00:00"
        },
        "createdAt": "2025-06-22T09:00:00",
        "updatedAt": "2025-06-22T09:00:00"
    },
    {
        "id": 13,
        "username": "Chủ xe 3",
        "name": "BMW 5 Series",
        "carBrand": {
            "id": 2,
            "name": "BMW",
            "logo": "https://placehold.co/200x200/0066B2/FFFFFF?text=BMW",
            "description": "A German multinational company which produces luxury vehicles and motorcycles.",
            "createAt": "2025-06-15T05:05:51.898361",
            "updateAt": "2025-06-15T05:05:51.898361"
        },
        "model": "5 Series",
        "year": 2022,
        "seats": 5,
        "transmission": "AUTO",
        "carType": "LUXURY",
        "licensePlate": "51G-777.77",
        "pricePerHour": 145000,
        "pricePer4Hour": 540000,
        "pricePer8Hour": 1020000,
        "pricePer12Hour": 1350000,
        "pricePer24Hour": 1620000,
        "fuelType": "GASOLINE",
        "fuelConsumption": "10.5 L/100km",
        "status": "AVAILABLE",
        "color": "Xám",
        "description": "BMW 5 Series – sự kết hợp hoàn hảo giữa hiệu suất và sự thoải mái.",
        "images": [],
        "features": null,
        "location": {
            "id": 3,
            "address": "Quận 1, TP. Hồ Chí Minh",
            "latitude": 10.776,
            "longitude": 106.7037,
            "createdAt": "2025-06-10T11:00:00",
            "updatedAt": "2025-06-10T11:00:00"
        },
        "createdAt": "2025-06-22T11:00:00",
        "updatedAt": "2025-06-22T11:00:00"
    }
];
