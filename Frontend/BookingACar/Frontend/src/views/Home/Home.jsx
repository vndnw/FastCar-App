import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { Spin } from "antd";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/ho-chi-minh');
  }, [navigate]);

  return (
    <Spin size="large" className='ant-spin-dot-item'/>
  );
};

export default Home;
