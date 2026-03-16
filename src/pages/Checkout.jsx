import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/api';
import { ShoppingBag, ChevronLeft, Minus, Plus, Trash2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Checkout() {
    const { cart, removeFromCart, updateQuantity, cartTotal, placeOrder } = useCart();
    const [orderCompleted, setOrderCompleted] = useState(false);
    const [orderBill, setOrderBill] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    const total = cartTotal;

    const handlePlaceOrder = async () => {
        if (!customerInfo.name || !customerInfo.phone) {
            alert('Please provide your Name and Phone Number');
            return;
        }

        if (cart.length === 0) return;

        setIsProcessing(true);

        try {
            // 1. Place the order (this handles both local state and Google Sheets sync)
            const newOrder = await placeOrder({
                name: customerInfo.name,
                phone: customerInfo.phone
            });

            // 3. Finalize order state immediately
            setOrderCompleted(true);
            setOrderBill(newOrder);

        } catch (error) {
            console.error(error);
            alert('Failed to place order. Please check your connection or Backend URL.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderCompleted) {
        return (
            <div style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{
                    padding: '40px', background: '#FFF', borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(22, 51, 33, 0.08)'
                }}>
                    <div style={{
                        width: '80px', height: '80px', background: '#22C55E', color: '#FFF',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <Check size={40} />
                    </div>
                    <h2 style={{ fontSize: '32px', color: 'var(--dark-green)', fontStyle: 'italic', marginBottom: '8px', fontWeight: '900' }}>Order Placed Successfully!</h2>
                    <p style={{ color: '#6A7A6E', marginBottom: '32px' }}>Your delicious food is being prepared in the kitchen.</p>

                    <div style={{ padding: '24px', border: '2px dashed rgba(22, 51, 33, 0.1)', borderRadius: '16px', marginBottom: '32px' }}>
                        <div style={{ fontSize: '12px', letterSpacing: '2px', color: '#DCA82D', fontWeight: 'bold', marginBottom: '16px' }}>ORDER RECEIPT</div>
                        {orderBill.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                                <span>{item.name} x {item.count}</span>
                                <span>₹{item.price * item.count}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid rgba(22, 51, 33, 0.1)', marginTop: '16px', paddingTop: '16px', fontWeight: 'bold' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                                <span>Total Payable</span>
                                <span>₹{orderBill.total}</span>
                            </div>
                        </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px' }}>Order Ref: {orderBill.id}</p>
                    <p style={{ fontSize: '12px', color: '#999', margin: '0 0 24px' }}>{new Date(orderBill.timestamp).toLocaleString()}</p>

                    <Link to="/" style={{
                        display: 'inline-block', padding: '12px 32px', background: '#163321',
                        color: '#FFF', borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none'
                    }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "80px 20px", maxWidth: "1000px", margin: "0 auto", minHeight: "80vh" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <Link to="/" style={{ color: '#163321', background: '#FFF', padding: '10px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <ChevronLeft size={24} />
                </Link>
                <h2 style={{ fontSize: "32px", color: "var(--dark-green)", fontStyle: "italic", margin: 0, fontWeight: '900' }}>Review Your Order</h2>
            </div>

            {(cart.length === 0 && !isProcessing && !orderCompleted) ? (
                <div style={{ textAlign: "center", padding: "80px 0", background: "#FFF", borderRadius: "24px", border: "1px solid rgba(22,51,33,0.08)" }}>
                    <p style={{ fontSize: "18px", color: "#6A7A6E", marginBottom: "24px" }}>Your cart is empty.</p>
                    <Link to="/" style={{
                        padding: "12px 32px", background: "#DCA82D", color: "#FFF",
                        textDecoration: "none", borderRadius: "50px", fontSize: "14px", fontWeight: "bold",
                        boxShadow: "0 4px 12px rgba(220,168,45,0.2)"
                    }}>
                        View Menu
                    </Link>
                </div>
            ) : (
                <div className="checkout-container-elite">
                    {/* Left Column: Items */}
                    <div className="checkout-items-elite">
                        <h3 className="section-title-elite">Your Cart</h3>

                        {cart.map(item => (
                            <div key={item.name} className="cart-row-elite">
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#163321" }}>{item.name}</div>
                                    <div style={{ fontSize: "14px", color: "#DCA82D", fontWeight: "bold" }}>₹{item.price}</div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", background: "#F5F2EB", borderRadius: "50px", overflow: "hidden" }}>
                                        <button onClick={() => updateQuantity(item.name, -1)} style={{ padding: "8px 12px", background: "none", border: "none", cursor: "pointer", color: "#163321" }}><Minus size={14} /></button>
                                        <span style={{ fontSize: "14px", fontWeight: "bold", width: "24px", textAlign: "center" }}>{item.count}</span>
                                        <button onClick={() => updateQuantity(item.name, 1)} style={{ padding: "8px 12px", background: "none", border: "none", cursor: "pointer", color: "#163321" }}><Plus size={14} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.name)} style={{ background: "rgba(209, 65, 36, 0.1)", border: "none", color: "#D14124", borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: "pointer" }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Details & Summary */}
                    <div className="checkout-sidebar-elite">
                        <div className="checkout-section-white">
                            <h3 style={{ fontSize: '20px', color: '#163321', marginBottom: '24px', fontStyle: 'italic' }}>Customer Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6A7A6E', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>NAME</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6A7A6E', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>MOBILE NUMBER</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="checkout-summary-dark">
                            <h3 style={{ fontSize: '18px', color: '#FFF', marginBottom: '24px', fontStyle: 'italic', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Order Summary</h3>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'rgba(255,255,255,0.7)' }}>
                                <span>Total Amount</span>
                                <span style={{ color: '#DCA82D', fontSize: '24px', fontWeight: 'bold' }}>₹{total}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || total === 0}
                                style={{
                                    width: '100%', padding: '18px', background: '#DCA82D', border: 'none', borderRadius: '50px',
                                    color: 'var(--dark-green)', fontSize: '14px', fontWeight: 'bold', cursor: total === 0 ? 'not-allowed' : 'pointer',
                                    letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.2s',
                                    opacity: (isProcessing || total === 0) ? 0.7 : 1, marginTop: '16px',
                                    fontFamily: "'Inter', sans-serif"
                                }}
                            >
                                {isProcessing ? 'Processing...' : 'Confirm Order'}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '20px', lineHeight: 1.5 }}>
                                Your order will be logged directly into our system. <br /> Pay at the counter if required.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                .checkout-container-elite {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 40px;
                    align-items: start;
                }
                .checkout-items-elite { 
                    background: #FFF; padding: 32px; borderRadius: 24px; 
                    border: 1px solid rgba(22,51,33,0.1); boxShadow: 0 10px 30px rgba(0,0,0,0.02); 
                }
                .section-title-elite { 
                    fontSize: 20px; color: #163321; margin: 0 0 24px; 
                    paddingBottom: 16px; borderBottom: 1px solid rgba(22,51,33,0.1); 
                }
                .cart-row-elite { 
                    display: flex; justifyContent: space-between; alignItems: center; 
                    padding: 20px 0; borderBottom: 1px solid rgba(22,51,33,0.05); 
                }
                .checkout-section-white { 
                    background: #FFF; borderRadius: 24px; padding: 32px; 
                    border: 1px solid rgba(22,51,33,0.08); boxShadow: 0 10px 30px rgba(0,0,0,0.02); 
                }
                .checkout-summary-dark { 
                    background: #163321; borderRadius: 24px; padding: 32px; 
                    color: #FFF; boxShadow: 0 20px 40px rgba(22,51,33,0.15); 
                }
                .checkout-sidebar-elite {
                    display: flex; flexDirection: column; gap: 24px;
                }

                @media (max-width: 900px) {
                    .checkout-container-elite { 
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                    .checkout-items-elite, .checkout-section-white, .checkout-summary-dark {
                        padding: 24px;
                    }
                    .cart-row-elite {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 16px;
                    }
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(22,51,33,0.1)',
    fontSize: '14px', outline: 'none', background: '#FCFAF5', transition: 'border-color 0.2s'
};
