import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// Don't use the broken theme provider
// import { ThemeProvider } from "@/components/ui/theme-provider";
import AppShell from "@/components/shell/AppShell";
import { AppShellWithoutSidebar } from "@/components/shell/AppShellWithoutSidebar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import IconGuidePage from "@/pages/icon-guide";
import CheckerPage from "@/pages/checker";

function Router() {
  const [location] = useLocation();
  
  // Determine if we're on the landing page
  const isLandingPage = location === "/";
  
  // Checker pages that need no sidebar
  const isCheckerPage = location.includes("/tools/checker");
  
  if (isLandingPage) {
    // For the landing page, don't use the app shell
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/icon-guide" component={IconGuidePage} />
        <Route component={NotFound} />
      </Switch>
    );
  }
  
  // For checker pages, use app shell without sidebar
  if (isCheckerPage) {
    return (
      <AppShellWithoutSidebar title="AccessWebPro">
        <Switch>
          <Route path="/tools/checker" component={CheckerPage} />
          <Route component={NotFound} />
        </Switch>
      </AppShellWithoutSidebar>
    );
  }
  
  // For all other pages, use the app shell with sidebar
  return (
    <AppShell title="AccessWebPro">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/icon-guide" component={IconGuidePage} />
        <Route path="/dashboard">
          <div className="grid gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to the AccessWebPro dashboard. Your accessibility compliance reports will appear here.
            </p>
          </div>
        </Route>
        <Route path="/reports">
          <div className="grid gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              View detailed accessibility reports for your websites here.
            </p>
          </div>
        </Route>
        <Route path="/settings">
          <div className="grid gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your AccessWebPro account settings.
            </p>
          </div>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* We're using a simpler theme toggle approach to fix dark mode issues */}
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
