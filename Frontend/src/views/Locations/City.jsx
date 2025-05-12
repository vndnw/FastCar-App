import React from 'react';
import { useParams } from 'react-router-dom';
import HoChiMinh from './HoChiMinh';
import HaNoi from './HaNoi';
import DaNang from './DaNang';
import BinhDuong from './BinhDuong';
import Header from '../../components/Header/Header';

const cityMap = {
  'ho-chi-minh': {
    name: 'Hồ Chí Minh',
    component: <HoChiMinh />,
  },
  'ha-noi': {
    name: 'Hà Nội',
    component: <HaNoi />,
  },
  'da-nang': {
    name: 'Đà Nẵng',
    component: <DaNang />,
  },
  'binh-duong': {
    name: 'Bình Dương',
    component: <BinhDuong />,
  },
};

const City = () => {
  const { cityName } = useParams();
  const city = cityMap[cityName];

  return (
    <div className="city-page">
      {city ? (
        <>
          <h1 style={{ textAlign: 'center' }}>Trang địa điểm: {city.name}</h1>
          {city.component}
          <Header/>
        </>
      ) : (
        <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Không tìm thấy địa điểm</h2>
      )}
    </div>
  );
};

export default City;
