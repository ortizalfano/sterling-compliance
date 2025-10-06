import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Phone, Mail, MessageCircle } from "lucide-react";

interface ContactDialogProps {
  children: React.ReactNode;
}

export function ContactDialog({ children }: ContactDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
            Contact Us
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Have any questions or concerns? We're here to help!
          </div>
          
          <div className="space-y-4">
            {/* Phone Contact */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Call Us</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Speak directly with our team</div>
                </div>
              </div>
              <a 
                href="tel:+18555998052"
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium transition-colors duration-200"
              >
                +1 (855) 599-8052
              </a>
            </div>

            {/* Message Contact */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Send Message</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Text us directly</div>
                </div>
              </div>
              <a 
                href="sms:+18555998052"
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium transition-colors duration-200"
              >
                Message
              </a>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-500">
            Available Monday - Friday, 9:00 AM - 6:00 PM EST
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
