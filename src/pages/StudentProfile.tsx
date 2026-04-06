import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db, getAttendancePercent, getAverageMarks } from "@/lib/data";
import { User, Mail, Phone, MapPin, BookOpen, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StudentProfile() {
  const { id } = useParams();
  const student = db.students.get(id!);
  const exams = db.exams.getAll();
  const batch = student ? db.batches.get(student.batchId) : null;
  const payments = db.payments.getAll().filter(p => p.studentId === id);

  if (!student) return <DashboardLayout><p className="text-muted-foreground">Student not found.</p></DashboardLayout>;

  const attPercent = getAttendancePercent(student.id);
  const avgMarks = getAverageMarks(student.id);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <h2 className="text-2xl font-bold text-foreground">Student Profile</h2>

        {/* Info Card */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 grid sm:grid-cols-2 gap-3">
                <h3 className="text-xl font-bold text-foreground sm:col-span-2">{student.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" />{student.email}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" />{student.phone}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" />{student.address}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2"><BookOpen className="h-4 w-4" />{batch?.name || "N/A"}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />Joined: {student.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{attPercent}%</p>
              <p className="text-xs text-muted-foreground">Attendance</p>
              <Progress value={attPercent} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{avgMarks}%</p>
              <p className="text-xs text-muted-foreground">Avg Marks</p>
              <Progress value={avgMarks} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${student.feeStatus === "paid" ? "text-success" : "text-warning"}`}>
                ₹{student.paidAmount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Paid / ₹{student.totalFee.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <span className={`text-lg font-bold px-3 py-1 rounded-full ${student.feeStatus === "paid" ? "bg-success/10 text-success" : student.feeStatus === "partial" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                {student.feeStatus}
              </span>
              <p className="text-xs text-muted-foreground mt-2">Fee Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Exam Results */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">Exam Results</CardTitle></CardHeader>
          <CardContent>
            {exams.length === 0 ? <p className="text-muted-foreground text-sm">No exams yet.</p> : (
              <div className="space-y-3">
                {exams.map(ex => {
                  const marks = student.marks[ex.id];
                  const passed = marks !== undefined && marks >= ex.passingMarks;
                  return (
                    <div key={ex.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-foreground">{ex.name}</p>
                        <p className="text-xs text-muted-foreground">{ex.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{marks ?? "N/A"}/{ex.totalMarks}</p>
                        {marks !== undefined && (
                          <span className={`text-xs font-medium ${passed ? "text-success" : "text-destructive"}`}>
                            {passed ? "PASS" : "FAIL"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
          <CardContent>
            {payments.length === 0 ? <p className="text-muted-foreground text-sm">No payments recorded.</p> : (
              <div className="space-y-2">
                {payments.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">₹{p.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{p.date} · {p.method}</p>
                    </div>
                    <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded font-medium">{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
