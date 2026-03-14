import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function DashboardHeader({
  searchQuery,
  setSearchQuery,
  dispatch,
  openAIModal,
  handleCreateNew,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  dispatch: (action: any) => void;
  openAIModal: () => void;
  handleCreateNew: () => void;
}) {
  return (
    <header className="bg-background/95 mt-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-20 items-center justify-center rounded-xl">
            <img src="/main-logo.png" alt="logo" />
          </div>
          <span className="text-xl text-gray-600 dark:text-neutral-100 font-semibold">
            Live Polling System
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search presentations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-200 rounded-xl border-none py-4 dark:bg-neutral-700 placeholder:text-gray-600 placeholder:text-[13px] dark:placeholder:text-neutral-100"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="shadcn"
                  />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheckIcon />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutIcon />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
