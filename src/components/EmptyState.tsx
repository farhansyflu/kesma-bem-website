import { Inbox } from "lucide-react";
import { Reveal } from "./Reveal";

export function EmptyState({ message, reveal = true }: { message: string; reveal?: boolean }) {
  const content = (
    <div className="mt-8 flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-accent/60 bg-paper/70 p-8 text-center">
      <Inbox size={36} strokeWidth={1.5} className="text-teal" aria-hidden />
      <p className="font-medium text-ink">{message}</p>
    </div>
  );

  return reveal ? <Reveal>{content}</Reveal> : content;
}
