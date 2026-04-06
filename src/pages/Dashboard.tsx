import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db, getAttendancePercent } from "@/lib/data";
import { Users, BookOpen, GraduationCap, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const students = db.students.getAll();
  const batches = db.batches.getAll();
  const trainers = db.trainers.getAll();
  const navigate = useNavigate();

  const totalFee = students.reduce((a, s) => a + s.totalFee, 0);
  const collectedFee = students.reduce((a, s) => a + s.paidAmount, 0);
  const pendingFee = totalFee - collectedFee;

  const feeData = [
    { name: "Collected", value: collectedFee, color: "hsl(142, 70%, 40%)" },
    { name: "Pending", value: pendingFee, color: "hsl(36, 90%, 55%)" },
  ];

  const batchData = batches.map(b => ({
    name: b.name.split(" - ")[0],
    students: students.filter(s => s.batchId === b.id).length,
    capacity: b.capacity,
  }));

  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((a, s) => a + getAttendancePercent(s.id), 0) / students.length)
    : 0;

  const stats = [
    { label: "Total Students", value: students.length, icon: Users, color: "bg-primary/10 text-primary", onClick: () => navigate("/students") },
    { label: "Active Batches", value: batches.length, icon: BookOpen, color: "bg-info/10 text-info", onClick: () => navigate("/batches") },
    { label: "Trainers", value: trainers.length, icon: GraduationCap, color: "bg-success/10 text-success", onClick: () => navigate("/trainers") },
    { label: "Avg Attendance", value: `${avgAttendance}%`, icon: TrendingUp, color: "bg-accent/10 text-accent" },
    { label: "Fee Collected", value: `₹${collectedFee.toLocaleString()}`, icon: CreditCard, color: "bg-success/10 text-success", onClick: () => navigate("/payments") },
    { label: "Fee Pending", value: `₹${pendingFee.toLocaleString()}`, icon: AlertCircle, color: "bg-warning/10 text-warning", onClick: () => navigate("/payments") },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(s => (
            <Card key={s.label} className="cursor-pointer hover:shadow-md transition-shadow border-border" onClick={s.onClick}>
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Batch Enrollment</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={batchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="students" fill="hsl(174, 62%, 32%)" radius={[6, 6, 0, 0]} name="Enrolled" />
                  <Bar dataKey="capacity" fill="hsl(210, 14%, 85%)" radius={[6, 6, 0, 0]} name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Fee Collection</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={feeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {feeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Students */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">Recent Students</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-2 text-muted-foreground font-medium hidden sm:table-cell">Batch</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Fee Status</th>
                    <th className="text-left py-2 text-muted-foreground font-medium hidden md:table-cell">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map(s => {
                    const batch = db.batches.get(s.batchId);
                    return (
                      <tr key={s.id} className="border-b border-border/50 cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/student/${s.id}`)}>
                        <td className="py-2.5 font-medium text-foreground">{s.name}</td>
                        <td className="py-2.5 text-muted-foreground hidden sm:table-cell">{batch?.name.split(" - ")[0]}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.feeStatus === "paid" ? "bg-success/10 text-success" : s.feeStatus === "partial" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                            {s.feeStatus}
                          </span>
                        </td>
                        <td className="py-2.5 text-muted-foreground hidden md:table-cell">{getAttendancePercent(s)}%</td>
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
