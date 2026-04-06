import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db, getAttendancePercent, getAverageMarks } from "@/lib/data";
import { Download } from "lucide-react";
import { toast } from "sonner";

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`${filename} downloaded`);
}

export default function Reports() {
  const students = db.students.getAll();
  const batches = db.batches.getAll();
  const exams = db.exams.getAll();

  const downloadAttendance = () => {
    const headers = ["Name", "Batch", "Attendance %", "Days Present", "Total Days"];
    const rows = students.map(s => {
      const entries = Object.values(s.attendance);
      const present = entries.filter(Boolean).length;
      const batch = db.batches.get(s.batchId);
      return [s.name, batch?.name || "", `${getAttendancePercent(s)}%`, `${present}`, `${entries.length}`];
    });
    downloadCSV("attendance_report.csv", headers, rows);
  };

  const downloadFee = () => {
    const headers = ["Name", "Batch", "Total Fee", "Paid", "Pending", "Status"];
    const rows = students.map(s => {
      const batch = db.batches.get(s.batchId);
      return [s.name, batch?.name || "", `${s.totalFee}`, `${s.paidAmount}`, `${s.totalFee - s.paidAmount}`, s.feeStatus];
    });
    downloadCSV("fee_report.csv", headers, rows);
  };

  const downloadProgress = () => {
    const headers = ["Name", "Batch", "Attendance %", "Avg Marks", "Fee Status"];
    const rows = students.map(s => {
      const batch = db.batches.get(s.batchId);
      return [s.name, batch?.name || "", `${getAttendancePercent(s.id)}%`, `${getAverageMarks(s.id)}`, s.feeStatus];
    });
    downloadCSV("progress_report.csv", headers, rows);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Reports</h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Attendance Report</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {batches.map(b => {
                  const batchStudents = students.filter(s => s.batchId === b.id);
                  const avg = batchStudents.length > 0 ? Math.round(batchStudents.reduce((a, s) => a + getAttendancePercent(s.id), 0) / batchStudents.length) : 0;
                  return (
                    <div key={b.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{b.name.split(" - ")[0]}</span>
                      <span className="font-medium text-foreground">{avg}%</span>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={downloadAttendance}>
                <Download className="h-4 w-4 mr-1" /> Download CSV
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Fee Report</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Fee</span>
                  <span className="font-medium text-foreground">₹{students.reduce((a, s) => a + s.totalFee, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Collected</span>
                  <span className="font-medium text-success">₹{students.reduce((a, s) => a + s.paidAmount, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium text-warning">₹{students.reduce((a, s) => a + (s.totalFee - s.paidAmount), 0).toLocaleString()}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={downloadFee}>
                <Download className="h-4 w-4 mr-1" /> Download CSV
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Progress Report</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium text-foreground">{students.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Marks</span>
                  <span className="font-medium text-foreground">
                    {students.length > 0 ? Math.round(students.reduce((a, s) => a + getAverageMarks(s, exams), 0) / students.length) : 0}%
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={downloadProgress}>
                <Download className="h-4 w-4 mr-1" /> Download CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">All Students Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-2 text-muted-foreground font-medium hidden sm:table-cell">Batch</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Attendance</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Avg Marks</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const batch = db.batches.get(s.batchId);
                    return (
                      <tr key={s.id} className="border-b border-border/50">
                        <td className="py-2 font-medium text-foreground">{s.name}</td>
                        <td className="py-2 text-muted-foreground hidden sm:table-cell">{batch?.name.split(" - ")[0]}</td>
                        <td className="py-2">{getAttendancePercent(s)}%</td>
                        <td className="py-2">{getAverageMarks(s, exams)}%</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.feeStatus === "paid" ? "bg-success/10 text-success" : s.feeStatus === "partial" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                            {s.feeStatus}
                          </span>
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
