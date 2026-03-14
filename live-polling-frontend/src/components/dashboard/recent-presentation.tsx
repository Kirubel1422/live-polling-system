import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "../ui/button";
import { Copy, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { getStatusColor } from "@/lib";
import {
  deletePresentation,
  duplicatePresentation,
} from "@/store/presentationsSlice";

export default function RecentPresentations({
  searchQuery,
  handleCreateNew,
  handleOpenPresentation,
}: {
  searchQuery: string;
  handleCreateNew: () => void;
  handleOpenPresentation: (id: string) => void;
}) {
  const dispatch = useAppDispatch();
  const presentations = useAppSelector((state) => state.presentations.items);
  const filteredPresentations = presentations.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeletePresentation = (id: string) => {
    dispatch(deletePresentation(id));
  };

  const handleDuplicatePresentation = (id: string) => {
    dispatch(duplicatePresentation(id));
  };
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Presentations</h2>
        <span className="text-sm text-muted-foreground">
          {presentations.length} presentation
          {presentations.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filteredPresentations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Plus className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mb-1 font-medium">No presentations yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first presentation to get started
          </p>
          <Button onClick={handleCreateNew}>
            <Plus className="size-4" />
            Create Presentation
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPresentations.map((presentation) => (
              <Card
                key={presentation.id}
                className="group cursor-pointer overflow-hidden py-0 transition-all hover:shadow-md"
                onClick={() => handleOpenPresentation(presentation.id)}
              >
                <div
                  className="aspect-video w-full"
                  style={{
                    background:
                      presentation.thumbnail ||
                      `linear-gradient(135deg, ${presentation.theme.accentColor}20 0%, ${presentation.theme.accentColor}40 100%)`,
                  }}
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="text-4xl font-bold text-foreground/20">
                      {presentation.slides.length}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {presentation.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {presentation.slides.length} slide
                        {presentation.slides.length !== 1 ? "s" : ""} •{" "}
                        {format(
                          new Date(presentation.updatedAt),
                          "MMM d, yyyy",
                        )}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPresentation(presentation.id);
                          }}
                        >
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicatePresentation(presentation.id);
                          }}
                        >
                          <Copy className="size-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePresentation(presentation.id);
                          }}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(presentation.status)}
                  >
                    {presentation.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </section>
  );
}
