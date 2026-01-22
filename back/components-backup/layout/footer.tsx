import React from 'react';
import Link from 'next/link';

const sitemapLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
];

export default function footer() {
    return (
        <footer style={{ padding: '2rem 0', textAlign: 'center', background: '#f8f8f8' }}>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'inline-flex', gap: '1.5rem' }}>
                    {sitemapLinks.map(link => (
                        <li key={link.href}>
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
                &copy; {new Date().getFullYear()} CanvasFlow. All rights reserved.
            </div>
        </footer>
    );
}