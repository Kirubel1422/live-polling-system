import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useGetTemplatesQuery } from "@/api/templates.api";
import { ArrowRight, LayoutTemplate, Loader2 } from "lucide-react";

export default function TemplatesList({
  handleCreateFromTemplate,
}: {
  handleCreateFromTemplate: (template: any) => void;
}) {
  const { data: templates, isLoading, isError } = useGetTemplatesQuery();

  if (isLoading) {
    return (
      <section className="mb-12 flex h-40 items-center justify-center rounded-[2rem] border border-slate-200/70 bg-white/[0.88] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  if (isError || !templates) {
    return (
      <section className="mb-12">
        <div className="rounded-[2rem] border border-red-200/70 bg-red-50/80 p-6 text-sm font-semibold text-red-600 backdrop-blur-xl dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          Failed to load templates.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div
        className="fi mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ animationDelay: "0.12s" }}
      >
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
            <LayoutTemplate className="size-3.5" />
            Templates
          </div>

          <h2 className="text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
            Start with a Template
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose a ready-made format and customize it for your session.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-10 rounded-2xl border-slate-200/80 bg-white/70 px-4 font-bold text-primary shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 dark:border-white/10 dark:bg-white/[0.055] dark:hover:bg-white/[0.08]"
        >
          View all
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="rounded-[2rem] border border-slate-200/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] sm:p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {templates.map((template, index) => (
            <Card
              key={template.id}
              className="fi group cursor-pointer overflow-hidden rounded-[1.65rem] border border-slate-200/70 bg-white/[0.88] p-2 shadow-none backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.08]"
              style={{ animationDelay: `${0.18 + index * 0.06}s` }}
              onClick={() => handleCreateFromTemplate(template)}
            >
              <div
                className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-[1.25rem] p-6"
                style={{ background: template.thumbnail }}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent" />

                <div className="relative z-10 text-6xl drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-125 group-hover:-rotate-6">
                  {template.id === "quiz" && "😂"}
                  {template.id === "feedback" && "📝"}
                  {template.id === "brainstorm" && "💡"}
                  {template.id === "poll" && "🗳️"}
                  {template.id === "icebreaker" && "🧊"}
                  {!["quiz", "feedback", "brainstorm", "poll", "icebreaker"].includes(
                    template.id,
                  ) && "✨"}
                </div>
              </div>

              <CardContent className="px-2 pb-2 pt-4">
                <p className="truncate text-sm font-black tracking-[-0.015em] text-slate-900 dark:text-white">
                  {template.title}
                </p>

                <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                  {template.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}