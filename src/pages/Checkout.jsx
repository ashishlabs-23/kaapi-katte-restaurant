import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ChevronLeft, Minus, Plus, Trash2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Checkout() {
    const { cart, removeFromCart, updateQuantity, cartTotal, placeOrder } = useCart();
    const [orderCompleted, setOrderCompleted] = useState(false);
    const [orderBill, setOrderBill] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [syncNotice, setSyncNotice] = useState(null);

    const total = cartTotal;

    const handlePlaceOrder = async () => {
        const trimmedName = customerInfo.name.trim();
        const normalizedPhone = customerInfo.phone.replace(/\D/g, '');

        if (!trimmedName || normalizedPhone.length !== 10) {
            alert('Please provide your name and a valid 10-digit phone number.');
            return;
        }

        if (cart.length === 0) return;

        setIsProcessing(true);

        try {
            // 1. Place the order (this handles both local state and Google Sheets sync)
            const newOrder = await placeOrder({
                name: trimmedName,
                phone: normalizedPhone
            });

            // 3. Finalize order state immediately
            setOrderCompleted(true);
            setOrderBill(newOrder);
            setSyncNotice(
                newOrder.syncStatus === 'sent'
                    ? {
                        tone: 'success',
                        text: 'Order synced to the live kitchen ledger.'
                    }
                    : {
                        tone: 'warning',
                        text: 'Order saved locally on this device. Backend sync needs attention.'
                    }
            );

        } catch (error) {
            console.error(error);
            alert('Unable to create the local order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderCompleted) {
        return (
            <div style={{ padding: '120px 20px', minHeight: '90vh', background: 'var(--ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    padding: '60px 40px', background: '#FFF', borderRadius: '40px',
                    boxShadow: '0 40px 80px rgba(10, 34, 22, 0.08)', 
                    border: '1px solid rgba(10, 34, 22, 0.05)',
                    maxWidth: '540px', width: '100%', textAlign: 'center',
                    position: 'relative', overflow: 'hidden'
                }} className="mobile-haptic">
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            width: '100px', height: '100px', background: 'var(--emerald)', color: '#FFF',
                            borderRadius: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 32px', transform: 'rotate(10deg)',
                            boxShadow: '0 20px 40px rgba(16, 44, 25, 0.2)'
                        }}>
                            <Check size={48} style={{ transform: 'rotate(-10deg)' }} />
                        </div>
                        
                        <h2 style={{ 
                            fontSize: '42px', color: 'var(--dark-green)', 
                            fontFamily: "'Playfair Display', serif", 
                            fontStyle: 'italic', marginBottom: '12px', fontWeight: '900',
                            letterSpacing: '-1px'
                        }}>Prasada Accepted</h2>
                        
                        <p style={{ color: '#6A7A6E', marginBottom: '40px', fontSize: '16px', lineHeight: '1.6' }}>
                            Your order has been sacredly received. <br/> Our chefs are infusing love into your meal.
                        </p>

                        {syncNotice && (
                            <div style={{
                                marginBottom: '28px',
                                padding: '14px 18px',
                                borderRadius: '18px',
                                background: syncNotice.tone === 'success'
                                    ? 'rgba(76, 175, 80, 0.1)'
                                    : 'rgba(226, 167, 63, 0.14)',
                                color: syncNotice.tone === 'success' ? '#2E7D32' : '#8A5A00',
                                border: syncNotice.tone === 'success'
                                    ? '1px solid rgba(76, 175, 80, 0.16)'
                                    : '1px solid rgba(226, 167, 63, 0.24)',
                                fontSize: '13px',
                                fontWeight: '700',
                                lineHeight: 1.6
                            }}>
                                {syncNotice.text}
                            </div>
                        )}

                        <div style={{ 
                            padding: '32px', background: 'rgba(250, 249, 246, 0.8)', 
                            borderRadius: '24px', marginBottom: '40px',
                            border: '1px solid rgba(10, 34, 22, 0.04)',
                            textAlign: 'left'
                        }}>
                            <div style={{ 
                                fontSize: '11px', letterSpacing: '3px', color: 'var(--saffron)', 
                                fontWeight: '900', marginBottom: '20px', textAlign: 'center',
                                borderBottom: '1px dashed rgba(10, 34, 22, 0.1)', paddingBottom: '12px'
                            }}>DIVINE RECEIPT</div>
                            
                            {orderBill.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '12px', color: '#163321' }}>
                                    <span style={{ fontWeight: '500' }}>{item.name} <span style={{ color: '#999', fontSize: '13px' }}>x {item.count}</span></span>
                                    <span style={{ fontWeight: '700' }}>₹{item.price * item.count}</span>
                                </div>
                            ))}
                            
                            <div style={{ borderTop: '2px solid rgba(10, 34, 22, 0.05)', marginTop: '20px', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', color: 'var(--dark-green)', fontWeight: '900' }}>
                                    <span>Total Payable</span>
                                    <span style={{ color: 'var(--saffron)' }}>₹{orderBill.total}</span>
                                </div>
                            </div>
                        </div>

                        <Link to="/" style={{
                            display: 'block', padding: '20px 32px', background: 'var(--dark-green)',
                            color: 'var(--ivory)', borderRadius: '50px', fontWeight: '900', 
                            textDecoration: 'none', letterSpacing: '2px', textTransform: 'uppercase',
                            fontSize: '13px', transition: 'all 0.3s ease',
                            boxShadow: '0 15px 30px rgba(10, 34, 22, 0.2)'
                        }} className="mobile-haptic">
                            Continue Your Journey
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "120px 20px 80px", maxWidth: "1100px", margin: "0 auto", minHeight: "90vh" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>
                <Link to="/" style={{ 
                    color: 'var(--dark-green)', background: '#FFF', width: '56px', height: '56px', 
                    borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s var(--ease-heavy)'
                }} className="mobile-haptic">
                    <ChevronLeft size={28} />
                </Link>
                <div>
                    <h2 style={{ 
                        fontSize: "48px", color: "var(--dark-green)", 
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic", margin: 0, fontWeight: '900',
                        letterSpacing: '-1.5px'
                    }}>Review Order</h2>
                    <p style={{ color: '#6A7A6E', margin: '4px 0 0', fontSize: '14px', letterSpacing: '1px' }}>REFINING YOUR KAAPI EXPERIENCE</p>
                </div>
            </div>

            {(cart.length === 0 && !isProcessing && !orderCompleted) ? (
                <div style={{ 
                    textAlign: "center", padding: "100px 40px", background: "#FFF", 
                    borderRadius: "40px", border: "1px solid rgba(10,34,22,0.05)",
                    boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ opacity: 0.1, marginBottom: '24px' }}><ShoppingBag size={80} style={{ margin: '0 auto' }} /></div>
                    <p style={{ fontSize: "20px", color: "#6A7A6E", marginBottom: "32px", fontFamily: "'Inter', sans-serif" }}>Your cart is empty.</p>
                    <Link to="/" style={{
                        padding: "18px 48px", background: "var(--saffron)", color: "var(--dark-green)",
                        textDecoration: "none", borderRadius: "50px", fontSize: "14px", fontWeight: "900",
                        boxShadow: "0 15px 30px rgba(226,167,63,0.3)", letterSpacing: '2px', textTransform: 'uppercase'
                    }} className="mobile-haptic">
                        Explore Menu
                    </Link>
                </div>
            ) : (
                <div className="checkout-container-elite">
                    {/* Left Column: Items */}
                    <div className="checkout-items-elite">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 className="section-title-elite">Sacred Selection</h3>
                            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--saffron)', letterSpacing: '2px' }}>{cart.length} ITEMS</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {cart.map(item => (
                                <div key={item.name} className="cart-card-elite card-depth">
                                    <div style={{ flex: 1 }}>
                                        <div style={{ 
                                            fontSize: "22px", fontWeight: "900", color: "var(--dark-green)", 
                                            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                                            marginBottom: '4px'
                                        }}>{item.name}</div>
                                        <div style={{ fontSize: "15px", color: "var(--saffron)", fontWeight: "800", letterSpacing: '1px' }}>₹{item.price}</div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                                        <div style={{ 
                                            display: "flex", alignItems: "center", background: "#F5F2EB", 
                                            borderRadius: "16px", padding: '4px', border: '1px solid rgba(10,34,22,0.05)'
                                        }}>
                                            <button 
                                                onClick={() => updateQuantity(item.name, -1)} 
                                                className="qty-btn-elite mobile-haptic"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span style={{ fontSize: "16px", fontWeight: "900", width: "32px", textAlign: "center", color: 'var(--dark-green)' }}>{item.count}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.name, 1)} 
                                                className="qty-btn-elite mobile-haptic"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.name)} 
                                            className="remove-btn-elite mobile-haptic"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details & Summary */}
                    <div className="checkout-sidebar-elite">
                        <div className="checkout-section-white card-depth">
                            <h3 style={{ 
                                fontSize: '24px', color: 'var(--dark-green)', marginBottom: '32px', 
                                fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: '900' 
                            }}>Guest Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="form-group-elite">
                                    <label style={{ fontSize: '11px', fontWeight: '900', color: '#6A7A6E', display: 'block', marginBottom: '10px', letterSpacing: '2px' }}>NAME</label>
                                    <input
                                        type="text"
                                        className="input-elite"
                                        placeholder="Enter your name"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div className="form-group-elite">
                                    <label style={{ fontSize: '11px', fontWeight: '900', color: '#6A7A6E', display: 'block', marginBottom: '10px', letterSpacing: '2px' }}>MOBILE NUMBER</label>
                                    <input
                                        type="tel"
                                        className="input-elite"
                                        placeholder="Enter phone number"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({
                                            ...customerInfo,
                                            phone: e.target.value.replace(/\D/g, '').slice(0, 10)
                                        })}
                                        inputMode="numeric"
                                        maxLength={10}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="checkout-summary-dark glass-panel-elite">
                            <h3 style={{ 
                                fontSize: '20px', color: '#FFF', marginBottom: '28px', 
                                fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: '900',
                                borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px',
                                letterSpacing: '1px'
                            }}>Sacred Bill</h3>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '500', fontSize: '15px' }}>Total Amount</span>
                                <span style={{ color: 'var(--saffron)', fontSize: '32px', fontWeight: '900', fontFamily: "'Playfair Display', serif" }}>₹{total}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || total === 0}
                                style={{
                                    width: '100%', padding: '22px', background: 'var(--saffron)', border: 'none', borderRadius: '50px',
                                    color: 'var(--dark-green)', fontSize: '15px', fontWeight: '900', cursor: total === 0 ? 'not-allowed' : 'pointer',
                                    letterSpacing: '3px', textTransform: 'uppercase', transition: 'all 0.4s var(--ease-heavy)',
                                    opacity: (isProcessing || total === 0) ? 0.6 : 1, marginTop: '20px',
                                    boxShadow: '0 20px 40px rgba(226, 167, 63, 0.2)'
                                }}
                                className="mobile-haptic confirm-btn-elite"
                            >
                                {isProcessing ? 'TRANSFORMING...' : 'Confirm Order'}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '28px', lineHeight: 1.8, letterSpacing: '0.5px' }}>
                                Your order will be consecrated in our kitchen instantly. <br /> Support heritage, pay at the counter.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                .checkout-container-elite {
                    display: grid;
                    grid-template-columns: 1.6fr 1.1fr;
                    gap: 50px;
                    align-items: start;
                }
                .cart-card-elite {
                    background: #FFF; padding: 28px; border-radius: 30px;
                    border: 1px solid rgba(10,34,22,0.05); display: flex; 
                    align-items: center; justify-content: space-between;
                }
                .section-title-elite { 
                    font-size: 28px; color: var(--dark-green); margin: 0; 
                    font-family: 'Playfair Display', serif; font-style: italic; font-weight: 900;
                }
                .qty-btn-elite {
                    width: 36px; height: 36px; display: flex; align-items: center; 
                    justify-content: center; background: none; border: none; 
                    cursor: pointer; color: var(--dark-green); border-radius: 12px;
                    transition: all 0.2s ease;
                }
                .qty-btn-elite:hover { background: rgba(10,34,22,0.05); }
                
                .remove-btn-elite {
                    background: rgba(209, 65, 36, 0.08); border: none; color: #D14124; 
                    border-radius: 16px; width: 48px; height: 48px; display: flex; 
                    align-items: center; justify-content: center; cursor: pointer;
                    transition: all 0.3s ease;
                }
                .remove-btn-elite:hover { background: rgba(209, 65, 36, 0.15); transform: scale(1.05); }

                .checkout-section-white { 
                    background: #FFF; border-radius: 35px; padding: 40px; 
                    border: 1px solid rgba(10,34,22,0.06);
                }
                .checkout-summary-dark { 
                    background: var(--dark-green) !important; border-radius: 40px; padding: 45px 40px; 
                    color: #FFF; position: relative; overflow: hidden;
                    box-shadow: 0 30px 60px rgba(10, 34, 22, 0.2);
                }
                .checkout-summary-dark::before {
                    content: ''; position: absolute; top: -50px; left: -50px;
                    width: 150px; height: 150px; background: radial-gradient(circle, rgba(226, 167, 63, 0.1) 0%, transparent 70%);
                }
                .confirm-btn-elite:hover:not(:disabled) {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 25px 50px rgba(226, 167, 63, 0.4);
                    background: #EBB84D !important;
                }

                @media (max-width: 1024px) {
                    .checkout-container-elite { grid-template-columns: 1fr; gap: 40px; }
                    .checkout-summary-dark { padding: 40px 30px; }
                }

                @media (max-width: 600px) {
                    padding: 100px 15px 40px !important;
                    .section-title-elite { font-size: 24px; }
                    .cart-card-elite { padding: 20px; flex-direction: column; align-items: flex-start; gap: 20px; }
                    .cart-card-elite > div:last-child { width: 100%; justify-content: space-between; }
                    .checkout-section-white { padding: 30px 20px; }
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '18px 24px', borderRadius: '18px',
    fontSize: '15px', outline: 'none', background: '#FCFAF5',
    fontFamily: "'Inter', sans-serif", fontWeight: '500', color: 'var(--dark-green)'
};
