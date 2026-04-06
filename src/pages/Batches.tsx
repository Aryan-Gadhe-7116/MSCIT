import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, type Batch } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Calendar, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Batches() {
  const [batches, setBatches] = useState(db.batches.getAll());
  const [open, setOpen] = useState(false);
  const trainers = db.trainers.getAll();
  const students = db.students.getAll();

  const [form, setForm] = useState({ name: "", type: "Morning" as Batch["type"], trainerId: "", startDate: "", endDate: "", capacity: "30", schedule: "" });

  const handleAdd = () => {
    if (!form.name || !form.trainerId) return;
    const b: Batch = { id: `b${Date.now()}`, name: form.name, type: form.type, trainerId: form.trainerId, startDate: form.startDate, endDate: form.endDate, capacity: parseInt(form.capacity), schedule: form.schedule };
    db.batches.add(b);
    setBatches(db.batches.getAll());
    setOpen(false);
    toast.success("Batch created");
  };

  const handleDelete = (id: string) => {
    db.batches.delete(id);
    setBatches(db.batches.getAll());
    toast.success("Batch deleted");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Batches</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> New Batch</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Batch</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as Batch["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Weekend">Weekend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Trainer</Label>
                  <Select value={form.trainerId} onValueChange={v => setForm({ ...form, trainerId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select trainer" /></SelectTrigger>
                    <SelectContent>{trainers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                  <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                </div>
                <div><Label>Schedule</Label><Input value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} placeholder="e.g. Mon-Fri 9:00-11:00 AM" /></div>
                <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></div>
                <Button onClick={handleAdd} className="w-full">Create Batch</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map(b => {
            const trainer = db.trainers.get(b.trainerId);
            const enrolled = students.filter(s => s.batchId === b.id).length;
            const progress = Math.min(100, Math.max(0, Math.round(((new Date().getTime() - new Date(b.startDate).getTime()) / (new Date(b.endDate).getTime() - new Date(b.startDate).getTime())) * 100)));
            return (
              <Card key={b.id} className="border-border">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{b.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium mt-1 inline-block ${b.type === "Morning" ? "bg-info/10 text-info" : b.type === "Evening" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                        {b.type}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(b.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Users className="h-4 w-4" />{enrolled}/{b.capacity} students</p>
                    <p className="flex items-center gap-2"><Clock className="h-4 w-4" />{b.schedule}</p>
                    <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{b.startDate} to {b.endDate}</p>
                    <p>Trainer: {trainer?.name || "N/A"}</p>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
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
