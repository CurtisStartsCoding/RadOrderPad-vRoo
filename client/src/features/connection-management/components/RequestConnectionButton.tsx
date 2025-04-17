/**
 * RequestConnectionButton Component
 * 
 * A button to open the request connection modal.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface RequestConnectionButtonProps {
  onClick: () => void;
}

export const RequestConnectionButton: React.FC<RequestConnectionButtonProps> = ({
  onClick
}) => {
  return (
    <Button onClick={onClick} className="flex items-center gap-2">
      <PlusCircle className="h-4 w-4" />
      <span>Request Connection</span>
    </Button>
  );
};