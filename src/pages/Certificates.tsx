import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/data";
import { Award, Download } from "lucide-react";

export default function Certificates() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const certRef = useRef<HTMLDivElement>(null);
  const students = db.students.getAll().filter(s => s.feeStatus === "paid");
  const student = students.find(s => s.id === selectedStudent);
  const batch = student ? db.batches.get(student.batchId) : null;

  const handlePrint = () => {
    if (!certRef.current) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Certificate</title><style>
      body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: white; }
      .cert { width: 800px; padding: 60px; border: 4px double hsl(174, 62%, 32%); text-align: center; font-family: 'Georgia', serif; }
      .cert h1 { font-size: 28px; color: hsl(174, 62%, 32%); margin-bottom: 8px; }
      .cert h2 { font-size: 18px; color: #666; font-weight: normal; margin-bottom: 40px; }
      .cert .name { font-size: 32px; color: hsl(215, 25%, 15%); border-bottom: 2px solid hsl(36, 90%, 55%); display: inline-block; padding: 0 30px 5px; margin: 20px 0; }
      .cert p { color: #555; font-size: 14px; line-height: 1.8; }
      .cert .date { margin-top: 40px; color: #888; font-size: 12px; }
      @media print { body { margin: 0; } }
    </style></head><body>
      <div class="cert">
        <h1>🎓 Certificate of Completion</h1>
        <h2>MS-CIT Training Center</h2>
        <p>This is to certify that</p>
        <div class="name">${student?.name}</div>
        <p>has successfully completed the<br/><strong>Maharashtra State Certificate in Information Technology (MS-CIT)</strong><br/>course from ${batch?.startDate} to ${batch?.endDate}</p>
        <div class="date">Date of Issue: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
      </div>
    </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <h2 className="text-2xl font-bold text-foreground">Certificate Generator</h2>

        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Select a student (only fully paid students are eligible):</p>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {student && batch && (
              <>
                <div ref={certRef} className="p-8 md:p-12 border-4 border-double border-primary rounded-lg text-center">
                  <Award className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-1">Certificate of Completion</h3>
                  <p className="text-sm text-muted-foreground mb-8">MS-CIT Training Center</p>
                  <p className="text-muted-foreground">This is to certify that</p>
                  <p className="text-3xl font-bold text-foreground border-b-2 border-accent inline-block px-6 py-2 my-4">{student.name}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    has successfully completed the<br />
                    <span className="font-semibold text-foreground">Maharashtra State Certificate in Information Technology (MS-CIT)</span><br />
                    course from {batch.startDate} to {batch.endDate}
                  </p>
                  <p className="text-xs text-muted-foreground mt-8">
                    Date of Issue: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <Button onClick={handlePrint} className="w-full">
                  <Download className="h-4 w-4 mr-1" /> Print / Download Certificate
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
