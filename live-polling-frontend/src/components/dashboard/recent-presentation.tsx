import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui";
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
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { cn, getStatusColor } from "@/lib";
import { renderSlideContent } from "../editor/SlideCanvas";
import {
  useGetPresentationsQuery,
  useDeletePresentationMutation,
  useDuplicatePresentationMutation,
} from "@/api/presentations.api";
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
      <section className="mb-12 flex h-40 items-center justify-center rounded-[2rem] border border-slate-200/70 bg-white/[0.88] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section>
      <div
        className="fi mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ animationDelay: "0.50s" }}
      >
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
            <LayoutGrid className="size-3.5" />
            Library
          </div>

          <h2 className="text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-white">
            Your Presentations
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {totalPresentations} presentation
            {totalPresentations !== 1 ? "s" : ""} in your workspace
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl bg-white/[0.88] px-4 py-2 text-sm font-semibold text-slate-500 backdrop-blur-xl dark:bg-white/[0.06] dark:text-slate-400 sm:block">
            {filteredPresentations.length} shown
          </div>

          <Button
            variant="outline"
            size="icon-sm"
            className="size-10 rounded-2xl border-slate-200/80 bg-white/70 text-slate-500 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-300 dark:hover:bg-white/[0.08]"
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
        <div
          className="fi flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300/80 bg-white/[0.72] px-6 py-16 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]"
          style={{ animationDelay: "0.56s" }}
        >
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Plus className="size-8 text-primary" />
          </div>

          <h3 className="mb-2 text-xl font-black tracking-[-0.025em] text-slate-950 dark:text-white">
            No presentations yet
          </h3>

          <p className="mb-6 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            Create your first presentation and start building interactive live
            polling sessions.
          </p>

          <Button
            onClick={handleCreateNew}
            className="h-12 rounded-2xl bg-primary px-6 font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Create Presentation
          </Button>
        </div>
      ) : (
        <ScrollArea
          className={cn(
            "mb-4 h-[520px] pb-4",
            viewMode === "list" &&
              "rounded-[2rem] border border-slate-200/70 bg-white/[0.72] p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]",
          )}
        >
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-3"
            }
          >
            {filteredPresentations
              .filter(
                (rawPresentation) =>
                  Array.isArray(rawPresentation.slides) &&
                  rawPresentation.slides.length > 0,
              )
              .map((presentation, index) => (
                <Card
                  key={presentation.id}
                  className={cn(
                    "fi group cursor-pointer overflow-hidden border-slate-200/70 bg-white/[0.88] shadow-none backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.08]",
                    viewMode === "grid"
                      ? "rounded-[1.75rem] p-2"
                      : "flex items-start rounded-2xl",
                  )}
                  style={{ animationDelay: `${0.56 + index * 0.06}s` }}
                  onClick={() => handleOpenPresentation(presentation.id)}
                >
                  <div
                    className={cn(
                      "relative flex items-center justify-center overflow-hidden border border-slate-200/70 bg-slate-50/70 dark:border-white/10",
                      viewMode === "grid"
                        ? "h-40 w-full rounded-[1.35rem]"
                        : "hidden",
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
                    <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent" />

                    <div
                      className={cn(
                        "flex h-full w-full items-center justify-center *:min-h-0",
                        viewMode === "grid" ? "p-2" : "hidden",
                      )}
                    >
                      {renderSlideContent(presentation.slides[0], "card")}
                    </div>
                  </div>

                  <CardContent
                    className={cn(
                      "relative w-full",
                      viewMode === "list"
                        ? "flex flex-1 items-center justify-between p-4 sm:p-5"
                        : "px-2 pb-3 pt-4",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-3 flex w-full items-start justify-between gap-3",
                        viewMode === "list" && "mb-0 gap-4",
                      )}
                    >
                      {viewMode === "list" && (
                        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 bg-primary/10 text-primary dark:border-white/10">
                          <LayoutGrid className="size-5" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "min-w-0 flex-1 space-y-1 text-left",
                          viewMode === "list" && "space-y-1",
                        )}
                      >
                        <h3
                          className={cn(
                            "truncate font-black tracking-[-0.015em] text-slate-900 dark:text-white",
                            viewMode === "grid" ? "text-sm" : "text-base",
                          )}
                        >
                          {presentation.title}{" "}
                          {presentation.isAIGenerated && (
                            <Badge className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-primary shadow-none hover:bg-primary/10">
                              <SparkleIcon
                                className={cn(
                                  "size-3",
                                  viewMode === "list" && "mr-1",
                                )}
                              />
                              AI Generated
                            </Badge>
                          )}
                        </h3>

                        <p
                          className={cn(
                            "text-slate-500 dark:text-slate-400",
                            viewMode === "grid" ? "text-xs" : "text-sm",
                          )}
                        >
                          {presentation.slides.length} slide
                          {presentation.slides.length !== 1 ? "s" : ""} •{" "}
                          {format(new Date(presentation.updatedAt), "MMM d, yyyy")}
                        </p>
                      </div>

                      <div
                        className={cn(
                          viewMode === "list"
                            ? "ml-auto flex items-center gap-4 pl-4"
                            : "",
                        )}
                      >
                        {viewMode === "list" && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              getStatusColor(presentation.status),
                              "rounded-full shadow-none",
                            )}
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
                                "size-9 rounded-xl text-slate-400 opacity-0 transition-all duration-300 hover:bg-primary/10 hover:text-primary group-hover:opacity-100 dark:hover:bg-white/[0.08]",
                                viewMode === "list" &&
                                  "bg-transparent opacity-100",
                              )}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="z-50 w-48 rounded-2xl border border-slate-200/70 bg-white/[0.95] p-2 shadow-none backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"
                          >
                            <DropdownMenuItem
                              className="cursor-pointer rounded-xl font-medium text-slate-600 focus:bg-primary/10 focus:text-primary dark:text-slate-300 dark:focus:bg-white/[0.08] dark:focus:text-secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPresentation(presentation.id);
                              }}
                            >
                              <Pencil className="size-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="cursor-pointer rounded-xl font-medium text-slate-600 focus:bg-primary/10 focus:text-primary dark:text-slate-300 dark:focus:bg-white/[0.08] dark:focus:text-secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicatePresentation(presentation.id);
                              }}
                            >
                              <Copy className="size-4" />
                              Duplicate
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-2 bg-slate-200/70 dark:bg-white/10" />

                            <DropdownMenuItem
                              variant="destructive"
                              className="cursor-pointer rounded-xl"
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
                        className={cn(
                          getStatusColor(presentation.status),
                          "rounded-full shadow-none",
                        )}
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