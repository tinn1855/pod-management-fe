import { Idea, IdeaStatus, Design, KanbanColumn } from "@/type/idea";
import { mockUsers } from "./user";

// Helper to generate relative dates
const getDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

const getPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Mock Ideas data - organized by workflow stages
export const mockIdeas: Idea[] = [
  // === NEW IDEAS ===
  {
    id: "idea-1",
    title: "T-Shirt Design - Summer Collection",
    description:
      "Thiết kế áo thun theo chủ đề mùa hè với các họa tiết tropical. Yêu cầu:\n- Màu sắc tươi sáng\n- Họa tiết lá cọ, hoa hibiscus\n- Phù hợp in DTG",
    status: "new",
    priority: "high",
    references: [
      {
        id: "ref-1",
        url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
        name: "Tropical reference",
        type: "image",
      },
    ],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[1],
    tags: ["summer", "tropical", "t-shirt", "dtg"],
    deadline: getDate(7), // 7 days from now
    createdAt: getPastDate(2),
    updatedAt: getPastDate(2),
  },
  {
    id: "idea-7",
    title: "Sticker Pack - Cute Animals",
    description:
      "Bộ sticker động vật dễ thương theo phong cách kawaii. Cần 12-15 sticker khác nhau.",
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
    deadline: getDate(14), // 2 weeks from now
    createdAt: getPastDate(1),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-9",
    title: "Christmas Collection 2024",
    description:
      "Bộ sưu tập Giáng sinh bao gồm: áo sweater, mug, và poster. Theme: cozy winter.",
    status: "new",
    priority: "urgent",
    references: [],
    comments: [
      {
        id: "comment-9",
        content: "Cần hoàn thành trước 15/12 để kịp mùa sale!",
        author: mockUsers[1],
        createdAt: getPastDate(0),
        updatedAt: getPastDate(0),
      },
    ],
    createdBy: mockUsers[1],
    tags: ["christmas", "holiday", "sweater", "mug", "poster"],
    deadline: getDate(5), // Urgent - 5 days
    createdAt: getPastDate(0),
    updatedAt: getPastDate(0),
  },

  // === CHECK DESIGN ===
  {
    id: "idea-2",
    title: "Mug Design - Coffee Lovers",
    description:
      "Thiết kế cốc cho những người yêu cà phê với các quote thú vị như 'But first, coffee' và 'Coffee is my love language'",
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
        content: "Cần thêm màu sắc ấm hơn cho phù hợp với theme coffee",
        author: mockUsers[1],
        createdAt: getPastDate(3),
        updatedAt: getPastDate(3),
      },
      {
        id: "comment-1b",
        content: "Đã cập nhật bản design mới, check lại nhé!",
        author: mockUsers[4],
        createdAt: getPastDate(1),
        updatedAt: getPastDate(1),
      },
    ],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["mug", "coffee", "quote", "gift"],
    deadline: getDate(1), // Tomorrow
    createdAt: getPastDate(7),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-8",
    title: "Canvas Print - Abstract Art",
    description:
      "Tranh canvas nghệ thuật trừu tượng với màu sắc bold. Size: 16x20 inch và 24x36 inch.",
    status: "check_design",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[1],
    tags: ["canvas", "abstract", "art", "home-decor"],
    deadline: getDate(3),
    createdAt: getPastDate(5),
    updatedAt: getPastDate(2),
  },

  // === CHECK CONTENT ===
  {
    id: "idea-3",
    title: "Phone Case - Minimalist Art",
    description:
      "Ốp điện thoại với phong cách tối giản, line art. Support iPhone 14/15 và Samsung S23/S24.",
    status: "check_content",
    priority: "low",
    references: [],
    comments: [
      {
        id: "comment-3a",
        content: "Design đã OK, đang viết content listing cho Etsy",
        author: mockUsers[2],
        createdAt: getPastDate(2),
        updatedAt: getPastDate(2),
      },
    ],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["phone-case", "minimalist", "line-art", "iphone", "samsung"],
    deadline: getPastDate(2), // Overdue
    createdAt: getPastDate(10),
    updatedAt: getPastDate(2),
  },

  // === DONE IDEA ===
  {
    id: "idea-4",
    title: "Poster - Motivational Quotes",
    description:
      "Poster với các câu nói truyền cảm hứng, phong cách typography hiện đại.",
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
        createdAt: getPastDate(5),
        updatedAt: getPastDate(5),
      },
    ],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["poster", "motivational", "typography", "wall-art"],
    createdAt: getPastDate(14),
    updatedAt: getPastDate(5),
  },

  // === FIX DESIGN ===
  {
    id: "idea-5",
    title: "Hoodie - Street Style",
    description:
      "Áo hoodie phong cách đường phố với graffiti art. Màu: Black, Navy, Charcoal.",
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
        content: "Cần sửa lại màu background - quá tối không thấy rõ artwork",
        author: mockUsers[1],
        createdAt: getPastDate(3),
        updatedAt: getPastDate(3),
      },
      {
        id: "comment-3b",
        content: "Đang fix, dự kiến xong trong hôm nay",
        author: mockUsers[3],
        createdAt: getPastDate(1),
        updatedAt: getPastDate(1),
      },
    ],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["hoodie", "street", "graffiti", "urban"],
    deadline: getDate(0), // Today
    createdAt: getPastDate(12),
    updatedAt: getPastDate(1),
  },

  // === DONE ===
  {
    id: "idea-6",
    title: "Tote Bag - Eco Friendly",
    description:
      "Túi vải với thông điệp bảo vệ môi trường. Already listed on Etsy & Amazon.",
    status: "done",
    priority: "medium",
    references: [],
    comments: [
      {
        id: "comment-6",
        content: "Đã list thành công trên cả 2 platform!",
        author: mockUsers[1],
        createdAt: getPastDate(7),
        updatedAt: getPastDate(7),
      },
    ],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["tote-bag", "eco", "environment", "sustainable"],
    createdAt: getPastDate(20),
    updatedAt: getPastDate(7),
  },
  {
    id: "idea-10",
    title: "Valentine Collection - Couple Mugs",
    description: "Bộ mug đôi cho Valentine. His & Hers design.",
    status: "done",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[1],
    tags: ["valentine", "couple", "mug", "gift", "love"],
    createdAt: getPastDate(30),
    updatedAt: getPastDate(15),
  },

  // === MORE IDEAS FOR TESTING ===
  {
    id: "idea-11",
    title: "Pet Portrait - Custom Dog Illustration",
    description: "Dịch vụ vẽ chân dung thú cưng theo phong cách cartoon. Khách hàng gửi ảnh và nhận tranh digital trong 3-5 ngày.",
    status: "new",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[2],
    tags: ["pet", "portrait", "custom", "dog", "illustration"],
    deadline: getDate(10),
    createdAt: getPastDate(1),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-12",
    title: "Gaming Mouse Pad - RGB Design",
    description: "Mouse pad gaming với thiết kế RGB gradient. Size: Extended (900x400mm). Chất liệu cao su chống trượt.",
    status: "new",
    priority: "low",
    references: [],
    comments: [],
    createdBy: mockUsers[1],
    tags: ["gaming", "mousepad", "rgb", "desk-setup"],
    deadline: getDate(21),
    createdAt: getPastDate(0),
    updatedAt: getPastDate(0),
  },
  {
    id: "idea-13",
    title: "Yoga Mat Design - Mandala Pattern",
    description: "Thảm yoga với họa tiết mandala. Màu sắc: Purple gradient, Teal ocean, Sunset orange.",
    status: "new",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["yoga", "mandala", "fitness", "wellness"],
    deadline: getDate(5),
    createdAt: getPastDate(2),
    updatedAt: getPastDate(2),
  },
  {
    id: "idea-14",
    title: "Laptop Sleeve - Professional Series",
    description: "Túi đựng laptop phong cách professional cho dân văn phòng. Sizes: 13\", 14\", 15\", 16\".",
    status: "check_design",
    priority: "medium",
    references: [],
    comments: [
      {
        id: "comment-14",
        content: "Design đã gửi, check và feedback nhé!",
        author: mockUsers[4],
        createdAt: getPastDate(1),
        updatedAt: getPastDate(1),
      },
    ],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["laptop", "sleeve", "professional", "office"],
    deadline: getDate(3),
    createdAt: getPastDate(5),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-15",
    title: "Baby Onesie - First Birthday",
    description: "Bộ sưu tập áo liền cho bé mừng sinh nhật đầu tiên. Cute animals theme với số 1.",
    status: "check_design",
    priority: "urgent",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["baby", "onesie", "birthday", "cute"],
    deadline: getDate(2),
    createdAt: getPastDate(4),
    updatedAt: getPastDate(2),
  },
  {
    id: "idea-16",
    title: "Throw Pillow - Boho Style",
    description: "Gối trang trí phong cách Boho với geometric patterns và earth tones.",
    status: "check_content",
    priority: "low",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["pillow", "boho", "home-decor", "geometric"],
    deadline: getDate(7),
    createdAt: getPastDate(8),
    updatedAt: getPastDate(3),
  },
  {
    id: "idea-17",
    title: "Apron Design - Master Chef",
    description: "Tạp dề nấu ăn với typography \"Master Chef\" và các icon về cooking. Unisex design.",
    status: "check_content",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["apron", "kitchen", "cooking", "chef"],
    createdAt: getPastDate(6),
    updatedAt: getPastDate(2),
  },
  {
    id: "idea-18",
    title: "Beach Towel - Summer Vibes",
    description: "Khăn đi biển với thiết kế summer vibes. Kích thước lớn 180x90cm. In sublimation full color.",
    status: "done_idea",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["beach", "towel", "summer", "sublimation"],
    createdAt: getPastDate(10),
    updatedAt: getPastDate(4),
  },
  {
    id: "idea-19",
    title: "Wine Tumbler - Custom Quotes",
    description: "Ly giữ nhiệt cho wine với các quote hài hước về wine. Màu: Rose gold, Black matte, Silver.",
    status: "done_idea",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["wine", "tumbler", "quote", "gift"],
    createdAt: getPastDate(12),
    updatedAt: getPastDate(5),
  },
  {
    id: "idea-20",
    title: "Desk Organizer - Minimalist",
    description: "Hộp đựng đồ văn phòng phẩm phong cách minimalist. Chất liệu: Wood + acrylic.",
    status: "fix_design",
    priority: "low",
    references: [],
    comments: [
      {
        id: "comment-20",
        content: "Logo bị mờ khi in, cần tăng DPI",
        author: mockUsers[1],
        createdAt: getPastDate(2),
        updatedAt: getPastDate(2),
      },
    ],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["desk", "organizer", "minimalist", "office"],
    deadline: getDate(1),
    createdAt: getPastDate(8),
    updatedAt: getPastDate(2),
  },
  {
    id: "idea-21",
    title: "Passport Holder - World Traveler",
    description: "Ví đựng passport với bản đồ thế giới và quote về travel. Chất liệu vegan leather.",
    status: "done",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["passport", "travel", "leather", "accessories"],
    createdAt: getPastDate(25),
    updatedAt: getPastDate(10),
  },
  {
    id: "idea-22",
    title: "Coaster Set - Abstract Art",
    description: "Bộ lót ly 4 chiếc với thiết kế abstract art. Chất liệu ceramic với cork backing.",
    status: "done",
    priority: "low",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["coaster", "abstract", "ceramic", "home"],
    createdAt: getPastDate(20),
    updatedAt: getPastDate(12),
  },
  {
    id: "idea-23",
    title: "Gym Bag - Motivational",
    description: "Túi gym với các slogan motivational về fitness. Chất liệu nylon chống nước.",
    status: "new",
    priority: "medium",
    references: [],
    comments: [],
    createdBy: mockUsers[2],
    tags: ["gym", "bag", "fitness", "motivational"],
    deadline: getDate(12),
    createdAt: getPastDate(1),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-24",
    title: "Car Air Freshener - Custom Shape",
    description: "Sáp thơm xe hơi với hình dạng custom. Mùi: New car, Ocean, Vanilla, Lavender.",
    status: "new",
    priority: "low",
    references: [],
    comments: [],
    createdBy: mockUsers[1],
    tags: ["car", "air-freshener", "custom", "automotive"],
    deadline: getDate(14),
    createdAt: getPastDate(0),
    updatedAt: getPastDate(0),
  },
  {
    id: "idea-25",
    title: "Bookmark Set - Literary Quotes",
    description: "Bộ bookmark với quotes từ các tác phẩm văn học nổi tiếng. Material: Metal với leather tassel.",
    status: "check_design",
    priority: "low",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["bookmark", "literary", "reading", "gift"],
    deadline: getDate(8),
    createdAt: getPastDate(3),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-26",
    title: "Lunch Bag - Kids Collection",
    description: "Túi đựng cơm trưa cho trẻ em với các nhân vật hoạt hình cute. Có lớp giữ nhiệt bên trong.",
    status: "check_design",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["lunch-bag", "kids", "cartoon", "insulated"],
    deadline: getDate(4),
    createdAt: getPastDate(5),
    updatedAt: getPastDate(2),
  },
  {
    id: "idea-27",
    title: "Keychains - Zodiac Signs",
    description: "Bộ móc khóa 12 cung hoàng đạo với thiết kế minimalist. Chất liệu: Acrylic + gold plating.",
    status: "check_content",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["keychain", "zodiac", "astrology", "minimalist"],
    createdAt: getPastDate(7),
    updatedAt: getPastDate(3),
  },
  {
    id: "idea-28",
    title: "Wall Clock - Vintage Style",
    description: "Đồng hồ treo tường phong cách vintage với số La Mã. Đường kính 30cm và 40cm.",
    status: "done_idea",
    priority: "low",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["clock", "vintage", "wall-decor", "home"],
    createdAt: getPastDate(15),
    updatedAt: getPastDate(6),
  },
  {
    id: "idea-29",
    title: "Face Mask - Fashion Pattern",
    description: "Khẩu trang vải với họa tiết thời trang. 3 lớp vải, có túi filter. Washable & reusable.",
    status: "fix_design",
    priority: "medium",
    references: [],
    comments: [
      {
        id: "comment-29",
        content: "Pattern bị lệch khi may, cần chỉnh lại file cắt",
        author: mockUsers[2],
        createdAt: getPastDate(1),
        updatedAt: getPastDate(1),
      },
    ],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["mask", "fashion", "reusable", "pattern"],
    deadline: getDate(2),
    createdAt: getPastDate(6),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-30",
    title: "Makeup Bag - Floral Design",
    description: "Túi đựng mỹ phẩm với họa tiết hoa. Size S, M, L. Chất liệu canvas chống nước.",
    status: "done",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[1],
    tags: ["makeup", "bag", "floral", "beauty"],
    createdAt: getPastDate(22),
    updatedAt: getPastDate(14),
  },
  {
    id: "idea-31",
    title: "Notebook - Bullet Journal",
    description: "Sổ tay bullet journal với dotted pages. Bìa cứng với nhiều màu sắc. 200 trang 100gsm.",
    status: "new",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[2],
    tags: ["notebook", "bullet-journal", "stationery", "dotted"],
    deadline: getDate(6),
    createdAt: getPastDate(2),
    updatedAt: getPastDate(2),
  },
  {
    id: "idea-32",
    title: "Socks - Funny Pattern",
    description: "Vớ với họa tiết hài hước: pizza, avocado, cat faces. Unisex size. Cotton blend.",
    status: "new",
    priority: "low",
    references: [],
    comments: [],
    createdBy: mockUsers[1],
    tags: ["socks", "funny", "pattern", "fashion"],
    deadline: getDate(15),
    createdAt: getPastDate(1),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-33",
    title: "Umbrella - City Skyline",
    description: "Ô với thiết kế city skyline của các thành phố nổi tiếng: NYC, Paris, Tokyo, London.",
    status: "check_design",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[2],
    tags: ["umbrella", "city", "skyline", "travel"],
    deadline: getDate(7),
    createdAt: getPastDate(4),
    updatedAt: getPastDate(2),
  },
  {
    id: "idea-34",
    title: "Scarf - Seasonal Collection",
    description: "Khăn choàng theo mùa với màu sắc và pattern phù hợp. Chất liệu: Silk blend.",
    status: "check_content",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[1],
    tags: ["scarf", "seasonal", "fashion", "silk"],
    deadline: getDate(5),
    createdAt: getPastDate(6),
    updatedAt: getPastDate(2),
  },
  {
    id: "idea-35",
    title: "Puzzle - Custom Photo",
    description: "Dịch vụ in puzzle từ ảnh khách hàng. Sizes: 100, 500, 1000 pieces. Gift box included.",
    status: "done_idea",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[2],
    tags: ["puzzle", "custom", "photo", "gift"],
    createdAt: getPastDate(14),
    updatedAt: getPastDate(5),
  },
  {
    id: "idea-36",
    title: "Hat - Dad Cap Collection",
    description: "Bộ sưu tập nón dad cap với embroidery logos. Adjustable strap. Cotton twill.",
    status: "fix_design",
    priority: "urgent",
    references: [],
    comments: [
      {
        id: "comment-36",
        content: "Logo embroidery bị giãn, cần convert sang proper format",
        author: mockUsers[1],
        createdAt: getPastDate(0),
        updatedAt: getPastDate(0),
      },
    ],
    assignee: mockUsers[3],
    createdBy: mockUsers[1],
    tags: ["hat", "cap", "embroidery", "fashion"],
    deadline: getDate(1),
    createdAt: getPastDate(7),
    updatedAt: getPastDate(0),
  },
  {
    id: "idea-37",
    title: "Playing Cards - Custom Deck",
    description: "Bộ bài custom với thiết kế unique cho mặt lưng và Joker cards. 52 cards + 2 jokers.",
    status: "done",
    priority: "low",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[2],
    tags: ["cards", "playing", "custom", "games"],
    createdAt: getPastDate(28),
    updatedAt: getPastDate(18),
  },
  {
    id: "idea-38",
    title: "Doormat - Welcome Home",
    description: "Thảm chùi chân với các thiết kế welcome messages và funny quotes. Coir material.",
    status: "new",
    priority: "medium",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[1],
    tags: ["doormat", "welcome", "home", "coir"],
    deadline: getDate(9),
    createdAt: getPastDate(1),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-39",
    title: "Water Bottle - Hydration Tracker",
    description: "Bình nước với time marker nhắc uống nước. BPA free. Sizes: 500ml, 750ml, 1L.",
    status: "check_design",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[4],
    createdBy: mockUsers[2],
    tags: ["bottle", "water", "hydration", "health"],
    deadline: getDate(4),
    createdAt: getPastDate(3),
    updatedAt: getPastDate(1),
  },
  {
    id: "idea-40",
    title: "Blanket - Sherpa Fleece",
    description: "Chăn lông cừu với thiết kế custom. Super soft sherpa fleece. Sizes: Throw, Twin, Queen.",
    status: "done",
    priority: "high",
    references: [],
    comments: [],
    assignee: mockUsers[3],
    createdBy: mockUsers[1],
    tags: ["blanket", "sherpa", "fleece", "cozy"],
    createdAt: getPastDate(35),
    updatedAt: getPastDate(20),
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
        uploadedAt: getPastDate(10),
      },
      {
        id: "file-2",
        name: "tote-bag-eco-v1.png",
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363",
        type: "png",
        size: 2500000,
        folder: "Tote Bags",
        uploadedBy: mockUsers[4],
        uploadedAt: getPastDate(10),
      },
    ],
    comments: [],
    designer: mockUsers[4],
    reviewer: mockUsers[1],
    createdAt: getPastDate(12),
    updatedAt: getPastDate(7),
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
        uploadedAt: getPastDate(8),
      },
    ],
    comments: [],
    designer: mockUsers[4],
    reviewer: mockUsers[1],
    createdAt: getPastDate(10),
    updatedAt: getPastDate(5),
  },
  {
    id: "design-3",
    ideaId: "idea-5",
    title: "Street Hoodie - Draft v2",
    description: "Bản draft hoodie street style - đang fix background",
    status: "revision",
    files: [
      {
        id: "file-4",
        name: "hoodie-street-draft-v2.psd",
        url: "/designs/hoodie-street-draft-v2.psd",
        type: "psd",
        size: 20000000,
        folder: "Hoodies",
        uploadedBy: mockUsers[3],
        uploadedAt: getPastDate(2),
      },
    ],
    comments: [
      {
        id: "design-comment-1",
        content: "Background quá tối, cần điều chỉnh lại",
        author: mockUsers[1],
        createdAt: getPastDate(3),
        updatedAt: getPastDate(3),
      },
    ],
    designer: mockUsers[3],
    reviewer: mockUsers[1],
    createdAt: getPastDate(5),
    updatedAt: getPastDate(1),
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
    ideas: ideas
      .filter((idea) => idea.status === column.id)
      .sort((a, b) => {
        // Sort by priority first (urgent > high > medium > low)
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff =
          priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        // Then sort by deadline (soonest first, no deadline last)
        if (a.deadline && b.deadline) {
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        }
        if (a.deadline) return -1;
        if (b.deadline) return 1;

        // Finally sort by updated date (newest first)
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }),
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

// Get priority label
export const getPriorityLabel = (priority: Idea["priority"]): string => {
  const labels = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
    urgent: "Khẩn cấp",
  };
  return labels[priority];
};
