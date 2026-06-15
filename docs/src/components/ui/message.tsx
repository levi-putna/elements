"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import type { UIMessage } from "ai";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Streamdown } from "streamdown";

// ============================================================================
// Custom entity plugins for Streamdown
// ============================================================================

/**
 * Renders <person name="Jane Smith" id="123"> tags in AI responses.
 * Usage in markdown: <person name="Jane Smith" id="123">Jane Smith</person>
 */
const personPlugin = {
  name: "person",
  render: ({
    name,
    id,
    children,
  }: {
    name?: string;
    id?: string;
    children?: ReactNode;
  }) => (
    <span
      className="inline-flex items-center gap-1 rounded-sm bg-blue-50 px-1.5 py-0.5 text-blue-700 text-xs font-medium ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800"
      data-entity="person"
      data-id={id}
      data-name={name}
      title={name}
    >
      <svg
        aria-hidden="true"
        className="size-3 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children ?? name}
    </span>
  ),
};

/**
 * Renders <location address="123 Main St" suburb="Sydney"> tags in AI responses.
 * Usage in markdown: <location address="123 Main St" suburb="Sydney">123 Main St</location>
 */
const locationPlugin = {
  name: "location",
  render: ({
    address,
    suburb,
    state,
    children,
  }: {
    address?: string;
    suburb?: string;
    state?: string;
    children?: ReactNode;
  }) => {
    const fullAddress = [address, suburb, state].filter(Boolean).join(", ");
    return (
      <span
        className="inline-flex items-center gap-1 rounded-sm bg-green-50 px-1.5 py-0.5 text-green-700 text-xs font-medium ring-1 ring-green-200 dark:bg-green-950 dark:text-green-300 dark:ring-green-800"
        data-entity="location"
        data-address={address}
        data-suburb={suburb}
        data-state={state}
        title={fullAddress}
      >
        <svg
          aria-hidden="true"
          className="size-3 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {children ?? fullAddress}
      </span>
    );
  },
};

/**
 * Renders <strata-scheme plan="SP12345" name="Sunrise Apartments"> tags in AI responses.
 * Usage in markdown: <strata-scheme plan="SP12345">SP12345</strata-scheme>
 */
const strataSchemePlugin = {
  name: "strata-scheme",
  render: ({
    plan,
    name,
    children,
  }: {
    plan?: string;
    name?: string;
    children?: ReactNode;
  }) => (
    <span
      className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-1.5 py-0.5 text-amber-700 text-xs font-medium ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800"
      data-entity="strata-scheme"
      data-plan={plan}
      data-name={name}
      title={name ?? plan}
    >
      <svg
        aria-hidden="true"
        className="size-3 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="9 22 9 12 15 12 15 22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children ?? plan}
    </span>
  ),
};

// ============================================================================
// Message Components
// ============================================================================

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full max-w-[95%] flex-col gap-2",
      from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
      className
    )}
    {...props}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      "is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm",
      "group-[.is-user]:ml-auto group-[.is-user]:rounded-sm group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
      "group-[.is-assistant]:text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageActionsProps = ComponentProps<"div">;

