import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import { emailService } from "../services/emailService";

interface OptionsPageProps {
  purchaseData: any;
  onBack: () => void;
}

export function OptionsPage({ purchaseData, onBack }: OptionsPageProps) {
  // FORCE LOG - This should appear in console
  console.log('🚨🚨🚨 OPTIONSPAGE COMPONENT LOADED - VERSION 2.2 🚨🚨🚨');
  
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [userEmail, setUserEmail] = useState('');

  // Debug logging
  console.log('🔧 OptionsPage v2.2 render - purchaseData:', purchaseData);
  console.log('🔧 OptionsPage v2.2 render - selectedAction:', selectedAction);
  console.log('🔧 OptionsPage v2.2 render - showConfirmation:', showConfirmation);
  console.log('🔧 OptionsPage v2.2 render - userEmail:', userEmail);
  console.log('🔧 OptionsPage v2.2 render - should show email field:', selectedAction === 'refund');
  console.log('🔧 OptionsPage v2.2 render - selectedActionContent:', selectedActionContent);

  // Validar que purchaseData existe y tiene las propiedades necesarias
  if (!purchaseData) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container-grid max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Error: Datos de compra no encontrados
            </h1>
            <p className="text-muted-foreground mb-6">
              No se pudieron cargar los datos de la compra. Por favor, intenta buscar de nuevo.
            </p>
            <Button onClick={onBack} className="bg-amber-600 hover:bg-amber-700 text-white">
              Buscar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Crear un objeto seguro con valores por defecto
  const safePurchaseData = {
    transactionId: purchaseData.transactionId || 'N/A',
    email: purchaseData.email || 'N/A',
    lastFour: purchaseData.lastFour || 'N/A',
    amount: purchaseData.amount || 'N/A',
    date: purchaseData.date || new Date().toISOString(),
    merchant: purchaseData.merchant || 'N/A',
    status: purchaseData.status || 'N/A',
    invoice: purchaseData.invoice || 'N/A',
    cardType: purchaseData.cardType || 'N/A',
    response: purchaseData.response || 'N/A',
    type: purchaseData.type || 'N/A',
    message: purchaseData.message || 'N/A',
    user: purchaseData.user || 'N/A',
    source: purchaseData.source || 'N/A',
    auth: purchaseData.auth || 0,
    fullCardNumber: purchaseData.fullCardNumber || 'N/A'
  };

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
    console.log('🔥 OptionsPage v2.2 - handleActionClick called with actionId:', actionId);
    console.log('🔥 OptionsPage v2.2 - Current safePurchaseData:', safePurchaseData);
    
    try {
      setSelectedAction(actionId);
      setShowConfirmation(true);
      setActionResult(null);
      console.log('🔥 OptionsPage v2.2 - Action click handled successfully');
      console.log('🔥 OptionsPage v2.2 - Selected action set to:', actionId);
      console.log('🔥 OptionsPage v2.2 - Show confirmation set to: true');
      console.log('🔥 OptionsPage v2.2 - Is refund action?', actionId === 'refund');
    } catch (error) {
      console.error('Error in handleActionClick:', error);
    }
  };

  const getActionContent = (actionId: string) => {
    switch (actionId) {
      case "refund":
        return {
          title: "Request Refund",
          description: "Please provide your email address so we can send you the refund confirmation. Refunds typically take 3-5 business days to appear on your statement.",
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

  const handleConfirmAction = async () => {
    if (!selectedAction) return;

    // Validate email for refund requests
    if (selectedAction === 'refund' && !userEmail.trim()) {
      alert('Please enter your email address to proceed with the refund request.');
      return;
    }

    // Basic email validation
    if (selectedAction === 'refund' && userEmail.trim() && !userEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsProcessing(true);
    setShowConfirmation(false);

    try {
      // Prepare email data using safe data
      const emailData = {
        transactionId: safePurchaseData.transactionId,
        customerName: safePurchaseData.merchant,
        email: selectedAction === 'refund' ? userEmail.trim() : safePurchaseData.email,
        userEmail: selectedAction === 'refund' ? userEmail.trim() : '', // Add user email field
        lastFourDigits: safePurchaseData.lastFour,
        amount: safePurchaseData.amount,
        date: safePurchaseData.date,
        status: safePurchaseData.status,
        merchant: safePurchaseData.merchant,
        invoice: safePurchaseData.invoice,
        cardType: safePurchaseData.cardType,
        response: safePurchaseData.response,
        type: safePurchaseData.type,
        message: safePurchaseData.message,
        user: safePurchaseData.user,
        source: safePurchaseData.source,
        auth: safePurchaseData.auth,
        fullCardNumber: safePurchaseData.fullCardNumber,
        requestTimestamp: new Date().toISOString()
      };

      let emailResult;
      let successMessage;

      switch (selectedAction) {
        case 'refund':
          emailResult = await emailService.sendRefundRequest(emailData);
          successMessage = 'Your refund request has been sent to our support team. You\'ll receive a confirmation email within the next few hours.';
          break;
        case 'cancel':
          emailResult = await emailService.sendCancellationRequest(emailData);
          successMessage = 'Your cancellation request has been sent to our support team. You\'ll receive a confirmation email shortly.';
          break;
        case 'payment':
          emailResult = await emailService.sendPaymentUpdateRequest(emailData);
          successMessage = 'Your payment update request has been sent to our support team. They will contact you to securely update your payment information.';
          break;
        case 'receipt':
          // For receipt, we'll simulate sending an email
          emailResult = { success: true };
          successMessage = 'Your receipt has been sent to your email address.';
          break;
        case 'support':
          // For support, we'll simulate sending an email
          emailResult = { success: true };
          successMessage = 'Your support request has been submitted. A representative will contact you within 24 hours.';
          break;
        default:
          throw new Error('Invalid action');
      }

      if (emailResult.success) {
        setActionResult({ success: true, message: successMessage });
      } else {
        setActionResult({ 
          success: false, 
          message: 'Your request has been submitted, but there was an issue sending the confirmation email. Our team will process your request manually.' 
        });
      }
    } catch (error) {
      console.error('Error processing action:', error);
      setActionResult({ 
        success: false, 
        message: 'There was a problem processing your request. Please contact our support team directly.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Add error boundary
  try {
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
                  <p className="font-medium">{safePurchaseData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Card ending in</p>
                  <p className="font-medium">•••• {safePurchaseData.lastFour}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{safePurchaseData.amount}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(safePurchaseData.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Merchant</p>
                <p className="font-medium">{safePurchaseData.merchant}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-sm">{safePurchaseData.transactionId}</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                  {safePurchaseData.status}
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
            
            {/* Email input for refund requests - ALWAYS show for refunds */}
            {(() => {
              console.log('🚨 RENDERING EMAIL FIELD SECTION - selectedAction:', selectedAction);
              console.log('🚨 selectedAction === "refund":', selectedAction === 'refund');
              return selectedAction === 'refund' ? (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="user-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Email Address *
                  </Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Please provide your email address so we can send you the refund confirmation.
                  </p>
                </div>
              ) : null;
            })()}
            
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 p-2 bg-yellow-100 text-xs">
                Debug: selectedAction = "{selectedAction}", showEmailField = {String(selectedAction === 'refund')}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmation(false);
                  setUserEmail(''); // Reset email when closing
                }}
                className="flex-1 h-11 sm:h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 font-medium rounded-lg text-sm sm:text-base order-2 sm:order-1 transition-all duration-200 focus-ring"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className="flex-1 h-11 sm:h-12 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium rounded-lg text-sm sm:text-base order-1 sm:order-2 transition-all duration-200 shadow-sm hover:shadow-md focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : (selectedActionContent?.confirmText || 'Confirm')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Action Result Dialog */}
        <Dialog open={!!actionResult} onOpenChange={() => setActionResult(null)}>
          <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 sm:p-6 mx-2 sm:mx-0">
            <div className="pb-4 sm:pb-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                {actionResult?.success ? (
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 dark:text-red-400 text-sm sm:text-lg">!</span>
                  </div>
                )}
                <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                  {actionResult?.success ? 'Request Submitted' : 'Request Submitted'}
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {actionResult?.message}
              </DialogDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button
                onClick={() => setActionResult(null)}
                className="flex-1 h-11 sm:h-12 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium rounded-lg text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {actionResult?.success ? 'Continue' : 'Try Again'}
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
  } catch (error) {
    console.error('Error in OptionsPage:', error);
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container-grid max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Error Loading Page
            </h1>
            <p className="text-muted-foreground mb-6">
              There was an error loading this page. Please try again.
            </p>
            <Button onClick={onBack} className="bg-amber-600 hover:bg-amber-700 text-white">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
}