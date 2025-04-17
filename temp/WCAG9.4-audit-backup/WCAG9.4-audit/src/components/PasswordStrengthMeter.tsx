import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const getStrength = () => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score++; // Uppercase
    if (/[0-9]/.test(password)) score++; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score++; // Special characters
    
    return score;
  };

  const strength = getStrength();
  
  const getLabel = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-emerald-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-600">Password Strength:</span>
        <span className={`text-sm font-medium ${strength > 2 ? 'text-green-600' : 'text-red-600'}`}>
          {getLabel()}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <ul className="mt-2 text-xs text-gray-500 space-y-1">
        <li className={password.length >= 8 ? 'text-green-600' : ''}>
          • Minimum 8 characters
        </li>
        <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
          • At least one uppercase letter
        </li>
        <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
          • At least one number
        </li>
        <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>
          • At least one special character
        </li>
      </ul>
    </div>
  );
}