import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface RefundPolicyPageProps {
  onBack: () => void;
}

export function RefundPolicyPage({ onBack }: RefundPolicyPageProps) {
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
          Back to home
        </Button>

        {/* Page header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4 leading-tight">
            Refund Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 sm:px-6 md:px-0 leading-relaxed">
            Our policy on refunds and cancellations
          </p>
        </div>

        {/* Content */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm max-w-4xl mx-auto">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Sterling & Associates Refund Policy
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Effective Date: September 25, 2025
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 dark:text-gray-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">1. Scope</h3>
              <p className="mb-4">
                This Refund Policy applies to purchases made on sterling-compliance.vercel.app.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Eligibility</h3>
              <p className="mb-4">
                Refund requests must be submitted within 30 days of purchase.
              </p>
              <p className="mb-4">
                Requests after 30 days may not be eligible, unless required by law.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">3. Non-Refundable Items</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Setup or one-time fees.</li>
                <li>Services already rendered.</li>
                <li>Items clearly marked as non-refundable.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">4. Refund Process</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Submit requests via email.</li>
                <li>Include order ID, account details, and reason for refund.</li>
                <li>Approved refunds will be issued to the original payment method within 7–14 business days.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">5. Cancellations</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>You may cancel subscriptions anytime.</li>
                <li>Service access remains until the end of the billing cycle.</li>
                <li>No pro-rated refunds unless eligible under this policy.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">6. Disputes</h3>
              <p className="mb-4">
                If you disagree with a refund decision, email us. We will review within 5 business days.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">7. Changes to Refund Policy</h3>
              <p className="mb-4">
                We may update this policy at any time. Changes apply only to future purchases.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Contact Information</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-gray-100">Sterling & Associates LLC</p>
                <p>1005 Virginia Ave, Ste 230</p>
                <p>Hapeville, GA 30354, USA</p>
                <p>Email: admin@sterlingcompliance.net</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