export const MessageActions = ({
  className,
  children,
  ...props
}: MessageActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export type MessageActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const MessageAction = ({
  tooltip,
  children,
  label,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: MessageActionProps) => {
  const button = (
    <Button size={size} type="button" variant={variant} {...props}>
      {children}
      <span className="sr-only">{label ?? tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

// ============================================================================
// MessageBranch
// ============================================================================

interface MessageBranchContextType {
  currentBranch: number;
  totalBranches: number;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: ReactElement[];
  setBranches: (branches: ReactElement[]) => void;
}

const MessageBranchContext = createContext<MessageBranchContextType | null>(null);

const useMessageBranch = () => {
  const context = useContext(MessageBranchContext);
  if (!context) {
    throw new Error("MessageBranch components must be used within MessageBranch");
  }
  return context;
};

export type MessageBranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};

export const MessageBranch = ({
  defaultBranch = 0,
  onBranchChange,
  className,
  ...props
}: MessageBranchProps) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState<ReactElement[]>([]);

  const handleBranchChange = useCallback(
    (newBranch: number) => {
      setCurrentBranch(newBranch);
      onBranchChange?.(newBranch);
    },
    [onBranchChange]
  );

  const goToPrevious = useCallback(() => {
    handleBranchChange(currentBranch > 0 ? currentBranch - 1 : branches.length - 1);
  }, [currentBranch, branches.length, handleBranchChange]);

  const goToNext = useCallback(() => {
    handleBranchChange(currentBranch < branches.length - 1 ? currentBranch + 1 : 0);
  }, [currentBranch, branches.length, handleBranchChange]);

  const contextValue = useMemo<MessageBranchContextType>(
    () => ({ branches, currentBranch, goToNext, goToPrevious, setBranches, totalBranches: branches.length }),
    [branches, currentBranch, goToNext, goToPrevious]
  );

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <div className={cn("grid w-full gap-2 [&>div]:pb-0", className)} {...props} />
    </MessageBranchContext.Provider>
  );
};

export type MessageBranchContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageBranchContent = ({
  children,
  ...props
}: MessageBranchContentProps) => {
  const { currentBranch, setBranches, branches } = useMessageBranch();
  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]) as ReactElement[],
    [children]
  );

  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [childrenArray, branches, setBranches]);

  return childrenArray.map((branch, index) => (
    <div
      className={cn("grid gap-2 overflow-hidden [&>div]:pb-0", index === currentBranch ? "block" : "hidden")}
      key={branch.key}
      {...props}
    >
      {branch}
    </div>
  ));
};

export type MessageBranchSelectorProps = ComponentProps<typeof ButtonGroup>;

export const MessageBranchSelector = ({ className, ...props }: MessageBranchSelectorProps) => {
  const { totalBranches } = useMessageBranch();
  if (totalBranches <= 1) return null;
  return (
    <ButtonGroup
      className={cn("[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md", className)}
      orientation="horizontal"
      {...props}
    />
  );
};

export type MessageBranchPreviousProps = ComponentProps<typeof Button>;

export const MessageBranchPrevious = ({ children, ...props }: MessageBranchPreviousProps) => {
  const { goToPrevious, totalBranches } = useMessageBranch();
  return (
    <Button
      aria-label="Previous branch"
      disabled={totalBranches <= 1}
      onClick={goToPrevious}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronLeftIcon size={14} />}
    </Button>
  );
};

export type MessageBranchNextProps = ComponentProps<typeof Button>;

export const MessageBranchNext = ({ children, ...props }: MessageBranchNextProps) => {
  const { goToNext, totalBranches } = useMessageBranch();
  return (
    <Button
      aria-label="Next branch"
      disabled={totalBranches <= 1}
      onClick={goToNext}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronRightIcon size={14} />}
    </Button>
  );
};

export type MessageBranchPageProps = HTMLAttributes<HTMLSpanElement>;

export const MessageBranchPage = ({ className, ...props }: MessageBranchPageProps) => {
  const { currentBranch, totalBranches } = useMessageBranch();
  return (
    <ButtonGroupText
      className={cn("border-none bg-transparent text-muted-foreground shadow-none", className)}
      {...props}
    >
      {currentBranch + 1} of {totalBranches}
    </ButtonGroupText>
  );
};

// ============================================================================
// MessageResponse: Streamdown with built-in + custom entity plugins
// ============================================================================

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

const streamdownPlugins = {
  cjk,
  code,
  math,
  mermaid,
  // Custom entity plugins: extend this object to add more entity types
  person: personPlugin,
  location: locationPlugin,
  "strata-scheme": strataSchemePlugin,
};

export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => (
    <Streamdown
      className={cn("size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)}
      plugins={streamdownPlugins}
      {...props}
    />
  ),
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    nextProps.isAnimating === prevProps.isAnimating
);

MessageResponse.displayName = "MessageResponse";

export type MessageToolbarProps = ComponentProps<"div">;

export const MessageToolbar = ({ className, children, ...props }: MessageToolbarProps) => (
  <div
    className={cn("mt-4 flex w-full items-center justify-between gap-4", className)}
    {...props}
  >
    {children}
  </div>
);
