import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Clock, ChefHat, CheckCircle } from 'lucide-react';

export default function Kitchen() {
    const [scannedOrderId, setScannedOrderId] = useState(null);
    const { orders, updateOrderStatus } = useCart();
    const location = useLocation();

    useEffect(() => {
        // Check if the Chef arrived here by scanning a QR code (e.g. /kitchen?orderId=ORD-1234)
        const params = new URLSearchParams(location.search);
        const id = params.get('orderId');
        if (id) {
            setScannedOrderId(id);
        }
    }, [location]);

    // If a specific order was scanned, show only that order at the top or filter for it
    // For this demo, we'll just highlight it if it matches

    return (
        <div style={{ padding: "40px 20px", background: "var(--ivory)", minHeight: "100vh", position: 'relative' }}>
            {/* Grain Texture Overlay */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
            
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1600px', margin: '0 auto' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "60px", background: "var(--emerald)", padding: "32px 48px", borderRadius: "2px", color: "var(--ivory)", boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px' }}>
                            <ChefHat size={40} color="var(--saffron)" strokeWidth={1} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "900", letterSpacing: "-1px", fontStyle: 'italic', fontFamily: "'Playfair Display', serif" }}>Atelier of Kaapi</h1>
                            <div style={{ color: "var(--saffron)", fontSize: "11px", marginTop: "6px", fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px' }}>Live Order Manifest</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(226, 167, 63, 0.1)", padding: "12px 24px", borderRadius: "100px", fontSize: "11px", fontWeight: "900", border: '1px solid rgba(226, 167, 63, 0.2)', color: 'var(--saffron)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        <div className="pulse-online" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--saffron)" }} />
                        Sanctuary Sync: Online
                    </div>
                </div>

            <div style={{ display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "24px", perspective: "1000px" }}>
                {orders.length === 0 ? (
                    <div style={{ textAlign: "center", width: "100%", padding: "100px 0", color: "#6A7A6E", fontSize: "18px", animation: 'fadeIn 1s ease-out' }}>
                        No active orders at the moment.
                    </div>
                ) : (
                    orders.map((order, index) => {
                        const isScanned = order.id === scannedOrderId;
                        return (
                            <div key={order.id} style={{
                                minWidth: "380px", background: "#FFFFFF", borderRadius: "24px", overflow: "hidden",
                                boxShadow: isScanned ? "0 0 0 4px #DCA82D, 0 30px 60px rgba(220,168,45,0.25)" : "0 15px 40px rgba(0,0,0,0.06)",
                                display: "flex", flexDirection: "column",
                                border: "1px solid rgba(0,0,0,0.04)",
                                transform: isScanned ? "scale(1.02) translateY(-10px)" : "scale(1)",
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                animation: `cardEntry 0.6s ease-out ${index * 0.1}s forwards`,
                                opacity: 0
                            }}>
                                <div style={{ padding: "24px", background: isScanned ? "#FFF8E1" : "#F8F9FA", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ fontSize: "24px", fontWeight: "900", color: "#163321", letterSpacing: "-1px", fontFamily: "'Playfair Display', serif" }}>{order.id}</div>
                                        <div style={{ fontSize: "13px", color: "#6A7A6E", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", fontWeight: "600" }}>
                                            <Clock size={14} /> {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {isScanned && (
                                        <div style={{ background: "#DCA82D", color: "#FFF", fontSize: "11px", fontWeight: "900", padding: "6px 14px", borderRadius: "50px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                                            Scanned
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: "24px", flex: 1 }}>
                                    {order.items.map(item => (
                                        <div key={item.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px", paddingBottom: "18px", borderBottom: "1px dashed rgba(0,0,0,0.08)" }}>
                                            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                                                <div style={{
                                                    background: "#163321", color: "#FFF",
                                                    width: "32px", height: "32px", borderRadius: "8px",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontWeight: "900", fontSize: "15px",
                                                    boxShadow: "0 4px 10px rgba(22,51,33,0.2)"
                                                }}>
                                                    {item.count}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "17px", fontWeight: "bold", color: "#2A2A2A" }}>{item.name}</div>
                                                    {item.qty && <div style={{ fontSize: "13px", color: "#6A7A6E", marginTop: "4px" }}>Size: {item.qty}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ padding: "24px", background: "#F8F9FA", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                                    {order.status === "Preparing" ? (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, "Ready")}
                                            style={{
                                                width: "100%", padding: "18px", background: "#4CAF50", color: "#FFF",
                                                border: "none", borderRadius: "16px", fontSize: "15px", fontWeight: "900", cursor: "pointer",
                                                display: "flex", justifyContent: "center", alignItems: "center", gap: "10px",
                                                boxShadow: "0 10px 25px rgba(76, 175, 80, 0.3)",
                                                transition: "all 0.3s"
                                            }}
                                            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                            <CheckCircle size={22} /> Mark as Ready
                                        </button>
                                    ) : (
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", color: "#4CAF50", fontWeight: "900", padding: "18px", background: "rgba(76, 175, 80, 0.1)", borderRadius: "16px", border: "1px solid rgba(76, 175, 80, 0.1)" }}>
                                            <CheckCircle size={22} /> Order Ready
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <style>{`
        ::-webkit-scrollbar { height: 12px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(22,51,33,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(22,51,33,0.2); }
        
        @keyframes cardEntry {
            from { opacity: 0; transform: translateY(40px) rotateX(-5deg); }
            to { opacity: 1; transform: translateY(0) rotateX(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes pulseIndicator {
            0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
            100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
        .pulse-online {
            animation: pulseIndicator 2s infinite;
        }
      `}</style>
            </div>
        </div>
    );
}
