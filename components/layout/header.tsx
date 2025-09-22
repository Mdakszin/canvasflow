import React from 'react';
import Link from 'next/link';

const header: React.FC = () => (
    <header style={{ padding: '1rem', background: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>CanvasFlow</div>
        <nav>
            <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
            <Link href="/about" style={{ marginRight: '1rem' }}>About</Link>
            <Link href="/contact">Contact</Link>
        </nav>
    </header>
);

export default header;