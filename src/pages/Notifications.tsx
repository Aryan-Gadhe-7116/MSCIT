import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/data";
import { Bell, CreditCard, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Notifications() {
  const [notifications, setNotifications] = useState(db.notifications.getAll());

  const markRead = (id: string) => {
    db.notifications.markRead(id);
    setNotifications(db.notifications.getAll());
  };

  const markAllRead = () => {
    notifications.forEach(n => db.notifications.markRead(n.id));
    setNotifications(db.notifications.getAll());
  };

  const getIcon = (type: string) => {
    if (type === "fee") return CreditCard;
    if (type === "attendance") return Users;
    return Bell;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="h-4 w-4 mr-1" /> Mark All Read
          </Button>
        </div>

        {notifications.map(n => {
          const Icon = getIcon(n.type);
          return (
            <Card key={n.id} className={`border-border cursor-pointer transition-colors ${!n.read ? "bg-primary/5 border-primary/20" : ""}`} onClick={() => markRead(n.id)}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === "fee" ? "bg-warning/10 text-warning" : n.type === "attendance" ? "bg-destructive/10 text-destructive" : "bg-info/10 text-info"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm text-foreground">{n.title}</h3>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {notifications.length === 0 && <p className="text-muted-foreground text-center py-8">No notifications.</p>}
      </div>
    </DashboardLayout>
  );
}
