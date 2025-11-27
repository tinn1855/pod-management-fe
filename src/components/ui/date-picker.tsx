"use client";

import * as React from "react";
import { format, startOfDay } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
  align?: "start" | "center" | "end";
  disablePastDates?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Chọn ngày",
  className,
  disabled = false,
  clearable = true,
  align = "start",
  disablePastDates = false,
  fromDate,
  toDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(undefined);
  };

  // Calculate the minimum date
  const minDate = disablePastDates
    ? startOfDay(new Date())
    : fromDate;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">
            {date ? format(date, "dd/MM/yyyy") : placeholder}
          </span>
          {clearable && date && (
            <X
              className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          showOutsideDays={true}
          fixedWeeks={true}
          disabled={minDate ? { before: minDate } : undefined}
          fromDate={minDate}
          toDate={toDate}
        />
      </PopoverContent>
    </Popover>
  );
}

// Form-compatible version
interface DatePickerFormProps {
  value?: string; // ISO date string
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  disablePastDates?: boolean;
}

export function DatePickerForm({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className,
  disabled = false,
  disablePastDates = false,
}: DatePickerFormProps) {
  const date = value ? new Date(value) : undefined;

  const handleDateChange = (newDate: Date | undefined) => {
    onChange(newDate ? newDate.toISOString() : undefined);
  };

  return (
    <DatePicker
      date={date}
      onDateChange={handleDateChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      disablePastDates={disablePastDates}
    />
  );
}
