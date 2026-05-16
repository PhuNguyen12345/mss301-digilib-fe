# 💻 Digilib Web Application (`mss301-digilib-fe`)

## 📖 Giới thiệu
**Digilib Web App** là giao diện người dùng (Frontend) của hệ thống **Digital Library Management System**. 

Được xây dựng theo kiến trúc Single Page Application (SPA), ứng dụng này đóng vai trò là điểm tương tác trực tiếp với người dùng (độc giả và thủ thư). Thay vì gọi trực tiếp đến từng Microservice nội bộ, toàn bộ dữ liệu của Frontend đều được giao tiếp thông qua một cổng duy nhất là **API Gateway**.

## 🚀 Tính năng chính (Map theo Services)
* **Auth & Member:** Đăng nhập, đăng ký, quản lý hồ sơ độc giả (giao tiếp với `identity-service` và `member-service`).
* **Book Catalog:** Xem danh sách, tìm kiếm và xem chi tiết tài liệu (giao tiếp với `book-service`).
* **Loan Management:** Thực hiện nghiệp vụ mượn/trả sách, xem lịch sử mượn (giao tiếp với `loan-service`).
* **Fine & Notification:** Xem các khoản phạt trễ hạn và thông báo nhắc nhở (giao tiếp với `fine-service` và `notification-service`).

## 🛠 Tech Stack
* **Core:** React.js (khởi tạo qua Vite)
* **Styling & UI:** Tailwind CSS, shadcn/ui (Atomic Design)
* **Routing:** React Router DOM
* **API Client:** Axios
* **State Management:** (Tùy chọn: Redux Toolkit / Zustand / Context API)
* **Môi trường chạy:** Node.js

## ⚙️ Cài đặt & Khởi chạy

### Yêu cầu hệ thống
* Node.js (phiên bản 18.x trở lên)
* Hệ thống Backend (ít nhất là `eureka-server` và `api-gateway`) phải đang hoạt động.

### Các bước thực hiện
1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/PhuNguyen12345/mss301-digilib-fe.git
   cd mss301-digilib-fe