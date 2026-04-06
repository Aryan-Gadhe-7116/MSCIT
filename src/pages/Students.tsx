import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStudents, useBatches, useAddStudent, useDeleteStudent, getAttendancePercent, type Student } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Students() {
  const { data: students = [], isLoading } = useStudents();
  const { data: batchesData = [] } = useBatches();
  const [search, setSearch] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterFee, setFilterFee] = useState("all");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", batchId: "", address: "" });

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchBatch = filterBatch === "all" || s.batchId === filterBatch;
    const matchFee = filterFee === "all" || s.feeStatus === filterFee;
    return matchSearch && matchBatch && matchFee;
  });

  const addMutation = useAddStudent();
  const deleteMutation = useDeleteStudent();

  const handleAdd = () => {
    if (!form.name || !form.email || !form.batchId) return;
    const newStudent = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      batchId: form.batchId,
      joinDate: new Date().toISOString().split("T")[0],
      feeStatus: "pending",
      totalFee: 5000,
      paidAmount: 0,
      attendance: {},
      marks: {},
      password: "student123",
    };
    addMutation.mutate(newStudent);
    setForm({ name: "", email: "", phone: "", batchId: "", address: "" });
    setOpen(false);
    toast.success("Student added successfully");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
    toast.success("Student removed");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4 p-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-foreground">Students ({students.length})</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> Add Student</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                <div>
                  <Label>Batch</Label>
                  <Select value={form.batchId} onValueChange={v => setForm({ ...form, batchId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Batches</SelectItem>
                      {batchesData.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} disabled={addMutation.isPending} className="w-full">
                  {addMutation.isPending ? "Adding..." : "Add Student"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="sm:max-w-xs" />
          <Select value={filterBatch} onValueChange={setFilterBatch}>
            <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batchesData.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterFee} onValueChange={setFilterFee}>
            <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fee Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Student Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => {
            const batch = batchesData.find(b => b.id === s.batchId);
            return (
              <Card key={s.id} className="border-border cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/student/${s.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{s.name}</h3>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => handleDelete(s.id, e)} disabled={deleteMutation.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{batch?.type || "N/A"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${s.feeStatus === "paid" ? "bg-success/10 text-success" : s.feeStatus === "partial" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                      {s.feeStatus}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">Att: {getAttendancePercent(s)}%</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No students found.</p>}
      </div>
    </DashboardLayout>
  );
}
