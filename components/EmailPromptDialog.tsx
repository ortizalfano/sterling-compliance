import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface EmailPromptDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export function EmailPromptDialog({ open, onClose, onSubmit }: EmailPromptDialogProps) {
  const [email, setEmail] = useState('');
  
  console.log('🚨🚨🚨 EMAIL PROMPT DIALOG RENDERED - NEW FILE');

  const handleSubmit = () => {
    if (!email.trim()) {
      alert('Please enter your email address.');
      return;
    }
    
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    
    console.log('🚨🚨🚨 EMAIL SUBMITTED FROM NEW DIALOG:', email);
    onSubmit(email.trim());
    setEmail('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 sm:p-6 mx-2 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
            Request Refund - NEW COMPONENT
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Please provide your email address so we can send you the refund confirmation. Refunds typically take 3-5 business days to appear on your statement.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-2">
          <Label htmlFor="user-email-new" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Email Address *
          </Label>
          <Input
            id="user-email-new"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
            autoFocus
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We'll send the refund confirmation to this email address.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 sm:h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 font-medium rounded-lg text-sm sm:text-base order-2 sm:order-1 transition-all duration-200 focus-ring"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 h-11 sm:h-12 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium rounded-lg text-sm sm:text-base order-1 sm:order-2 transition-all duration-200 shadow-sm hover:shadow-md focus-ring"
          >
            Submit Refund Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
