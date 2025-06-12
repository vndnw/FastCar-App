import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import components
import CarSection from '../../components/CarSection';

// Import data
import { sampleCars, luxuryCars } from '../../data/sampleCars';

const HoChiMinh = () => {
  const navigate = useNavigate();

  // Xử lý click nút "XEM THÊM XE CÓ NGAY"
  const handleViewMoreRegular = () => {
    navigate('/xe-co-ngay');
  };

  // Xử lý click nút "XEM THÊM XE XẾ XIN" 
  const handleViewMoreLuxury = () => {
    // Có thể navigate đến trang riêng cho xe sang hoặc cùng trang với filter
    navigate('/xe-co-ngay?category=luxury');
  };

  return (
    <div>
      {/* Section 1: Xe có ngay */}
      <CarSection
        title="Xe có ngay"
        cars={sampleCars}
        buttonText="XEM THÊM XE CÓ NGAY"
        onButtonClick={handleViewMoreRegular}
        backgroundColor="#f5f5f5"
      />

      {/* Section 2: Xế xịn - Xe sang - Xe cao cấp */}
      <CarSection
        title="Xế xịn - Xe sang - Xe cao cấp"
        cars={luxuryCars}
        buttonText="XEM THÊM XE XẾ XIN"
        onButtonClick={handleViewMoreLuxury}
        backgroundColor="#fafafa"
      />
    </div>
  );
};

export default HoChiMinh;