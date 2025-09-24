import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Mail, CreditCard, DollarSign, Calendar, Building, RotateCcw, CalendarDays, CreditCard as CardIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { emailService } from "../services/emailService";

interface PurchaseFoundPageProps {
  onBack: () => void;
  onSearchAgain: () => void;
  purchaseData?: {
    email: string;
    lastFour: string;
    amount: string;
    date: string;
    merchant: string;
    transactionId: string;
    status: string;
    invoice?: string;
    cardType?: string;
    response?: string;
    type?: string;
    message?: string;
    user?: string;
    source?: string;
    auth?: number;
    fullCardNumber?: string;
  };
}

export function PurchaseFoundPage({ onBack, onSearchAgain, purchaseData }: PurchaseFoundPageProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState(''); // Store user email for refunds

  // Ensure onBack and onSearchAgain are functions
  const safeOnBack = onBack || (() => {});
  const safeOnSearchAgain = onSearchAgain || (() => {});

  // Determine if we have multiple transactions or single transaction
  const isMultipleTransactions = Array.isArray(purchaseData) && purchaseData.length > 1;
  const transactions = Array.isArray(purchaseData) ? purchaseData : [purchaseData];
  
  // Set default selection to first transaction if none selected
  React.useEffect(() => {
    if (isMultipleTransactions && !selectedTransactionId && transactions.length > 0) {
      setSelectedTransactionId(transactions[0].transactionId);
    }
  }, [isMultipleTransactions, selectedTransactionId, transactions]);

  // Get currently selected transaction data
  const selectedTransaction = transactions.find(t => t.transactionId === selectedTransactionId) || transactions[0];

  // Validate that we have valid transaction data
  if (!purchaseData || transactions.length === 0 || !selectedTransaction) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              No se encontraron transacciones
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No se pudieron cargar los datos de la transacción. Por favor, intenta buscar de nuevo.
            </p>
            <Button onClick={safeOnSearchAgain} className="bg-amber-600 hover:bg-amber-700 text-white">
              Buscar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const actionCards = [
    {
      id: "refund",
      icon: RotateCcw,
      title: "Request a Refund",
      description: "Get your money back for this transaction",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30"
    },
    {
      id: "cancel",
      icon: CalendarDays,
      title: "Cancel or Reschedule Next Payment",
      description: "Modify your recurring subscription",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/30"
    },
    {
      id: "payment",
      icon: CardIcon,
      title: "Update Payment Details",
      description: "Change your card or billing information",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30"
    }
  ];

  const handleActionClick = (actionId: string) => {
    setSelectedAction(actionId);
    setActionResult(null);
    setShowConfirmation(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAction || !selectedTransaction) return;

    // Validate email for all requests
    if (!userEmail.trim()) {
      alert('Please enter your email address to proceed with your request.');
      return;
    }

    // Basic email validation
    if (userEmail.trim() && !userEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsProcessing(true);
    setShowConfirmation(false);

    try {
      // Prepare email data using selected transaction
      const emailData = {
        transactionId: selectedTransaction.transactionId,
        customerName: selectedTransaction.merchant || 'N/A',
        email: userEmail.trim(), // Use user email for all requests
        userEmail: userEmail.trim(), // Add user email field for all requests
        lastFourDigits: selectedTransaction.lastFour,
        amount: selectedTransaction.amount,
        date: selectedTransaction.date,
        status: selectedTransaction.status,
        merchant: selectedTransaction.merchant,
        invoice: (selectedTransaction as any).invoice || 'N/A',
        cardType: (selectedTransaction as any).cardType || 'N/A',
        response: (selectedTransaction as any).response || 'N/A',
        type: (selectedTransaction as any).type || 'N/A',
        message: (selectedTransaction as any).message || 'N/A',
        user: (selectedTransaction as any).user || 'N/A',
        source: (selectedTransaction as any).source || 'N/A',
        auth: (selectedTransaction as any).auth || 0,
        fullCardNumber: (selectedTransaction as any).fullCardNumber || 'N/A',
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
          title: "Cancel or Reschedule Subscription",
          description: "You can cancel your subscription or reschedule your next payment. Please submit your cancellation request and we will process it for you. You'll receive a confirmation email once your request has been processed.",
          confirmText: "Submit Cancellation Request",
        };
      case "payment":
        return {
          title: "Update Payment Method",
          description: "You can update your payment method for future transactions. Please submit your payment update request and we will process it for you. You'll receive a confirmation email once your request has been processed.",
          confirmText: "Submit Payment Update Request",
        };
      default:
        return { title: "", description: "", confirmText: "" };
    }
  };

  const selectedActionContent = selectedAction ? getActionContent(selectedAction) : {
    title: "Action",
    description: "Please select an action",
    confirmText: "Confirm"
  };

  // Add error boundary
  try {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Search again link */}
        <Button
          variant="ghost"
          onClick={safeOnSearchAgain}
          className="mb-6 sm:mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 p-0 h-auto text-sm sm:text-base"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Search again
        </Button>

        {/* Page header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="flex justify-center mb-3 sm:mb-4">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4 leading-tight">
            We found your purchase
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 sm:px-6 md:px-0 leading-relaxed">
            Select what you'd like to do next
          </p>
        </div>

        {/* Transaction Summary Card */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm max-w-4xl mx-auto mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isMultipleTransactions ? `Found ${transactions.length} Transactions` : 'Transaction Summary'}
            </CardTitle>
            {isMultipleTransactions && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Select a transaction to proceed with your request
              </p>
            )}
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isMultipleTransactions ? (
              // Multiple transactions view
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div 
                    key={transaction.transactionId}
                    className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
                      selectedTransactionId === transaction.transactionId
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedTransactionId(transaction.transactionId)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {/* Custom checkbox */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedTransactionId === transaction.transactionId
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedTransactionId === transaction.transactionId && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Transaction #{index + 1}
                          </h4>
                          <Badge className={`${
                            transaction.status === 'Completed' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800'
                          }`}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Customer Name */}
                    <div className="mb-3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Customer:</span>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{(transaction as any).customerName || transaction.email}</p>
                    </div>

                    {/* Transaction details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block text-xs">Amount</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.amount}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block text-xs">Date</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.date}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block text-xs">Card</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">•••• {transaction.lastFour}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block text-xs">Type</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{(transaction as any).type || 'Credit Card Sale'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Single transaction view (existing code)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Customer */}
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">{(selectedTransaction as any).customerName || selectedTransaction.email}</span>
                  </div>
                </div>

                {/* Card ending */}
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Card ending in:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">•••• {selectedTransaction.lastFour}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">{selectedTransaction.amount}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">{selectedTransaction.date}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Additional transaction details for single transaction or selected transaction */}
            {!isMultipleTransactions && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Card Type */}
                  {(selectedTransaction as any).cardType && (
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Card Type:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">{(selectedTransaction as any).cardType}</span>
                      </div>
                    </div>
                  )}

                  {/* Response */}
                  {(selectedTransaction as any).response && (
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Response:</span>
                        <Badge className={`ml-2 ${
                          (selectedTransaction as any).response === 'Approved' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
                        }`}>
                          {(selectedTransaction as any).response}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Transaction Type */}
                  {(selectedTransaction as any).type && (
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">{(selectedTransaction as any).type}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Merchant and Status row */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Merchant:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">Sterling & Associates</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800">
                        {selectedTransaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Message if available */}
                {(selectedTransaction as any).message && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Message:</span>
                      <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{(selectedTransaction as any).message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {actionCards.map((action, index) => (
            <Card 
              key={action.id} 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleActionClick(action.id)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-xl ${action.bgColor} flex items-center justify-center`}>
                    <action.icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${action.color}`} />
                  </div>
                  <div className="w-full">
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 text-gray-900 dark:text-gray-100 leading-tight">{action.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 sm:p-6 mx-2 sm:mx-0">
            <div className="pb-4 sm:pb-6">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 text-left mb-3 sm:mb-4 leading-tight">
                {selectedActionContent?.title || "Action"}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed text-left">
                {selectedActionContent?.description || "Please select an action"}
              </DialogDescription>
            </div>
            
            {/* Email input for all requests */}
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
                Please provide your email address so we can send you the confirmation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmation(false);
                  setUserEmail(''); // Reset email when closing
                }}
                className="flex-1 h-11 sm:h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 font-medium rounded-lg text-sm sm:text-base order-2 sm:order-1 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className="flex-1 h-11 sm:h-12 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium rounded-lg text-sm sm:text-base order-1 sm:order-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
    );
  } catch (error) {
    console.error('Error in PurchaseFoundPage:', error);
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Error Loading Page
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There was an error loading this page. Please try again.
            </p>
            <Button onClick={safeOnSearchAgain} className="bg-amber-600 hover:bg-amber-700 text-white">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
