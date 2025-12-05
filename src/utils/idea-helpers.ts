import { Idea, IdeaStatus } from "@/type/idea";

export function getStatusLabel(status: IdeaStatus): string {
  const labels: Record<IdeaStatus, string> = {
    new: "New Idea",
    check_design: "Check Design",
    check_content: "Check Content",
    done_idea: "Done Idea",
    fix_design: "Fix Design",
    done: "DONE",
  };
  return labels[status] || status;
}

export function getIdeasByStatus(ideas: Idea[]) {
  return {
    new: ideas.filter((i) => i.status === "new"),
    check_design: ideas.filter((i) => i.status === "check_design"),
    check_content: ideas.filter((i) => i.status === "check_content"),
    done_idea: ideas.filter((i) => i.status === "done_idea"),
    fix_design: ideas.filter((i) => i.status === "fix_design"),
    done: ideas.filter((i) => i.status === "done"),
  };
}

