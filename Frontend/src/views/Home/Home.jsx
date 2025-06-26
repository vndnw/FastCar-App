import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import CarSection from '../../components/CarSection/CarSection';
import { carService } from '../../services/carService';

const Home = () => {
  const [sampleCars, setSampleCars] = useState([]);
  const [luxuryCars, setLuxuryCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi song song các API và set state
    const fetchAll = async () => {
      try {
        const [superLuxuryRes, luxuryRes, standardRes] = await Promise.all([
          carService.getCarsSuperLuxury(),
          carService.getCarsLuxury(),
          carService.getCarsStandard()
        ]);
        setLuxuryCars(superLuxuryRes.data.content);
        setSampleCars([...luxuryRes.data.content, ...standardRes.data.content]);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchAll();
  }, []);

  const handleViewMoreRegular = () => {
    navigate('/xe-co-ngay?category=normal');
  };

  const handleViewMoreLuxury = () => {
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

export default Home;