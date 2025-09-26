import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 sm:px-6 md:px-0 leading-relaxed">
            How we collect, use, and protect your information
          </p>
        </div>

        {/* Content */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm max-w-4xl mx-auto">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Sterling & Associates Privacy Policy
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Effective Date: September 25, 2025
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-4 text-center text-gray-500 dark:text-gray-400 italic">
                Privacy Policy content will be added here once provided.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
