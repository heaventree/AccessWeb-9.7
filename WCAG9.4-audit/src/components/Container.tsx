import React, { ReactNode, useRef, useEffect } from 'react';
import { useContainerId } from '../contexts/ContainerIdContext';

// Maintain a global counter for container IDs
let containerCounter = 0;

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Container({ children, className = '', id, ...props }: ContainerProps) {
  const { showContainerId } = useContainerId();
  const idRef = useRef<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only assign a new ID if it hasn't been assigned yet
  if (idRef.current === -1) {
    idRef.current = ++containerCounter;
  }

  useEffect(() => {
    if (showContainerId && containerRef.current) {
      if (!containerRef.current.querySelector('.container-id-badge')) {
        const badge = document.createElement('div');
        badge.className = 'container-id-badge';
        badge.textContent = idRef.current.toString();
        badge.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(2, 132, 254, 0.85);
          color: white;
          padding: 2px 6px;
          border-radius: 0 0 4px 0;
          font-size: 12px;
          font-weight: bold;
          z-index: 9999;
          pointer-events: none;
        `;
        containerRef.current.appendChild(badge);
        containerRef.current.style.position = 'relative';
      }
    } else if (containerRef.current) {
      const badge = containerRef.current.querySelector('.container-id-badge');
      if (badge) {
        badge.remove();
      }
    }
  }, [showContainerId]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`${className} ${showContainerId ? 'container-with-id' : ''}`}
      data-container-id={idRef.current}
      {...props}
    >
      {children}
    </div>
  );
}