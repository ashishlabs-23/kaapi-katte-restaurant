import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Coffee, Utensils, Award } from 'lucide-react';
import { menuData, featuredDishes } from '../data/menuData';

export default function Home() {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-elite-active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.reveal-elite');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    /**
     * DESIGN ANALYSIS: The Cinematic Hero
     * We use a "Masked Overlay" effect where the typography feels carved into the scene.
     * The Ken Burns effect on the video provides constant micro-motion, keeping the user engaged.
     */
    return (
        <div style={{ background: 'var(--ivory)', color: 'var(--emerald)' }}>
            {/* ── EPIC HERO SECTION ── */}
            <section style={{
                height: "100vh", position: "relative", display: "flex",
                alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden",
            }}>
                <video className="ken-burns" autoPlay loop muted playsInline style={{
                    position: "absolute", inset: 0, zIndex: 0,
                    width: "100%", height: "100%", objectFit: "cover",
                    filter: 'contrast(1.1) brightness(0.8)'
                }}>
                    <source src="/video.mp4" type="video/mp4" />
                </video>

                {/* Aesthetic Gradient Overlay */}
                <div style={{
                    position: "absolute", inset: 0, zIndex: 1,
                    background: "radial-gradient(circle at center, rgba(10,34,22,0.2) 0%, rgba(10,34,22,0.6) 100%)"
                }} />

                <div style={{ position: "relative", zIndex: 2, padding: "0 20px" }} className="reveal-elite">
                    <div style={{ 
                        fontStyle: "italic", fontSize: "clamp(12px, 1.5vw, 16px)", 
                        letterSpacing: "0.6em", color: "var(--saffron)", 
                        marginBottom: "32px", fontWeight: "600",
                        textTransform: "uppercase" 
                    }}>
                        EST. 2024 • BENGALURU
                    </div>
                    <h1 style={{
                        fontSize: "clamp(56px, 12vw, 180px)", color: "#FFF", margin: 0, lineHeight: 0.85,
                        textTransform: "uppercase", letterSpacing: "-0.04em", fontWeight: "900",
                        textShadow: "0 20px 80px rgba(0,0,0,0.4)",
                        fontFamily: "'Playfair Display', serif"
                    }}>Kaapi<br /><span style={{ color: 'var(--saffron)' }}>Katte</span></h1>
                    
                    <p style={{
                        fontSize: "clamp(15px, 1.6vw, 22px)", color: "#F5F2EB", maxWidth: "700px",
                        margin: "32px auto 48px", lineHeight: 1.6, fontWeight: "400", opacity: 0.9,
                        letterSpacing: "0.02em"
                    }}>
                        A curated journey through the ancestral kitchens of South India. 
                    </p>

                    <button 
                        onClick={() => navigate('/menu')} 
                        style={{
                            padding: "20px 48px", background: "var(--saffron)", color: "var(--emerald)",
                            border: "none", borderRadius: "1px", fontSize: "11px", fontWeight: "900",
                            letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer",
                            transition: "all 0.8s var(--ease-heavy)",
                            boxShadow: "0 15px 45px rgba(226, 167, 63, 0.3)"
                        }} 
                        className="hero-btn-elite"
                    >
                        Explore the Menu
                    </button>
                </div>

                {/* Deluxe Scroll Indicator */}
                <div style={{
                    position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
                }}>
                    <div style={{ width: '2px', height: '60px', background: 'linear-gradient(to bottom, var(--saffron), transparent)' }} className="scroll-bar-anim" />
                    <span style={{ color: 'var(--ivory)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.6 }}>Scroll</span>
                </div>
            </section>

            {/* ── THE SOUL SECTION ── */}
            <section style={{ padding: "160px 20px", background: "var(--ivory)", position: 'relative' }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="reveal-elite">
                        <Utensils color="var(--saffron)" size={48} strokeWidth={1} style={{ marginBottom: "40px" }} />
                        <h2 style={{ fontSize: "clamp(40px, 5vw, 64px)", color: "var(--emerald)", marginBottom: "40px", lineHeight: 1.1, fontStyle: 'italic' }}>
                            The Sanctity of <br />Traditional Fermentation
                        </h2>
                        <p style={{ fontSize: "20px", color: "#4A5A4E", lineHeight: 1.9, marginBottom: "40px" }}>
                            Inspired by the timeless idli-homes of Old Bangalore, we maintain the strict 
                            tradition of slow-fermented batters and hand-ground spices. Our kitchen is 
                            a living museum of South Indian culinary mastery.
                        </p>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <div>
                                <div style={{ fontSize: '32px', color: 'var(--saffron)', fontWeight: '900' }}>14h</div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6 }}>Slow Ferment</div>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: 'rgba(10,34,22,0.1)' }} />
                            <div>
                                <div style={{ fontSize: '32px', color: 'var(--saffron)', fontWeight: '900' }}>100%</div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6 }}>Cold Pressed Ghee</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Visual Anchor */}
                    <div style={{ position: 'relative' }} className="reveal-elite">
                        <div style={{ 
                            aspectRatio: '1/1.2', background: '#e5e5e5', borderRadius: '2px', overflow: 'hidden',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.08)' 
                        }}>
                             <img 
                                src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                                alt="Tradition" 
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }} 
                                className="ken-burns" 
                            />
                        </div>
                        <div style={{ 
                            position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px',
                            background: 'var(--saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--emerald)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                            transform: 'rotate(-10deg)', boxShadow: '0 20px 40px rgba(226, 167, 63, 0.4)'
                        }}>
                            <Coffee size={60} strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── THE QUALITY PLEDGE ── */}
            <section style={{ background: "var(--emerald)", padding: "180px 20px", color: "var(--ivory)", textAlign: "center", position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }}>
                    {/* SVG Pattern Placeholder - adds texture */}
                    <div style={{ width: '100%', height: '100%', background: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
                </div>
                
                <div className="reveal-elite" style={{ position: 'relative', zIndex: 1 }}>
                    <Award color="var(--saffron)" size={56} strokeWidth={1} style={{ marginBottom: "40px" }} />
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontStyle: "italic", marginBottom: "32px", color: "var(--ivory)" }}>Elegance in Every Ingredient</h2>
                    <p style={{ maxWidth: "750px", margin: "0 auto", fontSize: "18px", opacity: 0.8, lineHeight: 2, fontWeight: '400' }}>
                        At Kaapi Katte, quality is not a goal; it's our baseline. From the selection of Peaberry beans 
                        to the purity of our A2 milk, we curate only the exceptional. We don't just serve food; 
                        we serve the highest honour of our culture.
                    </p>
                    <div style={{ marginTop: '60px', height: '1px', width: '200px', background: 'var(--saffron)', margin: '60px auto' }} />
                </div>
            </section>

            <style>{`
                .reveal-elite {
                    opacity: 0;
                    transform: translateY(60px);
                    transition: all 1.2s var(--ease-heavy);
                }
                .reveal-elite-active {
                    opacity: 1;
                    transform: translateY(0);
                }
                .ken-burns {
                    animation: kenBurnsAnimation 30s infinite alternate linear;
                }
                @keyframes kenBurnsAnimation {
                    from { transform: scale(1) rotate(0deg); }
                    to { transform: scale(1.15) rotate(2deg); }
                }
                .hero-btn-elite:hover {
                    background: var(--ivory);
                    color: var(--emerald);
                    transform: translateY(-8px);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.2) !important;
                }
                .scroll-bar-anim {
                    animation: scrollAnim 2s infinite var(--ease-heavy);
                }
                @keyframes scrollAnim {
                    0% { transform: scaleY(0); transform-origin: top; }
                    50% { transform: scaleY(1); transform-origin: top; }
                    51% { transform: scaleY(1); transform-origin: bottom; }
                    100% { transform: scaleY(0); transform-origin: bottom; }
                }
                h1, h2, h3, h4 { font-weight: 900; }
            `}</style>
        </div>
    );
}

