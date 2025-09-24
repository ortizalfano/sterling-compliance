import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import { ArrowLeft, Search, AlertCircle, Calendar } from "lucide-react";
import { airtableService } from "../services/airtableService";
import { AirtableTransaction } from "../types";

interface LookupPageProps {
  onBack: () => void;
  onFoundPurchase: (purchaseData: any) => void;
}

interface FormData {
  lastFour: string;
  transactionDate: string;
  amount: string;
  orderNumber: string;
}

interface FormErrors {
  lastFour?: string;
  general?: string;
}

export function LookupPage({ onBack, onFoundPurchase }: LookupPageProps) {
  const [formData, setFormData] = useState<FormData>({
    lastFour: "",
    transactionDate: "",
    amount: "",
    orderNumber: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Last 4 digits validation (only required field)
    if (!formData.lastFour) {
      newErrors.lastFour = "Last 4 digits are required";
    } else if (!/^\d{4}$/.test(formData.lastFour)) {
      newErrors.lastFour = "Please enter exactly 4 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Search transactions in Airtable (only by last 4 digits)
      const result = await airtableService.searchTransactionsByCard(
        formData.lastFour,
        formData.transactionDate
      );

      if (result.success && result.data && result.data.length > 0) {
        // Convert all Airtable transactions to display format
        const purchaseData = result.data.map(transaction => ({
          email: transaction.Customer || "N/A",
          customerName: transaction.Customer || "N/A", // Add customer name
          lastFour: formData.lastFour,
          amount: `$${transaction.Amount.toFixed(2)}`,
          date: new Date(transaction.Created).toLocaleDateString(),
          status: transaction.Status,
          merchant: transaction.Customer || "N/A",
          transactionId: transaction["Transaction ID"],
          invoice: transaction.Invoice,
          cardType: transaction["Card Type"],
          response: transaction.Response,
          type: transaction.Type,
          message: transaction.Message,
          user: transaction.User,
          source: transaction.Source,
          auth: transaction.Auth,
          fullCardNumber: transaction["Card Number"]
        }));
        
        // If only one transaction, pass it as a single object
        // If multiple transactions, pass as array
        if (purchaseData.length === 1) {
          onFoundPurchase(purchaseData[0]);
        } else {
          onFoundPurchase(purchaseData);
        }
      } else {
        setErrors({ 
          general: result.error || "We couldn't find a matching purchase. Please check your details and try again." 
        });
      }
    } catch (error) {
      console.error('Error searching transactions:', error);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 sm:mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 p-0 h-auto text-sm sm:text-base"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to help options
        </Button>

        {/* Page header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4 leading-tight">
            Help us find your purchase
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 sm:px-6 md:px-0 leading-relaxed">
            We only need the last 4 digits of your card to locate your transaction with Sterling and Associates.
          </p>
        </div>

        {/* Form card */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm max-w-4xl mx-auto">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
              Transaction Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {errors.general && (
              <Alert className="mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-600 dark:text-red-400">
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Last 4 digits - Required field */}
                <div className="space-y-2">
                  <Label htmlFor="lastFour" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last 4 digits of card *
                  </Label>
                  <Input
                    id="lastFour"
                    type="text"
                    value={formData.lastFour}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                      handleInputChange("lastFour", value);
                    }}
                    placeholder="1234"
                    maxLength={4}
                    className={`h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-amber-500 focus:ring-amber-500 ${errors.lastFour ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.lastFour && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.lastFour}</p>
                  )}
                </div>

                {/* Transaction date - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="transactionDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transaction date (optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="transactionDate"
                      type="date"
                      value={formData.transactionDate}
                      onChange={(e) => handleInputChange("transactionDate", e.target.value)}
                      className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-amber-500 focus:ring-amber-500"
                      disabled={isLoading}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Transaction amount - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transaction amount (optional)
                  </Label>
                  <Input
                    id="amount"
                    type="text"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="$49.99"
                    className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-amber-500 focus:ring-amber-500"
                    disabled={isLoading}
                  />
                </div>

                {/* Order number - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="orderNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Order/Invoice number (optional)
                  </Label>
                  <Input
                    id="orderNumber"
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                    placeholder="INV-123456 or similar"
                    className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-amber-500 focus:ring-amber-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4 sm:pt-5 md:pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 h-12 sm:h-13 md:h-14 text-sm sm:text-base md:text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base md:text-lg">Searching...</span>
                    </div>
                  ) : (
                    <>
                      <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base md:text-lg">Find my purchase</span>
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Loading skeleton */}
            {isLoading && (
              <div className="mt-8 space-y-4">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help text */}
        <div className="mt-6 sm:mt-8 text-center px-4 sm:px-0">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Having trouble finding your information? Our chat assistant can help guide you through the process.
          </p>
        </div>
      </div>
    </div>
  );
}