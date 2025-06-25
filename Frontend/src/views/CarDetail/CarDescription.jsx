// CarDescription.jsx – Component mô tả xe
import React from 'react';
import './CarDescription.css';

const CarDescription = ({ car }) => {
    return (
        <div className="car-description">
            <h3>Mô tả</h3>
            <p>{car.description}</p>
        </div>
    );
};

export default CarDescription;