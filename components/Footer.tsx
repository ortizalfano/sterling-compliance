interface FooterProps {
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToRefund?: () => void;
}

export function Footer({ onNavigateToTerms, onNavigateToPrivacy, onNavigateToRefund }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            {/* Legal links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <button 
                onClick={onNavigateToPrivacy}
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={onNavigateToTerms}
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 cursor-pointer"
              >
                Terms of Service
              </button>
              <button 
                onClick={onNavigateToRefund}
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 cursor-pointer"
              >
                Refund Policy
              </button>
            </div>

            {/* Copyright */}
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center md:text-right">
              © 2025 Sterling & Associates. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}