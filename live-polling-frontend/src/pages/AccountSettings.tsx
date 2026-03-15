import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, HelpCircle, Moon, Sun, User } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { openAIModal } from "@/store/editorSlice";
import { addPresentation } from "@/store/presentationsSlice";
import { DEFAULT_THEME } from "@/types/presentation";
import { store } from "@/store";
import DashboardHeader from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type SectionId = "name" | "email" | "notifications" | "appearance" | "language";

export default function AccountSettings() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<SectionId | null>("name");

  // Local account state (in a real app this would come from auth/store)
  const [displayName, setDisplayName] = useState("Logged in user");
  const [email] = useState("kirubeltekle9@gmail.com");
  const [emailVerified] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appearance, setAppearance] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("English");

  const handleCreateNew = () => {
    dispatch(
      addPresentation({
        title: "Untitled Presentation",
        theme: DEFAULT_THEME,
      }),
    );
    setTimeout(() => {
      const state = store.getState();
      const newPresentation = state.presentations.items[0];
      if (newPresentation) {
        navigate(`/editor/${newPresentation.id}`);
      }
    }, 50);
  };

  const sections: {
    id: SectionId;
    title: string;
    subtitle: string;
    badge?: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }[] = [
    {
      id: "name",
      title: "Name & image",
      subtitle: "Logged in as... what's your name again?",
      icon: (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <User className="size-4 text-primary" />
        </div>
      ),
      content: (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-14">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback className="text-lg">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="max-w-sm"
            />
          </div>
        </div>
      ),
    },
    {
      id: "email",
      title: "Email",
      subtitle: email,
      badge: emailVerified ? "Verified" : undefined,
      content: <p className="text-sm text-muted-foreground">{email}</p>,
    },
    {
      id: "notifications",
      title: "Email notifications",
      subtitle: emailNotifications
        ? "All email notifications are turned on"
        : "Email notifications are turned off",
      content: (
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="email-notifications">
              Receive email notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Get updates about your account and activity.
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
      ),
    },
    {
      id: "appearance",
      title: "Appearance",
      subtitle: `You're currently using ${appearance} mode`,
      content: (
        <div className="flex gap-3">
          <Button
            variant={appearance === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setAppearance("light")}
          >
            <Sun className="size-4" />
            Light
          </Button>
          <Button
            variant={appearance === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setAppearance("dark")}
          >
            <Moon className="size-4" />
            Dark
          </Button>
        </div>
      ),
    },
    {
      id: "language",
      title: "Language",
      subtitle: `Your language: ${language}`,
      badge: "New",
      content: (
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dispatch={dispatch}
        openAIModal={() => dispatch(openAIModal())}
        handleCreateNew={handleCreateNew}
      />

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        {/* Left sidebar */}
        <aside className="w-52 shrink-0">
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to home
            </Link>
            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                My profile
              </p>
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Account settings
              </Link>
            </div>
            <Link
              to="#help"
              className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <HelpCircle className="size-4" />
              Help
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <h1 className="mb-8 text-2xl font-semibold">Account settings</h1>
          <div className="space-y-1">
            {sections.map((section) => {
              const isOpen = expanded === section.id;
              return (
                <div key={section.id} className="rounded-lg border bg-card">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : section.id)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:bg-muted/50"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {section.icon}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{section.title}</span>
                          {section.badge && (
                            <Badge
                              variant={
                                section.badge === "Verified"
                                  ? "secondary"
                                  : "default"
                              }
                              className="text-xs"
                            >
                              {section.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {section.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t px-4 py-4">{section.content}</div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
