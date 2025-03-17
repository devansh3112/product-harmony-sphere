// This declares the modules that TypeScript can't find
declare module 'react';
declare module 'react-router-dom';
declare module 'lucide-react';

// Fix for Badge component props
interface BadgeProps {
  variant?: string;
  className?: string;
  key?: any;
  children?: React.ReactNode;
}

// Fix for CommandDialog props
interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

// Additional components that might cause TypeScript errors
interface TooltipProps {
  children?: React.ReactNode;
}

interface TooltipTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

interface TooltipContentProps {
  children?: React.ReactNode;
}

interface TooltipProviderProps {
  key?: any;
  children?: React.ReactNode;
}

// Define React.ReactNode if needed
declare namespace React {
  type ReactNode = any;
} 