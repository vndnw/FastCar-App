import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import CarSection from '../../components/CarSection/CarSection';
import { carService } from '../../services/carService';

const Home = () => {
  const [sampleCars, setSampleCars] = useState([]);
  const [luxuryCars, setLuxuryCars] = useState([]);


  const fetchCarsSuperLuxury = async () => {
    try {
      const response = await carService.getCarsSuperLuxury();
      setLuxuryCars(response.data.content);
      console.log('Luxury Cars:', response.data.content);
    } catch (error) {
      console.error('Error fetching luxury cars:', error);
    }
  };

  const fetchAllCars = async () => {
    try {
      const [luxuryRes, standardRes] = await Promise.all([
        carService.getCarsLuxury(),
        carService.getCarsStandard()
      ]);
      // Gộp dữ liệu từ cả hai response
      const allCars = [...luxuryRes.data.content, ...standardRes.data.content];
      setSampleCars(allCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };


  const navigate = useNavigate();

  useEffect(() => {
    fetchCarsSuperLuxury();
    fetchAllCars();
  }, []);

  console.log('Sample Cars:', sampleCars);
  console.log('Luxury Cars:', luxuryCars);

  // Xử lý click nút "XEM THÊM XE CÓ NGAY"
  const handleViewMoreRegular = () => {
    navigate('/xe-co-ngay?category=normal');
  };

  // Xử lý click nút "XEM THÊM XE XẾ XIN" 
  const handleViewMoreLuxury = () => {
    navigate('/xe-co-ngay?category=luxury');
  };

  return (
    <>
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
    </>
  );
};


export default Home;