import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
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
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 sm:px-6 md:px-0 leading-relaxed">
            Please read these terms carefully before using our services
          </p>
        </div>

        {/* Content */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm max-w-4xl mx-auto">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Sterling & Associates Terms of Service
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Effective Date: September 25, 2025
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 dark:text-gray-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">1. Acceptance of Terms</h3>
              <p className="mb-4">
                By accessing or using sterling-compliance.vercel.app (the "Service"), you agree to these Terms of Service ("Terms"). If you do not agree, do not use the Service.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Changes to Terms</h3>
              <p className="mb-4">
                We may modify these Terms at any time. Updates will be posted on this page, and continued use constitutes acceptance.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">3. Description of Service</h3>
              <p className="mb-4">
                We provide compliance support tools and related services. Features, content, and availability may change.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">4. Accounts & Security</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>You may be required to create an account.</li>
                <li>You are responsible for your account credentials.</li>
                <li>Notify us immediately of unauthorized use.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">5. Prohibited Use</h3>
              <p className="mb-4">You agree not to use the Service for:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Illegal or fraudulent purposes.</li>
                <li>Uploading viruses or harmful content.</li>
                <li>Interfering with the platform or security.</li>
                <li>Violating applicable laws.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">6. Intellectual Property</h3>
              <p className="mb-4">
                All content, design, and trademarks belong to Sterling & Associates LLC or its licensors. You may not reproduce, distribute, or copy without permission.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">7. Third-Party Links</h3>
              <p className="mb-4">
                We may link to external services. We are not responsible for their content or practices.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">8. Disclaimer of Warranties</h3>
              <p className="mb-4">
                The Service is provided "as is" and "as available," without warranties of any kind.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">9. Limitation of Liability</h3>
              <p className="mb-4">
                Sterling & Associates LLC is not liable for indirect, incidental, or consequential damages resulting from use of the Service.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">10. Indemnification</h3>
              <p className="mb-4">
                You agree to indemnify and hold us harmless against claims arising from your use of the Service.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">11. Termination</h3>
              <p className="mb-4">
                We may suspend or terminate your access without notice if you violate these Terms.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">12. Governing Law</h3>
              <p className="mb-4">
                These Terms are governed by the laws of the State of Georgia, USA. Disputes will be resolved in courts located in Fulton County, Georgia.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">13. Severability</h3>
              <p className="mb-4">
                If any part of these Terms is invalid, the remaining provisions remain in force.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">14. Entire Agreement</h3>
              <p className="mb-4">
                These Terms, along with posted policies, form the full agreement between you and Sterling & Associates LLC.
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
