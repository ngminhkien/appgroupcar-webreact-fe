# THIẾT KẾ KIẾN TRÚC & QUY TẮC DỰ ÁN (Dành cho AI & Developer)

## 1. MỤC TIÊU VÀ TƯ DUY CỐT LÕI
- Ngôn ngữ: Tiếng Việt
- Dự án này sử dụng React/Vite dùng javasctipt, yêu cầu tuân thủ tuyệt đối kiến trúc **Feature-Based (Chia theo cụm tính năng)**. Không được phép gom nhóm theo kiểu cũ (phân tách theo file type). Mọi đoạn code được sinh ra phải đảm bảo tính module hóa, dễ bảo trì và mở rộng.

## 2. CẤU TRÚC THƯ MỤC CHUẨN
AI khi sinh code phải đặt file đúng vào các vị trí sau:

src/
├── assets/            # Chứa ảnh tĩnh, icon, font.
├── components/        # CHỈ chứa UI Component dùng chung (Button, Modal). Không chứa business logic.
├── config/            # File cấu hình chung (constants, theme).
├── features/          # CHỨA MỌI BUSINESS LOGIC, chia theo module (auth, system-admin, user...).
├── hooks/             # Custom hooks dùng chung (vd: useClickOutside).
├── layouts/           # Khung giao diện theo Role (AdminLayout, PublicLayout).
├── routes/            # Chứa logic định tuyến, RoleGuard.
├── services/          # Cấu hình API client (Axios/Fetch).
├── store/             # Quản lý Global State.
├── types/             # Định nghĩa Type/Interface dùng chung.
└── utils/             # Hàm helpers dùng chung.


## 3. QUY TẮC ÉP BUỘC KHI SINH CODE (STRICT RULES)

### Quy tắc 1: Cấu trúc bên trong một `Feature`
Khi được yêu cầu tạo một tính năng mới (ví dụ: `auth`), AI bắt buộc phải tạo cấu trúc bên trong `src/features/[tên-tính-năng]/` như sau:
- `/components`: Các UI component đặc thù riêng cho tính năng này.
- `/api`: Các file gọi API liên quan đến tính năng.
- `/types`: Định nghĩa TypeScript riêng cho tính năng.
- `/hooks`: Custom hooks xử lý logic của tính năng.
- `index.ts`: File xuất khẩu (export) tất cả những gì tính năng này cho phép bên ngoài sử dụng. **Tuyệt đối không để các module khác import sâu vào bên trong thư mục feature, chỉ được import qua `index.ts` này.**

### Quy tắc 2: TypeScript & Absolute Imports
- **BẮT BUỘC** sử dụng TypeScript 100%. Không dùng `any`. Mọi props, state, API response đều phải có Interface/Type rõ ràng.
- **BẮT BUỘC** sử dụng Absolute Imports (bắt đầu bằng `@/`). Ví dụ: `import { Button } from '@/components/Button';` (Không dùng `../../components`).

### Quy tắc 3: Tách biệt UI và Logic
- Các file `.jsx` (Component) chỉ chịu trách nhiệm render UI.
- Mọi logic phức tạp, gọi API, xử lý state phải được đưa ra các Custom Hook (`use...`) và gọi vào component.

### Quy tắc 4: Xử lý Phân quyền (Role System)
- Các trang dành cho Role cụ thể phải được bọc trong `Layout` tương ứng (vd: `AdminLayout`).
- Việc kiểm tra quyền truy cập được xử lý tập trung tại `src/routes/RoleGuard.tsx`. Tuyệt đối không viết rải rác logic kiểm tra `user.role === 'ADMIN'` ở khắp các component.

## 4. HƯỚNG DẪN THỰC THI CHO AI
Khi nhận được yêu cầu tạo code, AI phải thực hiện theo các bước sau:
1. **Phân tích:** Tính năng này thuộc Feature nào? Hay là Component dùng chung?
2. **Viết Logic:** Tạo API services và Custom Hooks để xử lý data.
3. **Viết UI:** Xây dựng Component và kết nối với Hook vừa tạo.
4. **Kiểm tra xuất khẩu:** Đảm bảo xuất file chuẩn qua `index.ts`.