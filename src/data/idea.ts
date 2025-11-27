import { Idea, IdeaStatus, Design, KanbanColumn } from "@/type/idea";
import { mockUsers } from "./user";

// Mock Ideas data
export const mockIdeas: Idea[] = [
  {
    id: "idea-1",
    title: "T-Shirt Design - Summer Collection",
    description:
      "Thiết kế áo thun theo chủ đề mùa hè với các họa tiết tropical",
    status: "new",
    priority: "high",
    references: [
      {
        id: "ref-1",
        url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
        name: "Reference 1",
        type: "image",
      },
    ],
    comments: [],
    assignee: mockUsers[3], // Designer
    createdBy: mockUsers[1], // Seller
    tags: ["summer", "tropical", "t-shirt"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "idea-2",
    title: "Mug Design - Coffee Lovers",
    description: "Thiết kế cốc cho những người yêu cà phê với các quote thú vị",
    status: "check_design",
    priority: "medium",
    references: [
      {
        id: "ref-2",
        url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
        name: "Coffee mug reference",
        type: "image",
      },
    ],
    comments: [
      {
        id: "comment-1",
        content: "Cần thêm màu sắc ấm hơn",
        author: mockUsers[1],
        createdAt: "2024-01-16",
        updatedAt: "2024-01-16",
      },
    ],
    assignee: mockUsers[4], // Designer 2
    createdBy: mockUsers[1],
    tags: ["mug", "coffee", "quote"],
    createdAt: "2024-01-14",
    updatedAt: "2024-01-16",
  },
  {
    id: "idea-3",
    title: "Phone Case - Minimalist Art",
    description: "Ốp điện thoại với phong cách tối giản, line art",
    status: "check_content",
    priority: "low",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[2], // Seller 2
    tags: ["phone case", "minimalist", "line art"],
    createdAt: "2024-01-13",
    updatedAt: "2024-01-17",
  },
  {
    id: "idea-4",
    title: "Poster - Motivational Quotes",
    description:
      "Poster với các câu nói truyền cảm hứng, phong cách typography",
    status: "done_idea",
    priority: "medium",
    references: [
      {
        id: "ref-3",
        url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
        name: "Typography poster",
        type: "image",
      },
    ],
    comments: [
      {
        id: "comment-2",
        content: "Rất đẹp! Approved!",
        author: mockUsers[1],
        createdAt: "2024-01-18",
        updatedAt: "2024-01-18",
      },
    ],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["poster", "motivational", "typography"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "idea-5",
    title: "Hoodie - Street Style",
    description: "Áo hoodie phong cách đường phố với graffiti art",
    status: "fix_design",
    priority: "urgent",
    references: [
      {
        id: "ref-4",
        url: "https://images.unsplash.com/photo-1556906781-9a412961c28c",
        name: "Street style ref",
        type: "image",
      },
    ],
    comments: [
      {
        id: "comment-3",
        content: "Cần sửa lại màu background",
        author: mockUsers[1],
        createdAt: "2024-01-19",
        updatedAt: "2024-01-19",
      },
    ],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["hoodie", "street", "graffiti"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-19",
  },
  {
    id: "idea-6",
    title: "Tote Bag - Eco Friendly",
    description: "Túi vải với thông điệp bảo vệ môi trường",
    status: "done",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["tote bag", "eco", "environment"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20",
  },
  {
    id: "idea-7",
    title: "Sticker Pack - Cute Animals",
    description: "Bộ sticker động vật dễ thương theo phong cách kawaii",
    status: "new",
    priority: "low",
    references: [
      {
        id: "ref-5",
        url: "https://images.unsplash.com/photo-1535591273668-578e31182c4f",
        name: "Kawaii style",
        type: "image",
      },
    ],
    comments: [],
    createdBy: mockUsers[2],
    tags: ["sticker", "cute", "kawaii", "animals"],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "idea-8",
    title: "Canvas Print - Abstract Art",
    description: "Tranh canvas nghệ thuật trừu tượng với màu sắc bold",
    status: "check_design",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[1],
    tags: ["canvas", "abstract", "art"],
    createdAt: "2024-01-18",
    updatedAt: "2024-01-21",
  },
];

// Mock Designs data
export const mockDesigns: Design[] = [
  {
    id: "design-1",
    ideaId: "idea-6",
    title: "Tote Bag - Eco Friendly Final",
    description: "File thiết kế cuối cùng cho túi vải eco",
    status: "approved",
    files: [
      {
        id: "file-1",
        name: "tote-bag-eco-v1.psd",
        url: "/designs/tote-bag-eco-v1.psd",
        type: "psd",
        size: 15000000,
        folder: "Tote Bags",
        uploadedBy: mockUsers[4],
        uploadedAt: "2024-01-19",
      },
      {
        id: "file-2",
        name: "tote-bag-eco-v1.png",
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363",
        type: "png",
        size: 2500000,
        folder: "Tote Bags",
        uploadedBy: mockUsers[4],
        uploadedAt: "2024-01-19",
      },
    ],
    comments: [],
    designer: mockUsers[4],
    reviewer: mockUsers[1],
    createdAt: "2024-01-18",
    updatedAt: "2024-01-20",
  },
  {
    id: "design-2",
    ideaId: "idea-4",
    title: "Motivational Poster - Typography",
    description: "Poster truyền cảm hứng với typography",
    status: "approved",
    files: [
      {
        id: "file-3",
        name: "poster-motivation.ai",
        url: "/designs/poster-motivation.ai",
        type: "ai",
        size: 8000000,
        folder: "Posters",
        uploadedBy: mockUsers[4],
        uploadedAt: "2024-01-17",
      },
    ],
    comments: [],
    designer: mockUsers[4],
    reviewer: mockUsers[1],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
  },
  {
    id: "design-3",
    ideaId: "idea-5",
    title: "Street Hoodie - Draft",
    description: "Bản draft hoodie street style",
    status: "revision",
    files: [
      {
        id: "file-4",
        name: "hoodie-street-draft.psd",
        url: "/designs/hoodie-street-draft.psd",
        type: "psd",
        size: 20000000,
        folder: "Hoodies",
        uploadedBy: mockUsers[3],
        uploadedAt: "2024-01-18",
      },
    ],
    comments: [
      {
        id: "design-comment-1",
        content: "Background quá tối, cần điều chỉnh lại",
        author: mockUsers[1],
        createdAt: "2024-01-19",
        updatedAt: "2024-01-19",
      },
    ],
    designer: mockUsers[3],
    reviewer: mockUsers[1],
    createdAt: "2024-01-17",
    updatedAt: "2024-01-19",
  },
];

// Kanban columns configuration
export const kanbanColumns: KanbanColumn[] = [
  {
    id: "new",
    title: "New Idea",
    color: "#3b82f6", // blue
    ideas: [],
  },
  {
    id: "check_design",
    title: "Check Design",
    color: "#f59e0b", // amber
    ideas: [],
  },
  {
    id: "check_content",
    title: "Check Content",
    color: "#8b5cf6", // violet
    ideas: [],
  },
  {
    id: "done_idea",
    title: "Done Idea",
    color: "#10b981", // emerald
    ideas: [],
  },
  {
    id: "fix_design",
    title: "Fix Design",
    color: "#ef4444", // red
    ideas: [],
  },
  {
    id: "done",
    title: "DONE",
    color: "#22c55e", // green
    ideas: [],
  },
];

// Helper function to group ideas by status
export const getIdeasByStatus = (ideas: Idea[]): KanbanColumn[] => {
  return kanbanColumns.map((column) => ({
    ...column,
    ideas: ideas.filter((idea) => idea.status === column.id),
  }));
};

// Helper function to get status label
export const getStatusLabel = (status: IdeaStatus): string => {
  const labels: Record<IdeaStatus, string> = {
    new: "New Idea",
    check_design: "Check Design",
    check_content: "Check Content",
    done_idea: "Done Idea",
    fix_design: "Fix Design",
    done: "DONE",
  };
  return labels[status];
};

// Helper function to get status color
// export const getStatusColor = (status: IdeaStatus): string => {
//   const colors: Record<IdeaStatus, string> = {
//     new: "#3b82f6",
//     check_design: "#f59e0b",
//     check_content: "#8b5cf6",
//     done_idea: "#10b981",
//     fix_design: "#ef4444",
//     done: "#22c55e",
//   };
//   return colors[status];
// };

// Priority colors
export const getPriorityColor = (priority: Idea["priority"]): string => {
  const colors = {
    low: "#6b7280",
    medium: "#3b82f6",
    high: "#f59e0b",
    urgent: "#ef4444",
  };
  return colors[priority];
};
