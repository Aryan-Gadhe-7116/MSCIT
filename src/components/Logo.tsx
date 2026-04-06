import { GraduationCap } from "lucide-react";

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
        <GraduationCap className="w-5 h-5" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-none text-foreground">
            MS-CIT
          </span>
          <span className="text-xs text-muted-foreground">
            Institute
          </span>
        </div>
      )}
    </div>
  );
}
