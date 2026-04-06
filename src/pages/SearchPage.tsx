import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db, getAttendancePercent } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterFee, setFilterFee] = useState("all");
  const [filterAttendance, setFilterAttendance] = useState("all");
  const students = db.students.getAll();
  const batches = db.batches.getAll();
  const navigate = useNavigate();

  const filtered = students.filter(s => {
    const matchQuery = !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.email.toLowerCase().includes(query.toLowerCase()) || s.phone.includes(query);
    const matchBatch = filterBatch === "all" || s.batchId === filterBatch;
    const matchFee = filterFee === "all" || s.feeStatus === filterFee;
    const att = getAttendancePercent(s);
    const matchAtt = filterAttendance === "all" || (filterAttendance === "low" && att < 75) || (filterAttendance === "high" && att >= 75);
    return matchQuery && matchBatch && matchFee && matchAtt;
  });

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-3xl">
        <h2 className="text-2xl font-bold text-foreground">Search & Filter</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, email, or phone..." className="pl-10" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={filterBatch} onValueChange={setFilterBatch}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterFee} onValueChange={setFilterFee}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fee Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAttendance} onValueChange={setFilterAttendance}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Attendance</SelectItem>
              <SelectItem value="high">≥75%</SelectItem>
              <SelectItem value="low">&lt;75%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">{filtered.length} results found</p>

        <div className="space-y-2">
          {filtered.map(s => {
            const batch = db.batches.get(s.batchId);
            return (
              <Card key={s.id} className="border-border cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/student/${s.id}`)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.email} · {batch?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{getAttendancePercent(s)}% att</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.feeStatus === "paid" ? "bg-success/10 text-success" : s.feeStatus === "partial" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                      {s.feeStatus}
                    </span>
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
