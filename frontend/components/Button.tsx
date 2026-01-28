import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  className = ''
}) => {
  const getBaseStyle = () => "w-full rounded-lg py-4 items-center justify-center flex-row";
  
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary': return "bg-red-500 active:bg-red-600";
      case 'secondary': return "bg-gray-200 active:bg-gray-300";
      case 'outline': return "bg-transparent border border-red-500";
      default: return "bg-red-500";
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary': return "text-white font-bold text-lg";
      case 'secondary': return "text-gray-800 font-bold text-lg";
      case 'outline': return "text-red-500 font-bold text-lg";
      default: return "text-white font-bold text-lg";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      className={`${getBaseStyle()} ${getVariantStyle()} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#ef4444' : 'white'} />
      ) : (
        <Text className={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
