import React from 'react';
import { useCart } from '../context/CartContext';
import './Footer.css';

const kannadaBrand = '\u0C95\u0CBE\u0CAA\u0CBF \u0C95\u0C9F\u0CCD\u0C9F\u0CC6';
const legalCopy = '\u00A9 2026 Kaapi Katte \u00B7 Pure Veg \u00B7 Bengaluru';

export default function Footer() {
    const { isChef, toggleChefMode } = useCart();

    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                <div className="site-footer__brand-block">
                    <p className="site-footer__brand">Kaapi Katte</p>
                    <p className="site-footer__script">{kannadaBrand}</p>
                </div>

                <button
                    type="button"
                    onClick={toggleChefMode}
                    className={`site-footer__staff-toggle${isChef ? ' is-active' : ''}`}
                >
                    {isChef ? 'Exit Staff Mode' : 'Staff Login'}
                </button>

                <p className="site-footer__copy">{legalCopy}</p>
            </div>
        </footer>
    );
}
