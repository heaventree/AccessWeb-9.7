import React, { useEffect, useState } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

type StrengthLevel = 'none' | 'weak' | 'medium' | 'strong' | 'very-strong';

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState<StrengthLevel>('none');
  const [message, setMessage] = useState('');

  useEffect(() => {
    calculateStrength(password);
  }, [password]);

  const calculateStrength = (password: string) => {
    if (!password) {
      setStrength('none');
      setMessage('');
      return;
    }

    // Scoring system
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Common patterns check (deduct points)
    if (/^[A-Za-z]+$/.test(password)) score -= 1; // Letters only
    if (/^[0-9]+$/.test(password)) score -= 1; // Numbers only
    if (/password/i.test(password)) score -= 2; // Contains "password"
    if (/12345|qwerty|asdfg/i.test(password)) score -= 2; // Common sequences
    
    // Ensure score is at least 0
    score = Math.max(0, score);
    
    // Determine strength level based on score
    let strengthLevel: StrengthLevel;
    let msg = '';
    
    if (score <= 1) {
      strengthLevel = 'weak';
      msg = 'Weak: Add length and complexity';
    } else if (score <= 3) {
      strengthLevel = 'medium';
      msg = 'Medium: Consider adding more complexity';
    } else if (score <= 5) {
      strengthLevel = 'strong';
      msg = 'Strong: Good password strength';
    } else {
      strengthLevel = 'very-strong';
      msg = 'Very Strong: Excellent password';
    }
    
    setStrength(strengthLevel);
    setMessage(msg);
  };

  const getColorClass = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      case 'very-strong':
        return 'bg-green-600';
      default:
        return 'bg-gray-200';
    }
  };

  const getWidthClass = () => {
    switch (strength) {
      case 'weak':
        return 'w-1/4';
      case 'medium':
        return 'w-2/4';
      case 'strong':
        return 'w-3/4';
      case 'very-strong':
        return 'w-full';
      default:
        return 'w-0';
    }
  };

  if (strength === 'none') {
    return null;
  }

  return (
    <div className="mt-1 mb-4">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100">
              Password Strength
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-gray-600">
              {message}
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ transition: 'width 0.5s ease' }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getColorClass()} ${getWidthClass()}`}
          ></div>
        </div>
      </div>
    </div>
  );
}