import { User, Role, Permission, Team, PermissionModule } from "@/type/user";

// ============================================
// PERMISSIONS - Based on POD Workflow
// ============================================

export const mockPermissions: Permission[] = [
  // Orders Module - Quản lý đơn hàng
  {
    id: "perm-orders-create",
    name: "orders.create",
    description: "Nhận và tạo đơn hàng mới",
    module: "Orders",
    actions: ["create"],
  },
  {
    id: "perm-orders-read",
    name: "orders.read",
    description: "Xem danh sách đơn hàng",
    module: "Orders",
    actions: ["read"],
  },
  {
    id: "perm-orders-update",
    name: "orders.update",
    description: "Cập nhật trạng thái đơn hàng",
    module: "Orders",
    actions: ["update"],
  },
  {
    id: "perm-orders-delete",
    name: "orders.delete",
    description: "Xóa đơn hàng",
    module: "Orders",
    actions: ["delete"],
  },

  // Designs Module - Quản lý thiết kế
  {
    id: "perm-designs-create",
    name: "designs.create",
    description: "Tạo mẫu thiết kế mới",
    module: "Designs",
    actions: ["create"],
  },
  {
    id: "perm-designs-read",
    name: "designs.read",
    description: "Xem thiết kế",
    module: "Designs",
    actions: ["read"],
  },
  {
    id: "perm-designs-update",
    name: "designs.update",
    description: "Chỉnh sửa thiết kế",
    module: "Designs",
    actions: ["update"],
  },
  {
    id: "perm-designs-delete",
    name: "designs.delete",
    description: "Xóa thiết kế",
    module: "Designs",
    actions: ["delete"],
  },
  {
    id: "perm-designs-approve",
    name: "designs.approve",
    description: "Duyệt file thiết kế",
    module: "Designs",
    actions: ["update"],
  },
  {
    id: "perm-designs-upload",
    name: "designs.upload",
    description: "Upload file thiết kế hoàn thiện",
    module: "Designs",
    actions: ["create"],
  },

  // Tasks Module - Quản lý công việc
  {
    id: "perm-tasks-create",
    name: "tasks.create",
    description: "Tạo task mới cho Designer",
    module: "Tasks",
    actions: ["create"],
  },
  {
    id: "perm-tasks-read",
    name: "tasks.read",
    description: "Xem danh sách task",
    module: "Tasks",
    actions: ["read"],
  },
  {
    id: "perm-tasks-update",
    name: "tasks.update",
    description: "Cập nhật trạng thái task",
    module: "Tasks",
    actions: ["update"],
  },
  {
    id: "perm-tasks-assign",
    name: "tasks.assign",
    description: "Giao task cho Designer",
    module: "Tasks",
    actions: ["update"],
  },
  {
    id: "perm-tasks-review",
    name: "tasks.review",
    description: "Review và feedback task",
    module: "Tasks",
    actions: ["update"],
  },

  // Production Module - Quản lý sản xuất
  {
    id: "perm-production-read",
    name: "production.read",
    description: "Xem lệnh in và thông tin sản xuất",
    module: "Production",
    actions: ["read"],
  },
  {
    id: "perm-production-update",
    name: "production.update",
    description: "Cập nhật trạng thái sản xuất",
    module: "Production",
    actions: ["update"],
  },
  {
    id: "perm-production-tracking",
    name: "production.tracking",
    description: "Tracking tiến độ sản xuất",
    module: "Production",
    actions: ["read"],
  },
  {
    id: "perm-production-batch",
    name: "production.batch",
    description: "Xem batch theo SKU",
    module: "Production",
    actions: ["read"],
  },

  // Listings Module - Quản lý listing sản phẩm
  {
    id: "perm-listings-create",
    name: "listings.create",
    description: "Tạo listing sản phẩm mới",
    module: "Listings",
    actions: ["create"],
  },
  {
    id: "perm-listings-read",
    name: "listings.read",
    description: "Xem danh sách listing",
    module: "Listings",
    actions: ["read"],
  },
  {
    id: "perm-listings-update",
    name: "listings.update",
    description: "Cập nhật listing",
    module: "Listings",
    actions: ["update"],
  },
  {
    id: "perm-listings-delete",
    name: "listings.delete",
    description: "Xóa listing",
    module: "Listings",
    actions: ["delete"],
  },

  // Suppliers Module - Quản lý supplier
  {
    id: "perm-suppliers-read",
    name: "suppliers.read",
    description: "Xem danh sách supplier",
    module: "Suppliers",
    actions: ["read"],
  },
  {
    id: "perm-suppliers-send",
    name: "suppliers.send",
    description: "Gửi thiết kế cho supplier",
    module: "Suppliers",
    actions: ["create"],
  },

  // Dashboard & Reports Module
  {
    id: "perm-dashboard-read",
    name: "dashboard.read",
    description: "Xem dashboard",
    module: "Dashboard",
    actions: ["read"],
  },
  {
    id: "perm-dashboard-kpi",
    name: "dashboard.kpi",
    description: "Xem KPI và báo cáo chi tiết",
    module: "Dashboard",
    actions: ["read"],
  },
  {
    id: "perm-dashboard-realtime",
    name: "dashboard.realtime",
    description: "Xem dashboard real-time",
    module: "Dashboard",
    actions: ["read"],
  },

  // Users Module - Quản lý tài khoản
  {
    id: "perm-users-create",
    name: "users.create",
    description: "Tạo tài khoản mới",
    module: "Users",
    actions: ["create"],
  },
  {
    id: "perm-users-read",
    name: "users.read",
    description: "Xem danh sách người dùng",
    module: "Users",
    actions: ["read"],
  },
  {
    id: "perm-users-update",
    name: "users.update",
    description: "Cập nhật thông tin người dùng",
    module: "Users",
    actions: ["update"],
  },
  {
    id: "perm-users-delete",
    name: "users.delete",
    description: "Xóa tài khoản",
    module: "Users",
    actions: ["delete"],
  },

  // Teams Module - Điều phối team
  {
    id: "perm-teams-create",
    name: "teams.create",
    description: "Tạo team mới",
    module: "Teams",
    actions: ["create"],
  },
  {
    id: "perm-teams-read",
    name: "teams.read",
    description: "Xem danh sách team",
    module: "Teams",
    actions: ["read"],
  },
  {
    id: "perm-teams-update",
    name: "teams.update",
    description: "Cập nhật team",
    module: "Teams",
    actions: ["update"],
  },
  {
    id: "perm-teams-manage",
    name: "teams.manage",
    description: "Điều phối và quản lý team",
    module: "Teams",
    actions: ["update"],
  },

  // Roles & Permissions Module
  {
    id: "perm-roles-create",
    name: "roles.create",
    description: "Tạo role mới",
    module: "Roles",
    actions: ["create"],
  },
  {
    id: "perm-roles-read",
    name: "roles.read",
    description: "Xem danh sách roles",
    module: "Roles",
    actions: ["read"],
  },
  {
    id: "perm-roles-update",
    name: "roles.update",
    description: "Cập nhật phân quyền",
    module: "Roles",
    actions: ["update"],
  },

  // Activity Logs Module
  {
    id: "perm-logs-read",
    name: "logs.read",
    description: "Xem log hoạt động",
    module: "Activity Logs",
    actions: ["read"],
  },
];

