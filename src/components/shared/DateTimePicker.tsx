// Libraries
import { format } from "date-fns";
// UI
import { CalendarIcon } from "lucide-react";
import { cn } from "../../libs/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "../ui/calendar";
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// Hooks
import { useState } from "react";

interface DateTimePickerProps {
  dueDate: string | null;
  syncLocalAssessmentChanges?: (date: string) => void;
  setLocalDueDate?: React.Dispatch<React.SetStateAction<string | null>>;
  enableHours: boolean
}

export function DateTimePicker({ dueDate, setLocalDueDate, syncLocalAssessmentChanges, enableHours }: DateTimePickerProps) {
  // States
  //  values
  const [date, setDate] = useState<Date | null>(dueDate ? new Date(dueDate) : null);
  const hours = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  //  conditionals
  const [isOpen, setIsOpen] = useState(false);
 
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (syncLocalAssessmentChanges) {
        syncLocalAssessmentChanges(selectedDate.toISOString())
      }
      if (setLocalDueDate) {
        setLocalDueDate(selectedDate.toISOString())
      }
      if (!enableHours) {
        setIsOpen(false);
      }
    }
  };
 
  const handleTimeChange = (type: "hour" | "minute" | "ampm", value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        newDate.setHours(
          value === "PM" ? currentHours + 12 : currentHours - 12
        );
      }
      setDate(newDate);
      if (syncLocalAssessmentChanges) {
        syncLocalAssessmentChanges(newDate.toISOString())
      }
      if (setLocalDueDate) {
        setLocalDueDate(newDate.toISOString())
      }
    }
  };

  function displayFormattedDate() {
    let displayDate = "Date Unavailable";
    
    if (date) {
      if (!enableHours) {
        displayDate = format(date, `MMM dd, yyyy`);
      } else {
        displayDate = format(date, `MMM dd, yyyy '@' hh:mma`);
      }
    }

    return displayDate
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn(
            "justify-start text-left font-normal w-full",
            !date && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayFormattedDate()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 border border-slate-300 rounded-lg">
        <div className="sm:flex border border-slate-200 rounded-md p-3">
          <Calendar
            mode="single"
            selected={date ? date : today}
            onSelect={handleDateSelect}
            initialFocus
          />
          {enableHours && 
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 p-2 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 p-2 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 61 }, (_, i) => (i)).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="p-2">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            </div>}
        </div>
      </PopoverContent>
    </Popover>
  );
}