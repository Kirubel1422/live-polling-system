import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { TEMPLATES } from "@/data/mock";

export default function TemplatesList({
  handleCreateFromTemplate,
}: {
  handleCreateFromTemplate: (id: string) => void;
}) {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Start with a Template</h2>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </div>
      <div className="grid bg-primary/10 rounded-2xl p-7 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="group -space-y-6 cursor-pointer overflow-hidden border-none py-0 transition-all shadow-none"
            onClick={() => handleCreateFromTemplate(template.id)}
          >
            <div
              className="aspect-[4/3] w-full"
              style={{ background: template.thumbnail }}
            />
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
