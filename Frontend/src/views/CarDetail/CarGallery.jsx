// CarGallery.jsx – Component hiển thị ảnh xe
import React, { useState } from 'react';
import './CarGallery.css';


const CarGallery = ({ car }) => {
    const [activeImage, setActiveImage] = useState(0);
    const images = car.images;

    return (
        <div className="car-gallery">
            <div className="main-image">
                <img
                    src={images[activeImage]}
                    alt={car.name}
                    className="main-car-image"
                />
                <div className="view-all-badge">
                    <button type="button" className="view-all-btn">
                        XEM TẤT CẢ
                    </button>
                </div>
            </div>

            <div className="thumbnail-gallery">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                        onClick={() => setActiveImage(index)}
                    >
                        <img src={image} alt={`${car.name} ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarGallery;
