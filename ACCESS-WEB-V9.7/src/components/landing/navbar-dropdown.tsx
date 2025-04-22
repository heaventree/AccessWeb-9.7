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
    <div className="dropdown-item flex flex-col hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/20 cursor-pointer py-3 px-3.5 rounded-lg transition-all duration-200" 
         onClick={() => window.location.href = href}>
      <div className="flex items-center mb-1.5">
        <div className="dropdown-icon w-5 h-5 flex items-center justify-center mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0">
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <span className="font-medium text-[15px] text-gray-800 dark:text-white leading-none">{label}</span>
      </div>
      <div className="dropdown-description text-[13px] text-gray-500 dark:text-[#5eead4] whitespace-nowrap text-ellipsis overflow-hidden pl-8 leading-relaxed opacity-80">
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
            <div className="dropdown-menu bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 w-[320px] p-2.5 space-y-0.5" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.98)',
                   backdropFilter: 'blur(16px)', 
                   boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.07)'
                 }}>
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