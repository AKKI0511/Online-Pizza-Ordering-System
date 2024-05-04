import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import MenuItem from './MenuItem';
import "../styles/Menu.css"

const Menu = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [error, setError] = useState("");

    const fetchMenuItems = useCallback(() => {
        return api.get(`/menuitems/`);
    }, []);

    useEffect(() => {
        const getItems = async () => {
            try {
                const response = await fetchMenuItems();
                setItems(response.data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
                setError("Failed to fetch items");
            }
        };
        getItems();
    }, [fetchMenuItems]);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, size, price) => {
        const uniqueKey = `${item.id}-${size}`;  // Create a unique key
        const existIndex = cartItems.findIndex(x => `${x.id}-${x.size}` === uniqueKey);
        if (existIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existIndex].quantity++;
            setCartItems(updatedCartItems);
        } else {
            setCartItems([...cartItems, { ...item, size, quantity: 1, price }]);
        }
    };

    const filteredItems = category === 'All' ? items : items.filter(item => {
        return (category === 'All' || item.category === category) && item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="container">
            <h1 className="text-white">Menu</h1>
            {error && <p className="text-danger">{error}</p>}
            <div className="filter-search-container mb-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <label className="text-white mb-2 mb-md-0 mr-2">Filter by Category:</label>
                    <select
                        className="form-select bg-dark text-light mr-2 mb-2 mb-md-0"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                    >
                        <option value="All">All</option>
                        <option value="Pizza">Pizza</option>
                        <option value="Breads">Breads</option>
                        <option value="Deserts">Deserts</option>
                    </select>
                    <input
                        type="text"
                        className="form-control bg-dark text-light"
                        placeholder="Search menu items..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                </div>
            </div>
            <div className="menu-list">
                {filteredItems.map(item => (
                    <MenuItem key={`${item.id}-${item.size}`} item={item} addToCart={addToCart} />
                ))}
            </div>
        </div>
    );
};

export default Menu;
