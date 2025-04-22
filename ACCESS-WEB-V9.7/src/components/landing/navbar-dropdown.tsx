import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle } from 'lucide-react';
import NavigationIcons from '../navigation/NavigationIconGuide';

interface DropdownItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  href: string;
}

interface DropdownProps {
  label: string;
  items: DropdownItemProps[];
}

const NavDropdownItem: React.FC<DropdownItemProps> = ({ icon: Icon, label, description, href }) => {
  return (
    <div className="dropdown-item" onClick={() => window.location.href = href}>
      <div className="flex items-center mb-1.5">
        <div className="dropdown-icon">
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <span className="dropdown-item-label">{label}</span>
      </div>
      <div className="dropdown-description">
        {description}
      </div>
    </div>
  );
};

export const NavDropdown: React.FC<DropdownProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-[15px] font-medium transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={`ml-1.5 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 z-50"
          >
            <div className="dropdown-menu">
              {items.map((item, index) => (
                <NavDropdownItem key={index} {...item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavDropdown;