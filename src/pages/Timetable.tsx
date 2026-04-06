import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/data";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const subjects = [
  "Computer Basics", "MS Word", "MS Excel", "MS PowerPoint",
  "Internet & Email", "Tally Basics", "Practice Lab", "Revision"
];

export default function Timetable() {
  const batches = db.batches.getAll();

  const getSubject = (batchIdx: number, dayIdx: number) => {
    return subjects[(batchIdx * 3 + dayIdx) % subjects.length];
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Timetable</h2>

        {/* Today's Classes */}
        <Card className="border-border bg-primary/5">
          <CardHeader><CardTitle className="text-base text-primary">Today's Classes ({today})</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3">
              {batches.map((b, i) => {
                const isWeekend = b.type === "Weekend" && !["Saturday", "Sunday"].includes(today);
                return (
                  <div key={b.id} className={`p-3 rounded-lg ${isWeekend ? "bg-muted/50" : "bg-card"} border border-border`}>
                    <p className="font-medium text-sm text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.schedule}</p>
                    <p className="text-sm font-medium text-primary mt-2">
                      {isWeekend ? "No class today" : getSubject(i, days.indexOf(today))}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Timetable per batch */}
        {batches.map((b, bIdx) => {
          const trainer = db.trainers.get(b.trainerId);
          const batchDays = b.type === "Weekend" ? ["Saturday", "Sunday"] : days.slice(0, 5);
          return (
            <Card key={b.id} className="border-border">
              <CardHeader>
                <CardTitle className="text-base">{b.name} <span className="font-normal text-muted-foreground text-sm">({trainer?.name})</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {batchDays.map(d => (
                          <th key={d} className={`py-2 px-3 text-left font-medium ${d === today ? "text-primary" : "text-muted-foreground"}`}>{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {batchDays.map((d, dIdx) => (
                          <td key={d} className={`py-3 px-3 ${d === today ? "bg-primary/5 rounded" : ""}`}>
                            <p className="font-medium text-foreground text-xs">{getSubject(bIdx, dIdx)}</p>
                            <p className="text-xs text-muted-foreground mt-1">{b.schedule.split(" ").slice(1).join(" ")}</p>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
