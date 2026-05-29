import React from 'react';
import { cn } from '@/lib/utils';

interface CustomButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive';
    className?: string;
    disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    children,
    onClick,
    icon,
    variant = 'default',
    className = '',
    disabled = false,
}) => {
    const baseStyles = variant === 'destructive'
        ? 'bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
        : 'bg-gradient-to-br from-blue-500 via-blue-500 to-orange-500 hover:from-blue-600 hover:to-blue-600';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative cursor-pointer py-3 px-6 text-center inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide rounded-xl transition-all duration-300 ease-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-4 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105 active:scale-95",
                baseStyles,
                variant === 'destructive' ? 'text-white' : 'text-foreground',
                disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
                className
            )}
        >
            {/* Text and Icon */}
            <span className="relative z-20 flex items-center gap-2 drop-shadow-sm">
                {icon && icon}
                {children}
            </span>

            {/* Shine Effect */}
            <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-[rgba(21,32,43,0.8)]/30 rotate-12 z-10 blur-md group-hover:left-[125%] transition-all duration-700 ease-out"></span>

            {/* Animated Glow Border */}
            <span className="absolute inset-0 rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></span>

            {/* Corner Accents */}
            <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/40 rounded-tl-xl transition-all duration-300 group-hover:w-12 group-hover:h-12"></span>
            <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/40 rounded-br-xl transition-all duration-300 group-hover:w-12 group-hover:h-12"></span>
        </button>
    );
};

export default CustomButton;
