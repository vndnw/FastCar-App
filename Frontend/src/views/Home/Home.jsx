import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Alert, Empty } from 'antd';
import './Home.css';
import CarSection from '../../components/CarSection/CarSection';
import { carService } from '../../services/carService';

// Cache đơn giản để tránh gọi API không cần thiết
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

const Home = () => {
  const [sampleCars, setSampleCars] = useState([]);
  const [luxuryCars, setLuxuryCars] = useState([]);
  const [superLuxuryCars, setSuperLuxuryCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({
    luxury: true,
    standard: true,
    superLuxury: true
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Cleanup function để tránh memory leak
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Helper function để check cache
    const getCachedData = (key) => {
      const cached = cache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
      return null;
    };

    // Helper function để set cache
    const setCachedData = (key, data) => {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
    };

    // Progressive loading - tải từng loại xe một cách độc lập
    const fetchCarType = async (apiCall, cacheKey, loadingKey) => {
      try {
        // Kiểm tra cache trước
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log(`Loading ${cacheKey} from cache`);
          if (isMountedRef.current) {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
          }
          return cachedData;
        }

        // Gọi API nếu không có cache
        const response = await apiCall();
        const data = response?.data?.data?.content || response?.data?.content || [];
        
        if (isMountedRef.current) {
          setCachedData(cacheKey, data);
          setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        }
        return data;
      } catch (error) {
        console.warn(`Failed to load ${cacheKey}:`, error.message || error);
        if (isMountedRef.current) {
          setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        }
        return [];
      }
    };

    // Gọi song song các API với Promise.allSettled
    const fetchAll = async () => {
      try {
        setError(null);
        
        // Khởi tạo loading states
        setLoadingStates({
          luxury: true,
          standard: true,
          superLuxury: true
        });

        // Fetch song song với progressive loading
        const [superLuxuryData, luxuryData, standardData] = await Promise.allSettled([
          fetchCarType(() => carService.getCarsSuperLuxury(), 'superLuxury', 'superLuxury'),
          fetchCarType(() => carService.getCarsLuxury(), 'luxury', 'luxury'),
          fetchCarType(() => carService.getCarsStandard(), 'standard', 'standard')
        ]);

        // Combine data cho các sections
        if (isMountedRef.current) {
          const superLuxuryResult = superLuxuryData.status === 'fulfilled' ? superLuxuryData.value : [];
          const luxuryResult = luxuryData.status === 'fulfilled' ? luxuryData.value : [];
          const standardResult = standardData.status === 'fulfilled' ? standardData.value : [];
          
          // Set riêng biệt các loại xe
          setSuperLuxuryCars(superLuxuryResult);
          setLuxuryCars(luxuryResult);
          setSampleCars(standardResult);
        }

        // Kiểm tra nếu tất cả đều fail
        const allFailed = [superLuxuryData, luxuryData, standardData]
          .every(result => result.status === 'rejected');
        
        if (allFailed) {
          throw new Error('Không thể tải dữ liệu xe');
        }

      } catch (error) {
        console.error('Error in fetchAll:', error);
        if (isMountedRef.current) {
          setError(`Không thể tải dữ liệu xe. ${error.message || 'Vui lòng thử lại sau.'}`);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };
    
    fetchAll();
  }, []);
  const handleViewMoreRegular = useCallback(() => {
    navigate('/car-listing?carType=STANDARD');
  }, [navigate]);

  const handleViewMoreLuxury = useCallback(() => {
    navigate('/car-listing?carType=LUXURY');
  }, [navigate]);

  // Memoize để tránh re-render không cần thiết
  const regularCarsSection = useMemo(() => {
    if (loadingStates.standard) {
      return (
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center' 
        }}>
          <Spin size="large" tip="Đang tải xe có ngay..." />
        </div>
      );
    }

    return sampleCars.length > 0 ? (
      <CarSection
        title="Xe có ngay"
        cars={sampleCars}
        buttonText="XEM THÊM XE CÓ NGAY"
        onButtonClick={handleViewMoreRegular}
        backgroundColor="#f5f5f5"
      />
    ) : (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center' 
      }}>
        <Empty 
          description="Hiện tại không có xe nào" 
          style={{ margin: '40px 0' }}
        />
      </div>
    );
  }, [sampleCars, loadingStates.standard, handleViewMoreRegular]);

  const luxuryCarsSection = useMemo(() => {
    if (loadingStates.luxury || loadingStates.superLuxury) {
      return (
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center' 
        }}>
          <Spin size="large" tip="Đang tải xe cao cấp..." />
        </div>
      );
    }

    // Combine both luxury and super luxury cars
    const combinedCars = [...luxuryCars, ...superLuxuryCars];

    return combinedCars.length > 0 ? (
      <CarSection
        title="Xe sang & Siêu xe"
        cars={combinedCars}
        buttonText="XEM THÊM XE SANG & SIÊU XE"
        onButtonClick={handleViewMoreLuxury}
        backgroundColor="#fafafa"
      />
    ) : (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center' 
      }}>
        <Empty 
          description="Hiện tại không có xe cao cấp nào" 
          style={{ margin: '40px 0' }}
        />
      </div>
    );
  }, [luxuryCars, superLuxuryCars, loadingStates.luxury, loadingStates.superLuxury, handleViewMoreLuxury]);

  // Nếu đang loading toàn bộ
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" tip="Đang khởi tạo..." />
      </div>
    );
  }

  // Nếu có lỗi nghiêm trọng
  if (error) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center' 
      }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#ff4d4f',
                color: 'white',
                border: 'none',
                padding: '4px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Thử lại
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      {/* Section 1: Xe có ngay */}
      {regularCarsSection}

      {/* Section 2: Xe sang & Siêu xe */}
      {luxuryCarsSection}
    </div>
  );
};

export default Home;