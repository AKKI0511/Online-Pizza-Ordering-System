import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import api from "../services/api";
import "../styles/Cart.css"
import { ACCESS_TOKEN, STRIPE_PUBLIC_KEY } from '../constants';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(() => {
        // Retrieve cart items from local storage if available
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        // Save cart items to local storage whenever the cart changes
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const getTotalPrice = () => {
        let total = 0;
        for (let item of cartItems) {
            let toppingTotal = 0;
            if (item.toppings) {
                for (let topping of item.toppings) {
                    toppingTotal += parseFloat(topping.price);
                }
            }
            total += (parseFloat(item.price) + toppingTotal) * item.quantity;
        }
        return total.toFixed(2); // toFixed(2) rounds the total to 2 decimal places    
    };

    const removeFromCart = (uniqueKey) => {
        setCartItems(cartItems.filter(item => `${item.id}-${item.size}` !== uniqueKey));
    };

    const incrementQuantity = (uniqueKey) => {
        setCartItems(cartItems.map(x =>
            `${x.id}-${x.size}` === uniqueKey ? { ...x, quantity: x.quantity + 1 } : x
        ));
    };

    const decrementQuantity = (uniqueKey) => {
        setCartItems(cartItems.map(x =>
            `${x.id}-${x.size}` === uniqueKey ? { ...x, quantity: x.quantity - 1 } : x
        ));
        const exist = cartItems.find(x => `${x.id}-${x.size}` === uniqueKey);
        if (exist.quantity === 1) {
            removeFromCart(uniqueKey);
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const handlePayment = async (paymentMethod) => {
        console.log(paymentMethod);
        const paymentData = {
            token: paymentMethod.id,
            amount: getTotalPrice(),  // Assume getTotalPrice() calculates the total cart amount
            description: 'Payment for order',
            return_url: 'http://localhost:3000/order/confirmation',
        };

        try {
            const response = await api.post('/charge/', paymentData, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`, // Include access token in headers
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 201) {
                // Payment successful, redirect to order confirmation page
                navigate('/order/confirmation');
            } else {
                console.error('Payment failed:', response.data.error);
                // Handle payment failure, display error message to user
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            // Handle error during payment processing, display error message to user
        }
    };

    return (
        <div className="cart-container bg-dark text-white">
            <div className="cart-header">
                <h2>Shopping Cart</h2>
                <button className="btn btn-danger clear-cart-btn" onClick={clearCart}>Clear Cart</button>
            </div>
            {cartItems.length === 0 ? (
                <p className="empty-cart-msg">Your cart is empty</p>
            ) : (
                <div>
                    <ul className="list-group">
                        {cartItems.map(item => (
                            <li className="list-group-item cart-item bg-dark text-white" key={`${item.id}-${item.size}`}>
                                <span>{item.name} ({item.size}) - ${item.price}</span>
                                <ul className="list-group topping-list">
                                    {item.toppings && item.toppings.map(topping => (
                                        <li className="list-group-item bg-dark text-white" key={`${item.id}-${item.size}-${topping.name}`}>
                                            {topping.name}: ${topping.price}
                                        </li>
                                    ))}
                                </ul>
                                <div className="quantity-buttons">
                                    <button className="btn btn-outline-primary" onClick={() => incrementQuantity(`${item.id}-${item.size}`)}>+</button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button className="btn btn-outline-primary" onClick={() => decrementQuantity(`${item.id}-${item.size}`)}>-</button>
                                    <button className="btn btn-danger remove-item-btn" onClick={() => removeFromCart(`${item.id}-${item.size}`)}>Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className="cart-total">Total: ${getTotalPrice()}</p>
                    <div className="checkout-section">
                        <h2>Checkout</h2>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm onSubmit={handlePayment} />
                        </Elements>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Cart;
