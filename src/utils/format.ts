import { isPast, isToday, isTomorrow } from "date-fns";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import { Priority, PRIORITY_ORDER } from "@/type/idea";

/**
 * Get initials from a name string
 * @example getInitials("John Doe") => "JD"
 */
export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/**
 * Deadline status result type
 */
export interface DeadlineStatus {
  icon: LucideIcon;
  className: string;
  label?: string;
  color?: string;
}

/**
 * Get deadline status styling based on the deadline date
 * Returns icon and className for styling
 */
export const getDeadlineStatus = (deadline: string): DeadlineStatus => {
  const deadlineDate = new Date(deadline);
  const isOverdue = isPast(deadlineDate) && !isToday(deadlineDate);
  const isDueToday = isToday(deadlineDate);

  if (isOverdue) {
    return {
      icon: Clock,
      className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      label: "Overdue",
      color: "text-red-500",
    };
  }

  if (isDueToday) {
    return {
      icon: Calendar,
      className:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      label: "Due today",
      color: "text-amber-500",
    };
  }

  return {
    icon: Calendar,
    className: "bg-muted text-muted-foreground",
  };
};

/**
 * Get detailed deadline status with label for display
 * Used in detail dialogs with more info
 */
export const getDetailedDeadlineStatus = (
  deadline: string
): DeadlineStatus | null => {
  const deadlineDate = new Date(deadline);
  const isOverdue = isPast(deadlineDate) && !isToday(deadlineDate);
  const isDueToday = isToday(deadlineDate);
  const isDueTomorrow = isTomorrow(deadlineDate);

  if (isOverdue) {
    return {
      icon: AlertCircle,
      className: "text-red-500",
      label: "Overdue",
      color: "text-red-500",
    };
  }

  if (isDueToday) {
    return {
      icon: Clock,
      className: "text-amber-500",
      label: "Due today",
      color: "text-amber-500",
    };
  }

  if (isDueTomorrow) {
    return {
      icon: CheckCircle2,
      className: "text-blue-500",
      label: "Due tomorrow",
      color: "text-blue-500",
    };
  }

  return null;
};

/**
 * Priority labels for display
 */
export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

/**
 * Get priority label for display
 * @example getPriorityLabel("high") => "High"
 */
export const getPriorityLabel = (priority: Priority): string => {
  return PRIORITY_LABELS[priority];
};

/**
 * Get all priority options for select/dropdown
 */
export const getPriorityOptions = () => {
  return PRIORITY_ORDER.map((priority) => ({
    value: priority,
    label: PRIORITY_LABELS[priority],
  }));
};
