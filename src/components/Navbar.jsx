import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const leftLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' }
];

const baseRightLinks = [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
];

const drawerCopy = '\u00A9 2026 Kaapi Katte \u00B7 Pure Veg \u00B7 Bengaluru';

export default function Navbar() {
    const [scrollY, setScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { cart, isChef } = useCart();

    const itemsInCart = cart.reduce((sum, item) => sum + item.count, 0);
    const isScrolled = scrollY > 20;
    const rightLinks = isChef
        ? [
            { name: 'Dashboard', path: '/admin-lounge' },
            { name: 'Kitchen', path: '/kitchen' },
            ...baseRightLinks
        ]
        : baseRightLinks;

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.classList.toggle('nav-open', mobileMenuOpen);

        return () => document.body.classList.remove('nav-open');
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (!mobileMenuOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen]);

    const allLinks = [...leftLinks, ...rightLinks];
    const cartAriaLabel = itemsInCart > 0 ? `Open cart with ${itemsInCart} item${itemsInCart === 1 ? '' : 's'}` : 'Open cart';

    const getLinkClassName = (path, isDrawerLink = false) => {
        const baseClass = isDrawerLink ? 'site-navbar__drawer-link' : 'site-navbar__link';
        return location.pathname === path ? `${baseClass} is-active` : baseClass;
    };

    return (
        <header className={`site-navbar${isScrolled ? ' site-navbar--scrolled' : ''}`}>
            <nav className="site-navbar__inner" aria-label="Primary">
                <div className="site-navbar__desktop site-navbar__desktop--left">
                    {leftLinks.map((link) => (
                        <Link key={link.name} to={link.path} className={getLinkClassName(link.path)}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                <button
                    type="button"
                    className="site-navbar__icon-button site-navbar__menu-toggle"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="site-navbar-drawer"
                >
                    {mobileMenuOpen ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
                </button>

                <Link to="/" className="site-navbar__logo-link" aria-label="Kaapi Katte home">
                    <span className="site-navbar__logo-shell">
                        <img src="/logo.png" alt="Kaapi Katte logo" className="site-navbar__logo" />
                    </span>
                </Link>

                <div className="site-navbar__desktop site-navbar__desktop--right">
                    <div className="site-navbar__desktop-links">
                        {rightLinks.map((link) => (
                            <Link key={link.name} to={link.path} className={getLinkClassName(link.path)}>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <Link to="/checkout" className="site-navbar__cart-link" aria-label={cartAriaLabel}>
                        <ShoppingBag size={16} strokeWidth={2.2} />
                        <span className="site-navbar__cart-text">Cart</span>
                        {itemsInCart > 0 && <span className="site-navbar__cart-count">{itemsInCart}</span>}
                    </Link>
                </div>

                <Link
                    to="/checkout"
                    className="site-navbar__cart-link site-navbar__cart-link--mobile"
                    aria-label={cartAriaLabel}
                >
                    <ShoppingBag size={18} strokeWidth={2.2} />
                    <span className="site-navbar__cart-text">Cart</span>
                    {itemsInCart > 0 && <span className="site-navbar__cart-count">{itemsInCart}</span>}
                </Link>
            </nav>

            <aside
                id="site-navbar-drawer"
                className={`site-navbar__drawer${mobileMenuOpen ? ' is-open' : ''}`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="site-navbar__drawer-header">
                    <div className="site-navbar__drawer-brand">
                        <span className="site-navbar__drawer-logo-shell">
                            <img src="/logo.png" alt="" className="site-navbar__logo" />
                        </span>

                        <div>
                            <p className="site-navbar__drawer-title">Kaapi Katte</p>
                            <p className="site-navbar__drawer-subtitle">Pure vegetarian South Indian dining</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="site-navbar__icon-button site-navbar__drawer-close"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close navigation menu"
                    >
                        <X size={20} strokeWidth={2.2} />
                    </button>
                </div>

                <div className="site-navbar__drawer-links">
                    {allLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={getLinkClassName(link.path, true)}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="site-navbar__drawer-footer">
                    <Link
                        to="/checkout"
                        className="site-navbar__cart-link site-navbar__drawer-cart"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label={cartAriaLabel}
                    >
                        <ShoppingBag size={16} strokeWidth={2.2} />
                        <span className="site-navbar__cart-text">View cart</span>
                        {itemsInCart > 0 && <span className="site-navbar__cart-count">{itemsInCart}</span>}
                    </Link>

                    <p className="site-navbar__drawer-copy">{drawerCopy}</p>
                </div>
            </aside>

            <button
                type="button"
                className={`site-navbar__backdrop${mobileMenuOpen ? ' is-open' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu overlay"
            />
        </header>
    );
}
