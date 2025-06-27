// CarGallery.jsx – Component hiển thị ảnh xe
import React, { useState } from 'react';
import './CarGallery.css';

const CarGallery = ({ car }) => {
    // Đảm bảo images là mảng URL hợp lệ
    const images = Array.isArray(car.images)
        ? car.images.map(img => (img && img.imageUrl ? img.imageUrl : 'https://cdn.tgdd.vn/Files/2022/01/06/1409479/Gallery/vinfast-vf7-8-164143096342319009.jpg'))
        : ['https://cdn.tgdd.vn/Files/2022/01/06/1409479/Gallery/vinfast-vf7-8-164143096342319009.jpg'];

    const [activeImage, setActiveImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="car-gallery">
            <div className="main-image">
                <img
                    src={images[activeImage]}
                    alt={car.name}
                    className="main-car-image"
                    onClick={() => setIsModalOpen(true)}
                    style={{ cursor: 'zoom-in' }}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://cdn.tgdd.vn/Files/2022/01/06/1409479/Gallery/vinfast-vf7-8-164143096342319009.jpg'; }}
                />
                {/* <div className="view-all-badge">
                    <button type="button" className="view-all-btn">
                        XEM TẤT CẢ
                    </button>
                </div> */}
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

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button
                            className="modal-prev"
                            onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}
                        >
                            &#8592;
                        </button>
                        <img
                            src={images[activeImage]}
                            alt={car.name}
                            className="modal-image"
                            onError={e => { e.target.onerror = null; e.target.src = 'https://cdn.tgdd.vn/Files/2022/01/06/1409479/Gallery/vinfast-vf7-8-164143096342319009.jpg'; }}
                        />
                        <button
                            className="modal-next"
                            onClick={() => setActiveImage((activeImage + 1) % images.length)}
                        >
                            &#8594;
                        </button>
                        <button className="close-modal" onClick={() => setIsModalOpen(false)}>×</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarGallery;
