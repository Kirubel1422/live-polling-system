import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "../ui/button";
import {
  Copy,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  SparkleIcon,
  Trash2,
} from "lucide-react";
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
import { cn, getStatusColor } from "@/lib";
import {
  deletePresentation,
  duplicatePresentation,
} from "@/store/presentationsSlice";
import { renderSlideContent } from "../editor/SlideCanvas";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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

  const totalPresentations = presentations.filter(
    (pres) => Array.isArray(pres.slides) && pres.slides.length > 0,
  ).length;
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Presentations</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {totalPresentations} presentation
            {totalPresentations !== 1 ? "s" : ""}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-1"
            onClick={() =>
              setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
            }
            aria-label={
              viewMode === "grid"
                ? "Switch to list view"
                : "Switch to grid view"
            }
          >
            {viewMode === "grid" ? (
              <List className="size-4" />
            ) : (
              <LayoutGrid className="size-4" />
            )}
          </Button>
        </div>
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
        <ScrollArea className="h-[400px] mb-4 pb-4">
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-4 bg-primary/10 p-7 rounded-2xl"
            }
          >
            {filteredPresentations
              .filter(
                (rawPresentation) =>
                  Array.isArray(rawPresentation.slides) &&
                  rawPresentation.slides.length > 0,
              )
              .map((presentation) => (
                <Card
                  key={presentation.id}
                  className={`group cursor-pointer rounded-none overflow-hidden py-0 transition-all border-none shadow-none ${
                    viewMode === "list" && "flex border rounded-2xl"
                  }`}
                  onClick={() => handleOpenPresentation(presentation.id)}
                >
                  <div
                    className={
                      viewMode === "grid"
                        ? "flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border"
                        : "hidden"
                    }
                    style={
                      Array.isArray(presentation.slides) &&
                      presentation.slides.length > 0
                        ? {
                            backgroundColor:
                              presentation.slides[0].theme.backgroundColor,
                          }
                        : undefined
                    }
                  >
                    <div className="flex h-full w-full items-center justify-center p-2 *:min-h-0">
                      {renderSlideContent(presentation.slides[0], "card")}
                    </div>
                  </div>

                  <CardContent
                    className={`${viewMode === "list" ? "flex-1 p-6" : "px-4 pb-3"} relative`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div
                        className={cn(
                          "flex-1 space-y-1 min-w-0",
                          viewMode == "list" && "space-y-3",
                        )}
                      >
                        <h3
                          className={cn(
                            "truncate text-sm",
                            viewMode == "grid" && "font-medium",
                          )}
                        >
                          {presentation.title}{" "}
                          {presentation.isAIGenerated && (
                            <Badge className="ml-2 bg-blue-500/80">
                              <SparkleIcon />
                              AI Generated
                            </Badge>
                          )}
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
                        <DropdownMenuTrigger
                          onClick={(e) => e.stopPropagation()}
                        >
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
