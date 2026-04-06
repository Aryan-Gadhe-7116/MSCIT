import {
  LayoutDashboard, Users, GraduationCap, Calendar, ClipboardList,
  BarChart3, Bell, CreditCard, Award, LogOut, BookOpen, Search
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { db, getAuth, logout, useUnreadCount } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";

const adminItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/students", icon: Users },
  { title: "Batches", url: "/batches", icon: BookOpen },
  { title: "Trainers", url: "/trainers", icon: GraduationCap },
  { title: "Timetable", url: "/timetable", icon: Calendar },
  { title: "Exams", url: "/exams", icon: ClipboardList },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Search", url: "/search", icon: Search },
  { title: "Certificates", url: "/certificates", icon: Award },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const unread = useUnreadCount();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const items = auth?.role === "student"
    ? [
        { title: "My Profile", url: `/student/${auth.userId}`, icon: Users },
        { title: "Timetable", url: "/timetable", icon: Calendar },
        { title: "Notifications", url: "/notifications", icon: Bell },
      ]
    : adminItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <Logo collapsed={collapsed} />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-primary font-bold text-sm tracking-wider">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                      {item.title === "Notifications" && unread > 0 && !collapsed && (
                        <Badge className="ml-auto bg-accent text-accent-foreground text-xs h-5 px-1.5">{unread}</Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/20 text-sidebar-foreground cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