// Permission Modules for easier grouping
export const mockPermissionModules: PermissionModule[] = [
  {
    module: "Orders",
    permissions: mockPermissions.filter((p) => p.module === "Orders"),
  },
  {
    module: "Designs",
    permissions: mockPermissions.filter((p) => p.module === "Designs"),
  },
  {
    module: "Tasks",
    permissions: mockPermissions.filter((p) => p.module === "Tasks"),
  },
  {
    module: "Production",
    permissions: mockPermissions.filter((p) => p.module === "Production"),
  },
  {
    module: "Listings",
    permissions: mockPermissions.filter((p) => p.module === "Listings"),
  },
  {
    module: "Suppliers",
    permissions: mockPermissions.filter((p) => p.module === "Suppliers"),
  },
  {
    module: "Dashboard",
    permissions: mockPermissions.filter((p) => p.module === "Dashboard"),
  },
  {
    module: "Users",
    permissions: mockPermissions.filter((p) => p.module === "Users"),
  },
  {
    module: "Teams",
    permissions: mockPermissions.filter((p) => p.module === "Teams"),
  },
  {
    module: "Roles",
    permissions: mockPermissions.filter((p) => p.module === "Roles"),
  },
  {
    module: "Activity Logs",
    permissions: mockPermissions.filter((p) => p.module === "Activity Logs"),
  },
];

