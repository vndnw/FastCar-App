import React from 'react';
import { Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // === THÊM IMPORT ===

// === IMPORT CHO CARCARD TEST ===
import CarCard from '../../components/CarCard';
import { sampleCars } from '../../data/sampleCars';

const HoChiMinh = () => {
  const carouselRef = React.useRef();
  const navigate = useNavigate(); // === THÊM HOOK NAVIGATE ===

  // Custom arrows cho carousel
  const CustomPrevArrow = ({ onClick }) => (
    <Button
      type="text"
      icon={<LeftOutlined />}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: -50,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #d9d9d9'
      }}
    />
  );

  const CustomNextArrow = ({ onClick }) => (
    <Button
      type="text"
      icon={<RightOutlined />}
      onClick={onClick}
      style={{
        position: 'absolute',
        right: -50,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #d9d9d9'
      }}
    />
  );

  // === THÊM FUNCTION HANDLE CLICK ===
  const handleViewMore = () => {
    navigate('/xe-co-ngay');
  };

  return (
    <div>
      {/* Nội dung cũ */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Hồ Chí Minh</h3>
      </div>

      {/* === CARCARD CAROUSEL SECTION === */}
      <div style={{
        padding: '40px 100px', // Tăng padding cho space arrows
        backgroundColor: '#f5f5f5'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: 40,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333'
        }}>
          Xe có ngay
        </h2>

        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
          <Carousel
            ref={carouselRef}
            arrows
            prevArrow={<CustomPrevArrow />}
            nextArrow={<CustomNextArrow />}
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={4}
            slidesToScroll={1}
            responsive={[
              {
                breakpoint: 1200,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 900,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }
              }
            ]}
          >
            {sampleCars.map(car => (
              <div key={car.id} style={{ padding: '0 8px' }}>
                <CarCard car={car} />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Nút Xem thêm - chính giữa dưới carousel */}
        <div style={{

          textAlign: 'center',
          marginTop: 40
        }}>
          <Button
            type="default"
            size="large"
            onClick={handleViewMore} // === THÊM CLICK HANDLER ===
            style={{
              borderColor: '#1890ff',
              color: '#1890ff',
              fontWeight: 'normal',
              height: 40,
              padding: '0 24px',
              borderRadius: 6,
              fontSize: '14px'
            }}

          >
            XEM THÊM XE CÓ NGAY
          </Button>
        </div>
      </div>
      {/* === END CARCARD CAROUSEL === */}
    </div>
  );
};

export default HoChiMinh;