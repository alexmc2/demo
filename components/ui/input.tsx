// components/ui/input.tsx
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-md border border-input bg-white px-3 py-2 text-base shadow-none transition-colors file:inline-flex file:h-8 file:items-center file:justify-center file:rounded-md file:border-0 file:bg-muted file:px-3 file:text-sm file:font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 md:text-sm",
        "focus-visible:border-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-200 focus-visible:ring-offset-0",
        "dark:border-input/70 dark:bg-background dark:focus-visible:border-slate-400 dark:focus-visible:ring-slate-500/30",
        "aria-invalid:border-destructive aria-invalid:outline-destructive/40 aria-invalid:ring-destructive/20 aria-invalid:focus-visible:ring-destructive/30 aria-invalid:focus-visible:border-destructive",
        "dark:aria-invalid:border-destructive dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 dark:aria-invalid:focus-visible:ring-destructive/40",
        className
      )}
      {...props}
    />
  );
}

export { Input };
