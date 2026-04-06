import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser, setAuth, useRegisterUser } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const registerMutation = useRegisterUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "register") {
        const newUser = {
          email,
          password,
          name: name || email.split('@')[0],
          role: "student" as const,
        };
        const user = await registerMutation.mutateAsync(newUser);
        toast.success("Account created! Logging in...");
        setAuth("student", user.id);
        navigate(`/student/${user.id}`);
        return;
      }

      // Login
      const user = await authenticateUser(email, password);
      if (user) {
        setAuth(user.role, user.id);
        navigate(user.role === "admin" ? "/dashboard" : `/student/${user.id}`);
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error(tab === "register" ? "Register error:" : "Login error:", error);
      setError(tab === "register" ? "Registration failed (email may exist)" : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">MS-CIT Manager</CardTitle>
          <p className="text-muted-foreground text-sm">Class Management System</p>
        </CardHeader>
        <CardContent>
          <div className="flex mb-6 rounded-lg bg-muted p-1">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === "login" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === "register" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="your@email.com" 
                required 
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="password" 
                required 
              />
            </div>
            {tab === "register" && (
              <div>
                <Label>Name (optional)</Label>
                <Input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Full name" 
                />
              </div>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : (tab === "login" ? "Login" : "Create Account")}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              {tab === "login" ? "Demo Login:" : "Student registration"}
            </p>
            {tab === "login" && (
              <p className="text-xs text-muted-foreground">
                Admin: admin@mscit.com / admin123
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
