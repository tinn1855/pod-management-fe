"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Plus, X, Upload } from "lucide-react";
import { useState } from "react";
import { Idea, PRIORITY_ORDER } from "@/type/idea";
import { User } from "@/type/user";
import { mockUsers } from "@/data/user";
import { IdeaFormValues } from "@/schema/idea.schema";
import { getPriorityLabel, getInitials } from "@/utils/format";
import { useIdeaForm } from "@/hooks/use-idea-form";
import { useReferences } from "@/hooks/use-references";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CreateIdeaDialogProps {
  designers: User[];
  onSubmit: (
    idea: Omit<Idea, "id" | "createdAt" | "updatedAt" | "comments">
  ) => void;
}

export function CreateIdeaDialog({
  designers,
  onSubmit,
}: CreateIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [deadlinePopoverOpen, setDeadlinePopoverOpen] = useState(false);

  const { form, resetForm } = useIdeaForm();
  const { references, addReference, removeReference, resetReferences } =
    useReferences();

  const handleSubmit = (values: IdeaFormValues) => {
    const assignee = designers.find((d) => d.id === values.assigneeId);
    const createdBy = mockUsers[1]; // Current user (Seller)

    const tags = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      title: values.title,
      description: values.description,
      status: "new",
      priority: values.priority,
      references,
      assignee,
      createdBy,
      tags,
      deadline: values.deadline || undefined,
    });

    resetForm();
    resetReferences();
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
      resetReferences();
      setDeadlinePopoverOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Idea</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new idea and assign to a designer
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g: T-Shirt Design - Summer Collection"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description about the idea, design requirements..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITY_ORDER.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {getPriorityLabel(priority)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Designer</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? undefined : value)
                      }
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select designer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {designers.map((designer) => (
                          <SelectItem key={designer.id} value={designer.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={designer.avatar} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(designer.name)}
                                </AvatarFallback>
                              </Avatar>
                              {designer.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-1">
                      Deadline
                    </FormLabel>
                    <Popover
                      open={deadlinePopoverOpen}
                      onOpenChange={setDeadlinePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>Select deadline</span>
                            )}
                            <CalendarIcon
                              size={12}
                              className="ml-auto opacity-50"
                            />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(date?.toISOString() || "");
                            setDeadlinePopoverOpen(false);
                          }}
                          initialFocus
                          showOutsideDays={true}
                          fixedWeeks={true}
                          disabled={{ before: new Date() }}
                          fromDate={new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g: summer, tropical, t-shirt"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* References */}
            <div>
              <FormLabel className="mb-2 block">Reference Images</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {references.map((ref) => (
                  <div
                    key={ref.id}
                    className="relative group w-32 h-32 rounded-md overflow-hidden border"
                  >
                    <Image
                      src={ref.url}
                      alt={ref.name}
                      className="object-cover"
                      fill
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeReference(ref.id)}
                      className="absolute top-1 right-1"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addReference}
                  className="w-32 h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload />
                  <span className="text-xs mt-1">Add</span>
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Idea</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
