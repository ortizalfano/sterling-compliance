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
                By accessing and using Sterling & Associates services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Use License</h3>
              <p className="mb-4">
                Permission is granted to temporarily download one copy of the materials on Sterling & Associates' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">3. Service Description</h3>
              <p className="mb-4">
                Sterling & Associates provides payment processing services for various online merchants and subscription services. We act as a secure payment processor, facilitating transactions between customers and our partner merchants.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">4. User Responsibilities</h3>
              <p className="mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of their account information</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Not using our services for any illegal or unauthorized purpose</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">5. Payment Terms</h3>
              <p className="mb-4">
                All payments are processed securely through our payment processing system. By making a purchase, you agree to pay all charges associated with your account. Refunds are subject to our Refund Policy.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">6. Privacy Policy</h3>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">7. Disclaimers</h3>
              <p className="mb-4">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, Sterling & Associates excludes all representations, warranties, conditions and terms relating to our website and the use of this website.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">8. Limitations</h3>
              <p className="mb-4">
                In no event shall Sterling & Associates or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sterling & Associates' website, even if Sterling & Associates or a Sterling & Associates authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">9. Accuracy of Materials</h3>
              <p className="mb-4">
                The materials appearing on Sterling & Associates' website could include technical, typographical, or photographic errors. Sterling & Associates does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">10. Links</h3>
              <p className="mb-4">
                Sterling & Associates has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Sterling & Associates of the site.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">11. Modifications</h3>
              <p className="mb-4">
                Sterling & Associates may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">12. Governing Law</h3>
              <p className="mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of Georgia, USA and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Contact Information</h3>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
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
