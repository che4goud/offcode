import React, { useCallback, useRef } from 'react';

/**
 * Drag handle that calls onResize(delta) on mousemove.
 * direction: 'horizontal' | 'vertical'
 */
export default function Resizer({ direction, onResize }) {
    const dragging = useRef(false);
    const last = useRef(0);

    const onMouseDown = useCallback((e) => {
        e.preventDefault();
        dragging.current = true;
        last.current = direction === 'horizontal' ? e.clientX : e.clientY;

        const onMove = (e) => {
            if (!dragging.current) return;
            const pos = direction === 'horizontal' ? e.clientX : e.clientY;
            onResize(pos - last.current);
            last.current = pos;
        };

        const onUp = () => {
            dragging.current = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [direction, onResize]);

    const isH = direction === 'horizontal';

    return (
        <div
            onMouseDown={onMouseDown}
            style={{
                flexShrink: 0,
                width: isH ? '8px' : '100%',
                height: isH ? '100%' : '8px',
                cursor: isH ? 'col-resize' : 'row-resize',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
            }}
        >
            {/* Visual indicator dots */}
            <div style={{
                width: isH ? '3px' : '32px',
                height: isH ? '32px' : '3px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.1)',
                transition: 'background 0.15s',
            }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.5)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            />
        </div>
    );
}
