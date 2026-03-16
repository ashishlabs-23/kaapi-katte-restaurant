import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const [scrollY, setScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { cart, isChef } = useCart();
    const itemsInCart = cart.reduce((sum, item) => sum + item.count, 0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isScrolled = scrollY > 20;

    /**
     * DESIGN ANALYSIS: The Centered Navigation Stack
     * To maintain the "Temple" aesthetic, symmetry is key. 
     * We distribute primary navigation on the left and utility/story on the right.
     * The logo acts as the "Sanctum" - the focal point of the brand.
     */
    const leftLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' }
    ];

    const rightLinks = [
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    if (isChef) {
        // Staff links are tucked into the utility side to preserve the sacred symmetry for customers
        rightLinks.unshift({ name: 'Kitchen', path: '/kitchen' });
        rightLinks.unshift({ name: 'Dashboard', path: '/admin-lounge' });
    }

    return (
        <nav style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            zIndex: 1000,
            /* Glassmorphism: Making the header feel like a floating piece of polished ivory */
            background: isScrolled ? 'rgba(250, 249, 246, 0.85)' : 'transparent',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: isScrolled ? '1px solid rgba(10, 34, 22, 0.05)' : '1px solid transparent',
            transition: 'all 0.8s var(--ease-heavy)',
            height: isScrolled ? '80px' : '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 60px'
        }}>
            <div className="navbar-grid" style={{
                maxWidth: '1400px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center'
            }}>
                {/* Left Side: Discovery */}
                <div className="left-links-desktop" style={{ display: 'flex', gap: '48px', justifyContent: 'flex-start' }}>
                    {leftLinks.map(link => (
                        <Link 
                            key={link.name} 
                            to={link.path} 
                            style={{
                                textDecoration: 'none',
                                color: location.pathname === link.path ? 'var(--saffron)' : 'var(--emerald)',
                                fontSize: '12px',
                                fontWeight: '700',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                transition: 'all 0.4s var(--ease-heavy)',
                                position: 'relative'
                            }}
                            className="nav-link-elite"
                        >
                            {link.name}
                            <span className="nav-line-reveal" />
                        </Link>
                    ))}
                </div>

                {/* The Sanctum: Centered Logo */}
                <Link to="/" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
                    <div style={{ 
                        width: isScrolled ? '64px' : '96px', 
                        height: isScrolled ? '64px' : '96px',
                        transition: 'all 1s var(--ease-heavy)',
                        background: '#FFF',
                        borderRadius: '50%',
                        padding: '12px',
                        boxShadow: isScrolled ? '0 12px 30px rgba(0,0,0,0.08)' : '0 25px 60px rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: isScrolled ? '1px solid rgba(226, 167, 63, 0.2)' : '1px solid rgba(0,0,0,0.02)'
                    }} className="logo-sanctum">
                        <img src="/logo.png" alt="Kaapi Katte Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                </Link>

                {/* Right Side: Utility & Cart */}
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div className="desktop-links" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        {rightLinks.map(link => (
                            <Link 
                                key={link.name} 
                                to={link.path} 
                                style={{
                                    textDecoration: 'none',
                                    color: location.pathname === link.path ? 'var(--saffron)' : 'var(--emerald)',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.4s var(--ease-heavy)',
                                    position: 'relative'
                                }}
                                className="nav-link-elite"
                            >
                                {link.name}
                                <span className="nav-line-reveal" />
                            </Link>
                        ))}
                    </div>

                    <Link to="/checkout" style={{
                        textDecoration: 'none',
                        background: 'var(--emerald)',
                        color: 'var(--ivory)',
                        padding: '12px 28px',
                        borderRadius: '1px',
                        fontSize: '11px',
                        fontWeight: '800',
                        letterSpacing: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.6s var(--ease-heavy)',
                        boxShadow: '0 10px 30px rgba(10, 34, 22, 0.15)'
                    }} className="cart-trigger-elite">
                        <ShoppingBag size={14} strokeWidth={2.5} />
                        <span style={{ transform: 'translateY(1px)' }}>
                            {itemsInCart > 0 ? `${itemsInCart} ITEMS` : 'CART'}
                        </span>
                    </Link>

                    {/* Mobile Menu Trigger */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            color: 'var(--emerald)',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                        className="mobile-trigger"
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                width: '300px',
                background: 'var(--ivory)',
                zIndex: 2000,
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.5s var(--ease-heavy)',
                boxShadow: '-10px 0 50px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                padding: '100px 40px',
                gap: '24px'
            }}>
                {[...leftLinks, ...rightLinks].map(link => (
                    <Link 
                        key={link.name} 
                        to={link.path} 
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            textDecoration: 'none',
                            color: location.pathname === link.path ? 'var(--saffron)' : 'var(--emerald)',
                            fontSize: '18px',
                            fontWeight: '900',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontStyle: 'italic'
                        }}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Backdrop */}
            {mobileMenuOpen && (
                <div 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(10, 34, 22, 0.4)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1999
                    }} 
                />
            )}
            
            <style>{`
                .nav-link-elite:hover {
                    color: var(--saffron) !important;
                    opacity: 0.8;
                }
                .nav-line-reveal {
                    position: absolute;
                    bottom: -8px;
                    left: 0;
                    width: 0;
                    height: 1px;
                    background: var(--saffron);
                    transition: width 0.6s var(--ease-heavy);
                }
                .nav-link-elite:hover .nav-line-reveal {
                    width: 100%;
                }
                .logo-sanctum:hover {
                    transform: scale(1.05) rotate(5deg);
                }
                .cart-trigger-elite:hover {
                    background: var(--saffron);
                    color: var(--emerald);
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(226, 167, 63, 0.25);
                }
                @media (max-width: 1024px) {
                    .nav-link-elite, .left-links-desktop, .desktop-links { display: none !important; }
                    .mobile-trigger { display: block !important; }
                    nav { padding: 0 24px; height: 72px !important; }
                    .logo-sanctum { width: 50px !important; height: 50px !important; }
                    .navbar-grid { grid-template-columns: 1fr auto 1fr !important; }
                }
                /* Utility classes for hidden elements */
                .left-links-desktop { display: flex; gap: 48px; justifyContent: flex-start; }
            `}</style>
        </nav>
    );
}

