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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">1. Introduction</h3>
              <p className="mb-4">
                Your privacy is important to us. This policy explains how Sterling & Associates LLC collects, uses, and protects your data.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Data We Collect</h3>
              <p className="mb-2">Provided by you: name, email, payment details.</p>
              <p className="mb-2">Automatically collected: IP address, device, browser, usage activity.</p>
              <p className="mb-4">Cookies: used for functionality and analytics.</p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">3. How We Use Data</h3>
              <p className="mb-2">We use personal data to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Deliver and improve services.</li>
                <li>Communicate with you (support, updates, promotions).</li>
                <li>Prevent fraud and ensure security.</li>
                <li>Comply with legal obligations.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">4. Sharing Data</h3>
              <p className="mb-2">We may share data with:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Service providers (hosting, payment processors, analytics).</li>
                <li>Legal authorities when required.</li>
                <li>In business transfers such as mergers or acquisitions.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">5. Cookies</h3>
              <p className="mb-4">
                You can disable cookies in your browser, but some features may not work.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">6. Security</h3>
              <p className="mb-4">
                We apply reasonable safeguards to protect data, but no system is 100% secure.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">7. Data Retention</h3>
              <p className="mb-4">
                We retain data as long as necessary for the purposes outlined or as required by law.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">8. Your Rights</h3>
              <p className="mb-4">
                Depending on your location, you may request access to, correction of, deletion of, or restriction on your data.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">9. Children's Privacy</h3>
              <p className="mb-4">
                Our services are not directed at children under 13. We do not knowingly collect data from minors.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">10. Changes to Policy</h3>
              <p className="mb-4">
                We may update this policy and will post revisions here with updated effective dates.
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
