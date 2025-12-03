"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Team } from "@/type/user";
import { teamFormSchema, TeamFormValues } from "@/schema/team.schema";
import { useUsers } from "@/hooks/use-users";

interface CreateTeamDialogProps {
  onSubmit: (
    team: Omit<Team, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

export function CreateTeamDialog({ onSubmit }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users from API - only when dialog is opened
  const {
    users,
    loading: usersLoading,
    refetch: refetchUsers,
  } = useUsers({
    page: 1,
    limit: 1000, // Get all users for selection
  });

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
      memberIds: [],
    },
  });

  const selectedMemberIds = form.watch("memberIds");

  const handleSubmit = async (values: TeamFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const members = users.filter((u) => values.memberIds.includes(u.id));

      await onSubmit({
        name: values.name,
        description: values.description,
        members,
      });

      // Refetch users to sync team data after create
      await refetchUsers();

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating team:", error);
      // Error is already handled in the hook with toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team and assign members.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Development Team" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the team..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memberIds"
              render={() => (
                <FormItem>
                  <FormLabel>Team Members</FormLabel>
                  <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto space-y-2">
                    {usersLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="ml-2 text-sm text-muted-foreground">
                          Loading users...
                        </p>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        No users available
                      </div>
                    ) : (
                      users.map((user) => (
                        <FormField
                          key={user.id}
                          control={form.control}
                          name="memberIds"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(user.id)}
                                  disabled={isSubmitting}
                                  onCheckedChange={(checked) => {
                                    const value = field.value || [];
                                    if (checked) {
                                      field.onChange([...value, user.id]);
                                    } else {
                                      field.onChange(
                                        value.filter((id) => id !== user.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({user.email})
                                </span>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedMemberIds.length} member(s) selected
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || usersLoading || users.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Team"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
