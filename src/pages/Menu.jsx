import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Coffee, ChevronRight, Plus, ShoppingBag } from 'lucide-react';
import { menuData } from '../data/menuData';

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState("Breakfast");
    const { addToCart, cart } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-elite-active');
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.reveal-elite');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [activeCategory]);

    const getItemCount = (itemName) => {
        const item = cart.find(i => i.name === itemName);
        return item ? item.count : 0;
    };

    /**
     * DESIGN ANALYSIS: The Gallery Philosophy
     * We treat each dish as a piece of art. 
     * The liquid filter provides a tactile, satisfying feedback loop.
     * The grid uses a staggered animation to create a "cascading" entrance effect.
     */
    return (
        <div style={{ background: 'var(--ivory)', minHeight: '100vh', paddingBottom: '160px' }}>
            {/* Artistic Header */}
            <div style={{ 
                padding: '160px 24px 80px', 
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #FFF, transparent)' 
            }}>
                <div style={{ fontStyle: 'italic', color: 'var(--saffron)', letterSpacing: '8px', fontSize: '13px', marginBottom: '24px', textTransform: 'uppercase', fontWeight: '700' }}>
                    A Curation of Heritage
                </div>
                <h1 style={{ fontSize: 'clamp(60px, 8vw, 100px)', color: 'var(--emerald)', margin: 0, fontStyle: 'italic', lineHeight: 1 }}>The Gallery</h1>
                <div style={{ width: '120px', height: '1px', background: 'var(--saffron)', margin: '40px auto' }} />
            </div>

            {/* Liquid Category Filter */}
            <div style={{ 
                position: 'sticky', 
                top: '72px', 
                zIndex: 500, 
                padding: '16px 0',
                display: 'flex',
                justifyContent: 'center',
                background: 'rgba(253, 248, 242, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(10, 34, 22, 0.05)'
            }}>
                <div style={{
                    background: 'rgba(250, 249, 246, 0.8)',
                    backdropFilter: 'blur(20px)',
                    padding: '8px',
                    borderRadius: '100px',
                    display: 'flex',
                    gap: '4px',
                    border: '1px solid rgba(10, 34, 22, 0.05)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
                }}>
                    {Object.keys(menuData).map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '14px 32px',
                                border: 'none',
                                background: activeCategory === cat ? 'var(--emerald)' : 'transparent',
                                color: activeCategory === cat ? 'var(--ivory)' : 'var(--emerald)',
                                borderRadius: '100px',
                                fontSize: '11px',
                                fontWeight: '800',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.6s var(--ease-heavy)'
                            }}
                            className="category-btn-elite"
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Staggered Menu Grid */}
            <div style={{ 
                maxWidth: '1400px', 
                margin: '80px auto', 
                padding: '0 20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '32px'
            }} className="menu-grid-elite">
                {menuData[activeCategory].map((item, idx) => (
                    <div 
                        key={item.name} 
                        className="reveal-elite elite-card" 
                        style={{ 
                            background: '#FFF',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(10, 34, 22, 0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.8s var(--ease-heavy)',
                            animation: `fadeInUp 1s var(--ease-heavy) forwards ${idx * 0.1}s`,
                            border: '1px solid rgba(10, 34, 22, 0.03)'
                        }}
                    >
                        <div style={{ 
                            aspectRatio: '1/1.2', background: '#e5e5e5', borderRadius: '2px', overflow: 'hidden',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.08)',
                            position: 'relative'
                        }}>
                             <img 
                                src={item.image} 
                                alt={item.name} 
                                loading="lazy"
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover', 
                                    transition: 'all 1.2s var(--ease-heavy)',
                                    willChange: 'transform'
                                }} 
                                className="card-img-elite"
                            />
                            <div style={{ 
                                position: 'absolute', 
                                bottom: '0', 
                                left: '0', 
                                background: 'var(--emerald)', 
                                padding: '12px 24px', 
                                fontSize: '16px',
                                fontWeight: '900',
                                color: 'var(--ivory)',
                                letterSpacing: '1px',
                                zIndex: 2
                            }}>
                                ₹{item.price}
                            </div>
                        </div>

                        <div className="card-body-elite" style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <h3 style={{ fontSize: '24px', color: 'var(--emerald)', margin: '0 0 12px', fontStyle: 'italic' }}>{item.name}</h3>
                            <p style={{ color: '#5A6A5E', fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px', flex: 1, fontWeight: '400' }}>
                                {item.desc}
                            </p>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="card-actions-elite">
                                <button 
                                    onClick={() => addToCart(item)}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--emerald)',
                                        border: '1px solid var(--emerald)',
                                        padding: '14px 28px',
                                        borderRadius: '1px',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        transition: 'all 0.4s var(--ease-heavy)'
                                    }}
                                    className="add-btn-elite"
                                >
                                    <Plus size={14} strokeWidth={3} />
                                    Add to Cart
                                </button>
                                
                                {getItemCount(item.name) > 0 && (
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        color: 'var(--saffron)', 
                                        fontWeight: '900',
                                        animation: 'scaleIn 0.4s var(--ease-heavy)'
                                    }}>
                                        <ShoppingBag size={18} strokeWidth={2.5} />
                                        <span style={{ fontSize: '18px' }}>{getItemCount(item.name)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .reveal-elite { opacity: 0; transform: translateY(40px); transition: all 1.2s var(--ease-heavy); }
                .reveal-elite-active { opacity: 1; transform: translateY(0); }
                
                .elite-card:hover {
                    transform: translateY(-20px);
                    box-shadow: 0 40px 100px rgba(10, 34, 22, 0.08);
                    border-color: rgba(226, 167, 63, 0.3);
                }
                
                .elite-card:hover .card-img-elite {
                    transform: scale(1.1) rotate(1deg);
                }
                
                .add-btn-elite:hover {
                    background: var(--emerald);
                    color: var(--ivory);
                    box-shadow: 0 15px 35px rgba(10, 34, 22, 0.2);
                }
                
                .category-btn-elite:not(.active):hover {
                    color: var(--saffron) !important;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .menu-grid-elite { 
                        grid-template-columns: 1fr !important; 
                        gap: 24px !important;
                        margin: 40px auto !important;
                    }
                    .card-body-elite { padding: 24px !important; }
                    .card-actions-elite { flex-direction: column; align-items: stretch !important; gap: 16px; }
                    .add-btn-elite { justify-content: center !important; }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
