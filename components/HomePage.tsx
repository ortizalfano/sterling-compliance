import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { 
  RefreshCw, 
  FileText, 
  Receipt, 
  Settings, 
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface HomePageProps {
  onNavigateToLookup: () => void;
  onNavigateToHelp: () => void;
}

export function HomePage({ onNavigateToLookup, onNavigateToHelp }: HomePageProps) {
  const quickActions = [
    { icon: RefreshCw, label: "Request a refund" },
    { icon: FileText, label: "Cancel/Reschedule subscription" },
    { icon: Receipt, label: "Request a receipt" },
    { icon: Settings, label: "Update payment details" },
    { icon: HelpCircle, label: "Other issues" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4 leading-tight">
              How can we help you today?
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2 sm:px-4 md:px-0 leading-relaxed">
              Fast, secure assistance for purchases processed by Sterling and Associates.
            </p>
          </div>

          {/* Main Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Left Card - Recent Purchase Help */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
              <CardHeader className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-start gap-2 sm:gap-3 leading-tight">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm sm:text-base md:text-lg">I need help with a recent purchase</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-4 sm:px-5 md:px-6 pb-3 sm:pb-4 flex-1">
                <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 text-sm sm:text-base leading-relaxed">
                  Get assistance with your recent transaction quickly and securely.
                </p>
                
                <div className="space-y-2 sm:space-y-2.5">
                  {quickActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4 py-1.5 sm:py-2">
                      <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{action.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="p-4 sm:p-5 md:p-6 pt-0 mt-auto">
                <Button 
                  onClick={onNavigateToLookup}
                  className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
                >
                  Look up my purchase
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </CardFooter>
            </Card>

            {/* Right Card - Charge Inquiry */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
              <CardHeader className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-start gap-2 sm:gap-3 leading-tight">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm sm:text-base md:text-lg">I'm not sure why Sterling and Associates has charged me</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-4 sm:px-5 md:px-6 pb-3 sm:pb-4 flex-1">
                <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 text-sm sm:text-base leading-relaxed">
                  Sterling and Associates processes payments for various online merchants and subscription services. 
                  We act as a secure payment processor, which means the charge on your statement might be from 
                  a purchase you made with one of our partner merchants.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 md:p-5">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="font-medium text-gray-900 dark:text-gray-100">Common scenarios:</span>
                    <br />• Online software subscriptions
                    <br />• Digital content purchases  
                    <br />• E-commerce transactions
                    <br />• Recurring service payments
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 sm:p-5 md:p-6 pt-0 mt-auto">
                <Button 
                  onClick={onNavigateToHelp}
                  variant="outline"
                  className="w-full border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-medium py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
                >
                  Get help identifying this charge
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}