// ============================================
// ROLES - 4 Main Roles based on POD Workflow
// ============================================

// Helper to get permissions by ids
const getPermissionsByIds = (ids: string[]) =>
  mockPermissions.filter((p) => ids.includes(p.id));

export const mockRoles: Role[] = [
  {
    id: "role-admin",
    name: "Admin",
    description:
      "Theo dõi toàn bộ hệ thống, Điều phối team, Xem KPI, Quản lý tài khoản và phân quyền",
    permissions: mockPermissions, // Full access
    color: "#dc2626", // red-600
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "role-seller",
    name: "Seller",
    description:
      "Nhận order, Tạo mẫu, Đẩy task cho Designer, Duyệt file thiết kế, Gửi thiết kế cho supplier, Tạo listing",
    permissions: getPermissionsByIds([
      "perm-orders-create",
      "perm-orders-read",
      "perm-orders-update",
      "perm-designs-create",
      "perm-designs-read",
      "perm-designs-approve",
      "perm-tasks-create",
      "perm-tasks-read",
      "perm-tasks-assign",
      "perm-tasks-review",
      "perm-listings-create",
      "perm-listings-read",
      "perm-listings-update",
      "perm-listings-delete",
      "perm-suppliers-read",
      "perm-suppliers-send",
      "perm-dashboard-read",
    ]),
    color: "#2563eb", // blue-600
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20",
  },
  {
    id: "role-designer",
    name: "Designer",
    description: "Nhận task từ Seller, Thiết kế, Upload file hoàn thiện",
    permissions: getPermissionsByIds([
      "perm-tasks-read",
      "perm-tasks-update",
      "perm-designs-create",
      "perm-designs-read",
      "perm-designs-update",
      "perm-designs-upload",
      "perm-orders-read",
      "perm-dashboard-read",
    ]),
    color: "#9333ea", // purple-600
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
  },
  {
    id: "role-supplier",
    name: "Supplier",
    description: "Nhận lệnh in, Xử lý đơn, Tracking sản xuất",
    permissions: getPermissionsByIds([
      "perm-production-read",
      "perm-production-update",
      "perm-production-tracking",
      "perm-production-batch",
      "perm-orders-read",
      "perm-designs-read",
      "perm-dashboard-read",
    ]),
    color: "#16a34a", // green-600
    createdAt: "2024-01-12",
    updatedAt: "2024-01-28",
  },
];

// ============================================
// USER GENERATOR - Generate 50 users
// ============================================

const firstNames = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Phan",
  "Vũ",
  "Võ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Ngô",
  "Dương",
  "Lý",
  "Đinh",
  "Mai",
  "Trương",
  "Lưu",
];

const middleNames = [
  "Văn",
  "Thị",
  "Minh",
  "Hoàng",
  "Đức",
  "Hữu",
  "Quốc",
  "Thanh",
  "Kim",
  "Anh",
  "Ngọc",
  "Bảo",
  "Phương",
  "Hải",
  "Tuấn",
  "Thu",
  "Xuân",
  "Hồng",
  "Quang",
  "Thành",
];

