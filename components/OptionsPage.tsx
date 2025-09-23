import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  ArrowLeft, 
  CheckCircle, 
  RefreshCw, 
  CreditCard, 
  Receipt, 
  Settings, 
  MessageSquare,
  Calendar,
  DollarSign,
  Mail
} from "lucide-react";

interface OptionsPageProps {
  purchaseData: any;
  onBack: () => void;
}

export function OptionsPage({ purchaseData, onBack }: OptionsPageProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const actions = [
    {
      id: "refund",
      title: "Request a Refund",
      description: "Get your money back for this transaction",
      icon: RefreshCw,
      color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
    },
    {
      id: "cancel",
      title: "Cancel or Reschedule Next Payment",
      description: "Modify your recurring subscription",
      icon: Calendar,
      color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
    },
    {
      id: "payment",
      title: "Update Payment Details",
      description: "Change your card or billing information",
      icon: CreditCard,
      color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    },
    {
      id: "receipt",
      title: "Get a Receipt",
      description: "Download or email your transaction receipt",
      icon: Receipt,
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
    },
    {
      id: "support",
      title: "Speak to a Representative",
      description: "Get personalized help from our support team",
      icon: MessageSquare,
      color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20",
    },
  ];

  const handleActionClick = (actionId: string) => {
    setSelectedAction(actionId);
    setShowConfirmation(true);
  };

  const getActionContent = (actionId: string) => {
    switch (actionId) {
      case "refund":
        return {
          title: "Request Refund",
          description: "We'll process your refund request and send you a confirmation email. Refunds typically take 3-5 business days to appear on your statement.",
          confirmText: "Submit Refund Request",
        };
      case "cancel":
        return {
          title: "Manage Subscription",
          description: "You can cancel your subscription or reschedule your next payment. Changes will take effect immediately.",
          confirmText: "Proceed to Subscription Management",
        };
      case "payment":
        return {
          title: "Update Payment Method",
          description: "You'll be redirected to a secure page where you can update your payment information.",
          confirmText: "Update Payment Details",
        };
      case "receipt":
        return {
          title: "Get Receipt",
          description: "We'll email you a detailed receipt for this transaction to your registered email address.",
          confirmText: "Send Receipt",
        };
      case "support":
        return {
          title: "Contact Support",
          description: "A support representative will contact you within 24 hours to assist with your inquiry.",
          confirmText: "Request Support Contact",
        };
      default:
        return { title: "", description: "", confirmText: "" };
    }
  };

  const selectedActionContent = selectedAction ? getActionContent(selectedAction) : null;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-grid max-w-6xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 hover:bg-accent transition-smooth focus-ring"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Search again
        </Button>

        {/* Success header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-2">
            We found your purchase
          </h1>
          <p className="text-lg text-muted-foreground">
            Select what you'd like to do next
          </p>
        </div>

        {/* Transaction summary */}
        <Card className="mb-12 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{purchaseData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Card ending in</p>
                  <p className="font-medium">•••• {purchaseData.lastFour}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{purchaseData.amount}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(purchaseData.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Merchant</p>
                <p className="font-medium">{purchaseData.merchant}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-sm">{purchaseData.transactionId}</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                  {purchaseData.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action) => (
            <Card
              key={action.id}
              className="group cursor-pointer hover:shadow-hover transition-all duration-300 hover:-translate-y-1 shadow-soft"
              onClick={() => handleActionClick(action.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`h-16 w-16 rounded-xl flex items-center justify-center transition-colors ${action.color}`}>
                    <action.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 sm:p-6 mx-2 sm:mx-0">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                {selectedActionContent?.title}
              </DialogTitle>
              <DialogDescription className="pt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {selectedActionContent?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 h-11 sm:h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 font-medium rounded-lg text-sm sm:text-base order-2 sm:order-1 transition-all duration-200 focus-ring"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  // Handle the action here
                }}
                className="flex-1 h-11 sm:h-12 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium rounded-lg text-sm sm:text-base order-1 sm:order-2 transition-all duration-200 shadow-sm hover:shadow-md focus-ring"
              >
                {selectedActionContent?.confirmText}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Additional help */}
        <div className="mt-16 text-center">
          <div className="bg-muted/30 rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-4">
              Need something else?
            </h3>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help with any questions or concerns.
            </p>
            <Button variant="outline" className="focus-ring">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}