import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, type Exam } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Exams() {
  const [exams, setExams] = useState(db.exams.getAll());
  const [open, setOpen] = useState(false);
  const batches = db.batches.getAll();
  const students = db.students.getAll();

  const [form, setForm] = useState({ name: "", batchId: "", date: "", totalMarks: "100", passingMarks: "40" });

  const handleAdd = () => {
    if (!form.name || !form.batchId) return;
    const e: Exam = { id: `e${Date.now()}`, name: form.name, batchId: form.batchId, date: form.date, totalMarks: parseInt(form.totalMarks), passingMarks: parseInt(form.passingMarks) };
    db.exams.add(e);
    setExams(db.exams.getAll());
    setOpen(false);
    toast.success("Exam created");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Exams & Tests</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Create Exam</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Exam</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div>
                  <Label>Batch</Label>
                  <Select value={form.batchId} onValueChange={v => setForm({ ...form, batchId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                    <SelectContent>{batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Total Marks</Label><Input type="number" value={form.totalMarks} onChange={e => setForm({ ...form, totalMarks: e.target.value })} /></div>
                  <div><Label>Passing Marks</Label><Input type="number" value={form.passingMarks} onChange={e => setForm({ ...form, passingMarks: e.target.value })} /></div>
                </div>
                <Button onClick={handleAdd} className="w-full">Create Exam</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {exams.map(ex => {
          const batchStudents = students.filter(s => s.batchId === ex.batchId);
          const results = batchStudents.map(s => ({
            name: s.name.split(" ")[0],
            marks: s.marks[ex.id] || 0,
            passing: ex.passingMarks,
          }));
          const passed = results.filter(r => r.marks >= ex.passingMarks).length;
          const failed = results.length - passed;

          return (
            <Card key={ex.id} className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{ex.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">{ex.date}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4 text-sm">
                  <span className="text-success font-medium">Pass: {passed}</span>
                  <span className="text-destructive font-medium">Fail: {failed}</span>
                  <span className="text-muted-foreground">Total: {results.length}</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis fontSize={11} domain={[0, ex.totalMarks]} />
                    <Tooltip />
                    <Bar dataKey="marks" fill="hsl(174, 62%, 32%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="passing" fill="hsl(36, 90%, 55%)" radius={[4, 4, 0, 0]} name="Passing Line" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
