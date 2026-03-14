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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="group cursor-pointer overflow-hidden border-0 py-0 shadow-sm transition-all"
            onClick={() => handleCreateFromTemplate(template.id)}
          >
            <div
              className="aspect-[4/3] w-full"
              style={{ background: template.thumbnail }}
            />
            <CardContent className="p-3">
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