const lastNames = [
  "Anh",
  "Bình",
  "Cường",
  "Dũng",
  "Hùng",
  "Khánh",
  "Long",
  "Minh",
  "Nam",
  "Phong",
  "Quân",
  "Sơn",
  "Tâm",
  "Thành",
  "Tuấn",
  "Việt",
  "Hà",
  "Lan",
  "Mai",
  "Ngọc",
  "Oanh",
  "Phượng",
  "Quyên",
  "Thảo",
  "Trang",
  "Uyên",
  "Vân",
  "Yến",
  "Linh",
  "Hương",
];

const statusOptions: Array<"active" | "inactive" | "pending"> = [
  "active",
  "active",
  "active",
  "inactive",
  "pending",
];

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
}

function generateUser(index: number, role: Role): User {
  const firstName = firstNames[index % firstNames.length];
  const middleName =
    middleNames[Math.floor(index / firstNames.length) % middleNames.length];
  const lastName = lastNames[index % lastNames.length];
  const name = `${firstName} ${middleName} ${lastName}`;

  const emailPrefix = `${lastName.toLowerCase()}${index + 1}`;
  const emailDomain =
    role.name === "Supplier" ? "partner.com" : "podmanagement.com";

  const createdAt = generateRandomDate(
    new Date("2024-01-01"),
    new Date("2024-06-01")
  );
  const updatedAt = generateRandomDate(
    new Date(createdAt),
    new Date("2024-11-27")
  );

  return {
    id: `user-${role.name.toLowerCase()}-${index + 1}`,
    name,
    email: `${emailPrefix}@${emailDomain}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role.name}${
      index + 1
    }`,
    role,
    status: statusOptions[index % statusOptions.length],
    createdAt,
    updatedAt,
  };
}

// Generate 50 users: 3 Admin, 12 Seller, 20 Designer, 15 Supplier
const adminUsers: User[] = Array.from({ length: 3 }, (_, i) =>
  generateUser(i, mockRoles[0])
);
const sellerUsers: User[] = Array.from({ length: 12 }, (_, i) =>
  generateUser(i, mockRoles[1])
);
const designerUsers: User[] = Array.from({ length: 20 }, (_, i) =>
  generateUser(i, mockRoles[2])
);
const supplierUsers: User[] = Array.from({ length: 15 }, (_, i) =>
  generateUser(i, mockRoles[3])
);

export const mockUsers: User[] = [
  ...adminUsers,
  ...sellerUsers,
  ...designerUsers,
  ...supplierUsers,
];

// ============================================
// TEAMS - Teams organized by function
// ============================================

export const mockTeams: Team[] = [
  {
    id: "team-sellers",
    name: "Seller Team",
    description:
      "Đội ngũ bán hàng - Nhận order, quản lý listing và giao việc cho designer",
    members: sellerUsers,
    leader: sellerUsers[0],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "team-designers",
    name: "Design Team",
    description: "Đội ngũ thiết kế - Nhận task từ Seller và thực hiện thiết kế",
    members: designerUsers,
    leader: designerUsers[0],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20",
  },
  {
    id: "team-suppliers",
    name: "Production Partners",
    description: "Đối tác sản xuất - Nhận lệnh in và tracking sản xuất",
    members: supplierUsers,
    leader: supplierUsers[0],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
  },
];

// Update users with team references
sellerUsers.forEach((user) => {
  user.team = mockTeams[0];
});
designerUsers.forEach((user) => {
  user.team = mockTeams[1];
});
supplierUsers.forEach((user) => {
  user.team = mockTeams[2];
});

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getRoleById = (roleId: string) =>
  mockRoles.find((r) => r.id === roleId);

export const getUsersByRole = (roleId: string) =>
  mockUsers.filter((u) => u.role.id === roleId);

export const getTeamByRole = (roleId: string) => {
  switch (roleId) {
    case "role-seller":
      return mockTeams.find((t) => t.id === "team-sellers");
    case "role-designer":
      return mockTeams.find((t) => t.id === "team-designers");
    case "role-supplier":
      return mockTeams.find((t) => t.id === "team-suppliers");
    default:
      return undefined;
  }
};

export const hasPermission = (user: User, permissionName: string) =>
  user.role.permissions.some((p) => p.name === permissionName);
