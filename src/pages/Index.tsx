import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "@/lib/data";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      navigate(auth.role === "admin" ? "/dashboard" : `/student/${auth.userId}`);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p>Redirecting..., if no navigation happens, check console for errors.</p>
    </div>
  );
};

export default Index;
