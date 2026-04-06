import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, type Trainer } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Mail, Phone, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function Trainers() {
  const [trainers, setTrainers] = useState(db.trainers.getAll());
  const [open, setOpen] = useState(false);
  const batches = db.batches.getAll();

  const [form, setForm] = useState({ name: "", email: "", phone: "", specialization: "" });

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const t: Trainer = { id: `t${Date.now()}`, ...form, joinDate: new Date().toISOString().split("T")[0] };
    db.trainers.add(t);
    setTrainers(db.trainers.getAll());
    setOpen(false);
    toast.success("Trainer added");
  };

  const handleDelete = (id: string) => {
    db.trainers.delete(id);
    setTrainers(db.trainers.getAll());
    toast.success("Trainer removed");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Trainers</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add Trainer</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Trainer</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Specialization</Label><Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} /></div>
                <Button onClick={handleAdd} className="w-full">Add Trainer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map(t => {
            const assignedBatches = batches.filter(b => b.trainerId === t.id);
            return (
              <Card key={t.id} className="border-border">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-foreground">{t.name}</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{t.email}</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{t.phone}</p>
                    <p className="flex items-center gap-2"><BookOpen className="h-4 w-4" />{t.specialization}</p>
                    <p className="text-xs mt-2">Assigned: {assignedBatches.map(b => b.name).join(", ") || "None"}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
