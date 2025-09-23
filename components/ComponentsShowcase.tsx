import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Star,
  Heart,
  Download,
  Settings,
  User,
  Mail,
  Phone
} from "lucide-react";

export function ComponentsShowcase() {
  const [progress, setProgress] = useState(65);
  const [switchEnabled, setSwitchEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-grid max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-4">
            Design System Components
          </h1>
          <p className="text-lg text-muted-foreground">
            Sterling and Associates corporate design system showcase
          </p>
        </div>

        <div className="space-y-12">
          {/* Typography */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Typography</h2>
            <Card className="shadow-soft">
              <CardContent className="p-6 space-y-4">
                <h1>Headline 1 - Corporate Excellence</h1>
                <h2>Headline 2 - Trusted Solutions</h2>
                <h3>Headline 3 - Professional Services</h3>
                <h4>Headline 4 - Business Focus</h4>
                <p>Body text with comfortable line-height for optimal readability. This paragraph demonstrates our corporate yet approachable tone.</p>
                <p className="text-sm text-muted-foreground">
                  Smaller text for secondary information and helper text.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Color System */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Color System</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Primary Colors */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Primary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary"></div>
                    <div>
                      <p className="font-medium">Corporate Blue</p>
                      <p className="text-sm text-muted-foreground">#2563eb</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: "#1d4ed8" }}></div>
                    <div>
                      <p className="font-medium">Blue Hover</p>
                      <p className="text-sm text-muted-foreground">#1d4ed8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Neutrals */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Neutrals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-foreground"></div>
                    <div>
                      <p className="font-medium">Ink Text</p>
                      <p className="text-sm text-muted-foreground">#0f172a</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted border"></div>
                    <div>
                      <p className="font-medium">Surface</p>
                      <p className="text-sm text-muted-foreground">#f8fafc</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Colors */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: "#16a34a" }}></div>
                    <div>
                      <p className="font-medium">Success</p>
                      <p className="text-sm text-muted-foreground">#16a34a</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: "#dc2626" }}></div>
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm text-muted-foreground">#dc2626</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Primary Buttons</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm">Small</Button>
                      <Button>Default</Button>
                      <Button size="lg">Large</Button>
                      <Button disabled>Disabled</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Secondary Buttons</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm">Small</Button>
                      <Button variant="outline">Default</Button>
                      <Button variant="outline" size="lg">Large</Button>
                      <Button variant="outline" disabled>Disabled</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Ghost & Destructive</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="secondary">Secondary</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">With Icons</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Form Elements */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email-demo">Email Address</Label>
                      <Input 
                        id="email-demo" 
                        type="email" 
                        placeholder="your@email.com"
                        className="h-12"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone-demo">Phone Number</Label>
                      <Input 
                        id="phone-demo" 
                        type="tel" 
                        placeholder="+1 (555) 000-0000"
                        className="h-12"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="disabled-demo">Disabled Input</Label>
                      <Input 
                        id="disabled-demo" 
                        disabled 
                        value="Disabled field"
                        className="h-12"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="error-demo">Input with Error</Label>
                      <Input 
                        id="error-demo" 
                        placeholder="Invalid input"
                        className="h-12 border-destructive"
                      />
                      <p className="text-sm text-destructive mt-1">This field is required</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="switch-demo" 
                        checked={switchEnabled}
                        onCheckedChange={setSwitchEnabled}
                      />
                      <Label htmlFor="switch-demo">Enable notifications</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="progress-demo">Progress</Label>
                      <Progress value={progress} className="mt-2" />
                      <p className="text-sm text-muted-foreground mt-1">{progress}% complete</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Alerts & Badges */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Alerts & Badges</h2>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is an informational alert with neutral styling.
                </AlertDescription>
              </Alert>
              
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Success! Your request has been processed successfully.
                </AlertDescription>
              </Alert>
              
              <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  Warning: Please review your information before proceeding.
                </AlertDescription>
              </Alert>
              
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 dark:text-red-300">
                  Error: Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Badges</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Success</Badge>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Warning</Badge>
              </div>
            </div>
          </section>

          {/* Cards & Elevations */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Cards & Elevations</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Soft Shadow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Default card elevation for subtle depth.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-elevated">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Elevated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Medium elevation for important content.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-hover">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Hover Shadow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">High elevation for interactive elements.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Loading States */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Loading States</h2>
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Skeleton Loading</h4>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-3">Button Loading States</h4>
                    <div className="flex gap-3">
                      <Button disabled>
                        <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                        Loading...
                      </Button>
                      <Button variant="outline" disabled>
                        Processing...
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Interactive Elements */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Interactive Elements</h2>
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Hover Effects</h4>
                    <div className="space-y-3">
                      <div className="p-4 border border-border rounded-lg hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-primary" />
                          <span>Hover to elevate</span>
                        </div>
                      </div>
                      <div className="p-4 border border-border rounded-lg hover:bg-accent transition-smooth cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-primary" />
                          <span>Hover to highlight</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Focus States</h4>
                    <div className="space-y-3">
                      <Button className="w-full focus-ring">Focus me with Tab</Button>
                      <Input placeholder="Focus with Tab" className="focus-ring" />
                      <Button variant="outline" className="w-full focus-ring">Another focusable element</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}