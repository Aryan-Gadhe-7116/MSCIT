import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";
import Batches from "./pages/Batches";
import Trainers from "./pages/Trainers";
import Timetable from "./pages/Timetable";
import Exams from "./pages/Exams";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Payments from "./pages/Payments";
import SearchPage from "./pages/SearchPage";
import Certificates from "./pages/Certificates";

const queryClient = new QueryClient();

const App = () => {
  const [error, setError] = React.useState<string | null>(null);

  const handleError = (error: Error) => {
    console.error("App error:", error);
    setError(error.message);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {error ? (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background text-destructive">
              <div className="max-w-lg text-center">
                <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/student/:id" element={<StudentProfile />} />
                  <Route path="/batches" element={<Batches />} />
                  <Route path="/trainers" element={<Trainers />} />
                  <Route path="/timetable" element={<Timetable />} />
                  <Route path="/exams" element={<Exams />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/certificates" element={<Certificates />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
