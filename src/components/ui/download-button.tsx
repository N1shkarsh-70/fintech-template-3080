import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  onDownload: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  onDownload,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold shadow-lg';
      case 'secondary':
        return 'border-2 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20 font-medium';
      case 'subtle':
        return 'text-muted-foreground hover:text-foreground border border-border hover:bg-muted font-normal';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-xs';
      case 'md':
        return 'h-10 px-4 text-sm';
      case 'lg':
        return 'h-12 px-6 text-base';
    }
  };

  return (
    <Button
      onClick={onDownload}
      disabled={disabled}
      className={cn(
        'inline-flex items-center transition-all duration-200',
        getVariantStyles(),
        getSizeStyles(),
        className
      )}
    >
      <Download className={cn(
        'mr-2',
        size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
      )} />
      {children}
    </Button>
  );
};