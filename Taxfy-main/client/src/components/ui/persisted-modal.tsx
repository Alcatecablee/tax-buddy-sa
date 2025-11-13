import React, { useState, useEffect, ReactNode } from 'react';

interface PersistedModalProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  minDisplayTime?: number; // Minimum time to keep modal visible (ms)
  onClose?: () => void;
}

export const PersistedModal: React.FC<PersistedModalProps> = ({ 
  isOpen, 
  children, 
  className = "",
  minDisplayTime = 500,
  onClose 
}) => {
  const [visible, setVisible] = useState(false);
  const [openTime, setOpenTime] = useState<number | null>(null);

  useEffect(() => {
    console.log("🔄 PersistedModal state change - isOpen:", isOpen, "visible:", visible);
    
    let timer: NodeJS.Timeout;
    
    if (isOpen) {
      setVisible(true);
      setOpenTime(Date.now());
      console.log("🔄 Modal opened at:", Date.now());
    } else if (visible && openTime) {
      const elapsed = Date.now() - openTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      
      console.log("🔄 Modal close requested - elapsed:", elapsed, "remaining:", remainingTime);
      
      timer = setTimeout(() => {
        console.log("🔄 Modal actually closing after delay");
        setVisible(false);
        setOpenTime(null);
        if (onClose) onClose();
      }, remainingTime);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, visible, openTime, minDisplayTime, onClose]);

  if (!visible) {
    console.log("🔄 Modal not visible, returning null");
    return null;
  }

  console.log("🔄 Modal rendering with children");
  return (
    <div className={`persisted-modal ${className}`}>
      {children}
    </div>
  );
};

interface PersistedDropdownProps {
  isOpen: boolean;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  minDisplayTime?: number;
}

export const PersistedDropdown: React.FC<PersistedDropdownProps> = ({
  isOpen,
  children,
  onOpenChange,
  minDisplayTime = 300
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [openTime, setOpenTime] = useState<number | null>(null);

  useEffect(() => {
    console.log("🔽 PersistedDropdown state change - isOpen:", isOpen, "internalOpen:", internalOpen);
    
    let timer: NodeJS.Timeout;
    
    if (isOpen && !internalOpen) {
      setInternalOpen(true);
      setOpenTime(Date.now());
      console.log("🔽 Dropdown opened at:", Date.now());
    } else if (!isOpen && internalOpen && openTime) {
      const elapsed = Date.now() - openTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      
      console.log("🔽 Dropdown close requested - elapsed:", elapsed, "remaining:", remainingTime);
      
      timer = setTimeout(() => {
        console.log("🔽 Dropdown actually closing after delay");
        setInternalOpen(false);
        setOpenTime(null);
        if (onOpenChange) onOpenChange(false);
      }, remainingTime);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, internalOpen, openTime, minDisplayTime, onOpenChange]);

  return React.cloneElement(children as React.ReactElement, {
    open: internalOpen,
    onOpenChange: (open: boolean) => {
      console.log("🔽 Dropdown onOpenChange called with:", open);
      if (onOpenChange) onOpenChange(open);
    }
  });
}; 