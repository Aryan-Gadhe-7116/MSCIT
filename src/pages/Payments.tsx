import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, type Payment } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Receipt } from "lucide-react";
import { toast } from "sonner";

export default function Payments() {
  const [payments, setPayments] = useState(db.payments.getAll());
  const [open, setOpen] = useState(false);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const students = db.students.getAll();

  const [form, setForm] = useState({ studentId: "", amount: "", method: "UPI" });

  const handleAdd = () => {
    if (!form.studentId || !form.amount) return;
    const p: Payment = { id: `p${Date.now()}`, studentId: form.studentId, amount: parseInt(form.amount), date: new Date().toISOString().split("T")[0], method: form.method, status: "completed" };
    db.payments.add(p);

    // Update student
    const student = db.students.get(form.studentId);
    if (student) {
      const newPaidAmount = student.paidAmount + parseInt(form.amount);
      const newFeeStatus = newPaidAmount >= student.totalFee ? "paid" : newPaidAmount > 0 ? "partial" : "pending";
      db.students.update(student.id, { paidAmount: newPaidAmount, feeStatus: newFeeStatus });
    }

    setPayments(db.payments.getAll());
    setOpen(false);
    toast.success("Payment recorded");
  };

  const receiptPayment = receiptId ? payments.find(p => p.id === receiptId) : null;
  const receiptStudent = receiptPayment ? db.students.get(receiptPayment.studentId) : null;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Payments</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Record Payment</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Student</Label>
                  <Select value={form.studentId} onValueChange={v => setForm({ ...form, studentId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
                <div>
                  <Label>Method</Label>
                  <Select value={form.method} onValueChange={v => setForm({ ...form, method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} className="w-full">Record Payment</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Receipt Dialog */}
        <Dialog open={!!receiptId} onOpenChange={() => setReceiptId(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Payment Receipt</DialogTitle></DialogHeader>
            {receiptPayment && receiptStudent && (
              <div className="space-y-4 p-4 border border-border rounded-lg">
                <div className="text-center border-b border-border pb-3">
                  <h3 className="text-lg font-bold text-foreground">MS-CIT Training Center</h3>
                  <p className="text-xs text-muted-foreground">Payment Receipt</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Receipt No:</span><span className="text-foreground font-medium">{receiptPayment.id.toUpperCase()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="text-foreground">{receiptPayment.date}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Student:</span><span className="text-foreground">{receiptStudent.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Amount:</span><span className="text-foreground font-bold">₹{receiptPayment.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Method:</span><span className="text-foreground">{receiptPayment.method}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><span className="text-success font-medium">{receiptPayment.status}</span></div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payments Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Student</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Method</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => {
                    const student = db.students.get(p.studentId);
                    return (
                      <tr key={p.id} className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium text-foreground">{student?.name || "Unknown"}</td>
                        <td className="py-3 px-4 text-foreground">₹{p.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{p.date}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{p.method}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" onClick={() => setReceiptId(p.id)}>
                            <Receipt className="h-4 w-4 mr-1" /> Receipt
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
