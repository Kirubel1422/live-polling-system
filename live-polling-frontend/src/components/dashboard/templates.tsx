import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useGetTemplatesQuery } from "@/api/templates.api";
import { Loader2 } from "lucide-react";

export default function TemplatesList({
  handleCreateFromTemplate,
}: {
  handleCreateFromTemplate: (template: any) => void;
}) {
  const { data: templates, isLoading, isError } = useGetTemplatesQuery();

  if (isLoading) {
    return (
      <section className="mb-12 flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </section>
    );
  }

  if (isError || !templates) {
    return (
      <section className="mb-12">
        <div className="p-6 bg-red-50 text-red-600 rounded-lg">
          Failed to load templates.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="fi mb-4 flex items-center justify-between" style={{ animationDelay: "0.12s" }}>
        <h2 className="text-lg font-semibold">Start with a Template</h2>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </div>
      <div className="grid bg-primary/10 rounded-2xl p-7 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {templates.map((template, index) => (
          <Card
            key={template.id}
            className="fi group -space-y-6 cursor-pointer overflow-hidden border-none py-0 transition-all shadow-none"
            style={{ animationDelay: `${0.18 + index * 0.06}s` }}
            onClick={() => handleCreateFromTemplate(template)}
          >
            <div
              className="aspect-[4/3] w-full relative flex flex-col items-center justify-center p-6 overflow-hidden"
              style={{ background: template.thumbnail }}
            >
              {/* Decorative background blur */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
              
              {/* Main Emoji Graphic */}
              <div className="relative z-10 text-6xl drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-125 group-hover:-rotate-6">
                {template.id === "quiz" && "😂"}
                {template.id === "feedback" && "📝"}
                {template.id === "brainstorm" && "💡"}
                {template.id === "poll" && "🗳️"}
                {template.id === "icebreaker" && "🧊"}
                {/* Fallback for unknown templates */}
                {(!["quiz", "feedback", "brainstorm", "poll", "icebreaker"].includes(template.id)) && "✨"}
              </div>
            </div>
            <CardContent className="p-3 border-none">
              <p className="font-medium text-sm">{template.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {template.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
