import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { getAuth, useUnreadCount } from "@/lib/data";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = getAuth();
  const unread = useUnreadCount();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border bg-card px-4 gap-3 shrink-0">
            <SidebarTrigger className="text-foreground" />
            <h1 className="text-lg font-semibold text-foreground truncate">
              MS-CIT Class Management
            </h1>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => navigate("/notifications")} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {unread}
                  </span>
                )}
              </button>
              <span className="text-sm text-muted-foreground capitalize hidden sm:inline">
                {auth?.role || "Admin"}
              </span>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
