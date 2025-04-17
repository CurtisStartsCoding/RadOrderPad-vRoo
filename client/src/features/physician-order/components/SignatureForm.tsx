import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { OrderData } from "../types";

/**
 * SignatureForm Component
 * 
 * Provides an interface for physicians to sign orders.
 * Includes a signature pad and buttons to clear, sign, or go back.
 */
interface SignatureFormProps {
  /** Order data */
  orderData: OrderData;
  
  /** Whether the order is being submitted */
  isSubmitting: boolean;
  
  /** Function to handle going back to validation */
  onBackToValidation: () => void;
  
  /** Function to handle signing the order */
  onSignOrder: (signatureData: string) => void;
}

export const SignatureForm: React.FC<SignatureFormProps> = ({
  orderData,
  isSubmitting,
  onBackToValidation,
  onSignOrder
}) => {
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State to track if the signature pad has been used
  const [hasSignature, setHasSignature] = useState(false);
  
  // State to track if the user is currently drawing
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Initialize the signature pad
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set line style
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Start a new path
    context.beginPath();
    context.moveTo(x, y);
  };
  
  // Handle mouse move event
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Draw a line to the current position
    context.lineTo(x, y);
    context.stroke();
  };
  
  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  
  // Handle mouse leave event
  const handleMouseLeave = () => {
    setIsDrawing(false);
  };
  
  // Handle touch start event
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    
    // Get touch position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    
    // Check if touch exists
    if (!touch) return;
    
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Start a new path
    context.beginPath();
    context.moveTo(x, y);
  };
  
  // Handle touch move event
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Get touch position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    
    // Check if touch exists
    if (!touch) return;
    
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Draw a line to the current position
    context.lineTo(x, y);
    context.stroke();
  };
  
  // Handle touch end event
  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };
  
  // Clear the signature pad
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };
  
  // Submit the signature
  const submitSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert the canvas to a data URL
    const signatureData = canvas.toDataURL('image/png');
    
    // Call the onSignOrder function with the signature data
    onSignOrder(signatureData);
  };
  
  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Patient</p>
            <p className="text-sm font-medium">{orderData.patient.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">DOB</p>
            <p className="text-sm font-medium">{orderData.patient.dob}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Modality</p>
            <p className="text-sm font-medium">{orderData.modality}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Body Part</p>
            <p className="text-sm font-medium">{orderData.bodyPart}</p>
          </div>
        </div>
      </Card>
      
      {/* Signature Pad */}
      <Card className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Signature</h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Please sign below to confirm this order.
          </p>
          
          <div className="border border-gray-300 rounded-md p-1">
            <canvas
              ref={canvasRef}
              className="w-full h-40 bg-white cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!hasSignature || isSubmitting}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBackToValidation}
          disabled={isSubmitting}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Validation
        </Button>
        
        <Button
          variant="default"
          onClick={submitSignature}
          disabled={!hasSignature || isSubmitting}
          className="flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Sign & Submit Order
              <Check className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};