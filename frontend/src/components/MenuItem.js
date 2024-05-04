import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/MenuItem.css"

const MenuItem = ({ item, addToCart }) => {
    const [buttonClicked, setButtonClicked] = useState(null);
    const navigate = useNavigate();

    const handleButtonClick = (size, price) => {
        addToCart(item, size, price);
        setButtonClicked(size);
        setTimeout(() => setButtonClicked(null), 1000); // Reset animation after 1 second
    };

    return (
        <div className="menu-item-container bg-dark text-white d-flex align-items-stretch p-3">
            <div className="menu-item-img-container">
                <img src={item.image} alt={item.name} className="menu-item-img" />
            </div>
            <div className="menu-item-details d-flex flex-column justify-content-between">
                <div onClick={() => navigate(`/menu/${item.id}`)} style={{ cursor: 'pointer' }}>
                    <h3 className="menu-item-title">{item.name}</h3>
                    <p className="menu-item-price">Small: ${item.price_small} | Large: ${item.price_large}</p>
                    <p className="menu-item-description">{item.description}</p>
                </div>
                <div className="menu-item-actions justify-content-between align-items-center">
                    <button
                        className={`btn btn-outline-light ${buttonClicked === 'Small' ? 'btn-animation' : ''}`}
                        onClick={() => handleButtonClick('Small', item.price_small)}
                    >
                        Add Small
                    </button>
                    <button
                        className={`btn btn-outline-light ${buttonClicked === 'Large' ? 'btn-animation' : ''}`}
                        onClick={() => handleButtonClick('Large', item.price_large)}
                    >
                        Add Large
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
