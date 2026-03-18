import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './FloatingCart.css';

export default function FloatingCart() {
    const { cart } = useCart();
    
    const itemsInCart = cart.reduce((sum, item) => sum + item.count, 0);

    if (itemsInCart === 0) {
        return null; // Hide completely when empty
    }

    return (
        <Link 
            to="/checkout" 
            className="floating-cart" 
            aria-label={`Open cart with ${itemsInCart} item${itemsInCart > 1 ? 's' : ''}`}
        >
            <div className="floating-cart__inner">
                <ShoppingBag size={24} strokeWidth={2.2} />
                <span className="floating-cart__badge">{itemsInCart}</span>
            </div>
        </Link>
    );
}
