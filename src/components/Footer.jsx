import React from 'react';
import { useCart } from '../context/CartContext';

export default function Footer() {
    const { isChef, toggleChefMode } = useCart();

    return (
        <footer style={{
            borderTop: "1px solid rgba(22, 51, 33, 0.1)",
            padding: "60px 20px 40px",
            textAlign: "center",
            background: "#163321", // Deep green footer
            color: "#FDF8F2"
        }}>
            <div style={{ fontSize: "28px", fontStyle: "italic", color: "#D67E00", marginBottom: "8px", fontFamily: "'Playfair Display', serif" }}>
                Kaapi Katte
            </div>
            <div style={{ color: "rgba(252, 250, 245, 0.7)", fontSize: "14px", letterSpacing: "6px", marginBottom: "32px" }}>ಕಾಪಿ ಕಟ್ಟೆ</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <button 
                    onClick={toggleChefMode}
                    style={{
                        background: 'transparent',
                        border: isChef ? '1px solid #D67E00' : '1px solid rgba(252, 250, 245, 0.2)',
                        color: isChef ? '#D67E00' : 'rgba(252, 250, 245, 0.4)',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    {isChef ? 'Exit Staff Mode' : 'Staff Login'}
                </button>

                <div style={{ color: "rgba(252, 250, 245, 0.3)", fontSize: "11px", letterSpacing: '1px' }}>
                    © 2026 KAAPI KATTE · PURE VEG · BENGALURU
                </div>
            </div>
        </footer>
    );
}
