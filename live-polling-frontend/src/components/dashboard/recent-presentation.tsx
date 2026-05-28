import { useState } from "react";
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
import { renderSlideContent } from "../editor/SlideCanvas";
import { useGetPresentationsQuery, useDeletePresentationMutation, useDuplicatePresentationMutation } from "@/api/presentations.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RecentPresentations({
  searchQuery,
  handleCreateNew,
  handleOpenPresentation,
}: {
  searchQuery: string;
  handleCreateNew: () => void;
  handleOpenPresentation: (id: string) => void;
}) {
  const { data: presentations = [], isLoading } = useGetPresentationsQuery();
  const [deletePresentationApi] = useDeletePresentationMutation();
  const [duplicatePresentationApi] = useDuplicatePresentationMutation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredPresentations = presentations.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeletePresentation = async (id: string) => {
    try {
      await deletePresentationApi(id).unwrap();
      toast.success("Presentation deleted");
    } catch (e) {
      toast.error("Failed to delete presentation");
    }
  };

  const handleDuplicatePresentation = async (id: string) => {
    try {
      await duplicatePresentationApi(id).unwrap();
      toast.success("Presentation duplicated");
    } catch (e) {
      toast.error("Failed to duplicate presentation");
    }
  };

  const totalPresentations = presentations.filter(
    (pres) => Array.isArray(pres.slides) && pres.slides.length > 0,
  ).length;

  if (isLoading) {
    return (
      <section className="mb-12 flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </section>
    );
  }
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

      {totalPresentations === 0 ? (
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
        <ScrollArea className={cn(
          "h-[520px] mb-4 pb-4",
          viewMode === "list" && "bg-primary/10 p-4 rounded-xl"
        )}>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-3"
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
                  className={cn(
                    "group cursor-pointer overflow-hidden transition-all duration-300",
                    viewMode === "grid"
                      ? "rounded-none py-0 border-none shadow-none"
                      : "flex items-start border border-border/50 bg-card rounded-xl"
                  )}
                  onClick={() => handleOpenPresentation(presentation.id)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center overflow-hidden border",
                      viewMode === "grid"
                        ? "h-36 w-full rounded-2xl"
                        : "hidden" // Completely hide thumbnail in list view
                    )}
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
                    <div className={cn(
                      "flex h-full w-full items-center justify-center *:min-h-0",
                      viewMode === "grid" ? "p-2" : "hidden"
                    )}>
                      {renderSlideContent(presentation.slides[0], "card")}
                    </div>
                  </div>

                  <CardContent
                    className={cn(
                      "relative w-full",
                      viewMode === "list" ? "flex flex-1 items-center justify-between p-4 sm:p-5" : "px-2 pb-4"
                    )}
                  >
                    <div className={cn("mb-2 flex w-full items-start justify-between", viewMode === "list" && "mb-0 gap-4")}>
                      {viewMode === "list" && (
                        <div className="flex h-10 w-10 mt-0.5 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground border">
                          <LayoutGrid className="size-5" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "flex-1 space-y-1 min-w-0 text-left",
                          viewMode === "list" && "space-y-1"
                        )}
                      >
                        <h3
                          className={cn(
                            "truncate",
                            viewMode === "grid" ? "text-sm font-medium" : "text-base font-medium transition-colors"
                          )}
                        >
                          {presentation.title}{" "}
                          {presentation.isAIGenerated && (
                            <Badge className="ml-2 bg-blue-500/80">
                              <SparkleIcon className={cn("size-3", viewMode === "list" && "mr-1")} />
                              AI Generated
                            </Badge>
                          )}
                        </h3>
                        <p className={cn("text-muted-foreground", viewMode === "grid" ? "text-xs" : "text-sm")}>
                          {presentation.slides.length} slide
                          {presentation.slides.length !== 1 ? "s" : ""} •{" "}
                          {format(
                            new Date(presentation.updatedAt),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>

                      <div className={cn(viewMode === "list" ? "flex items-center gap-4 pl-4 ml-auto" : "")}>
                        {viewMode === "list" && (
                          <Badge
                            variant="secondary"
                            className={cn(getStatusColor(presentation.status), "shadow-sm")}
                          >
                            {presentation.status}
                          </Badge>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className={cn(
                                "opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground",
                                viewMode === "list" && "bg-transparent hover:bg-muted"
                              )}
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
                    </div>

                    {viewMode === "grid" && (
                      <Badge
                        variant="secondary"
                        className={getStatusColor(presentation.status)}
                      >
                        {presentation.status}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </ScrollArea>
      )}
    </section>
  );
}
