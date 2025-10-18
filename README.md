# English by Topic - Ứng dụng học từ vựng tiếng Anh

Ứng dụng web học từ vựng tiếng Anh theo chủ đề với tính năng lưu tiến độ học tập và quiz tương tác.

## ✨ Tính năng chính

### 🎯 Học từ vựng theo chủ đề
- **15 chủ đề đa dạng**: Hoạt động hàng ngày, Thức ăn, Du lịch, Động vật, Màu sắc, Gia đình, Sức khỏe, Công việc, Số đếm, Quần áo, Thời tiết, Trường học, Mua sắm, Môi trường, Thể thao
- **Từ vựng phong phú**: Mỗi chủ đề chứa nhiều từ vựng thực tế với nghĩa tiếng Việt
- **Phát âm tự động**: Tích hợp Text-to-Speech cho phát âm chuẩn
- **Flashcard tương tác**: Giao diện lật thẻ học từ vựng trực quan

### 📊 Theo dõi tiến độ học tập
- **Lưu trữ Local Storage**: Dữ liệu học tập được lưu trữ cục bộ, không mất khi tắt trình duyệt
- **Tiến độ theo chủ đề**: Theo dõi số từ đã học và phần trăm hoàn thành cho từng chủ đề
- **Streak tracking**: Tính toán số ngày học liên tiếp
- **Lịch sử học tập**: Ghi nhận thời gian học lần cuối cho mỗi chủ đề

### 🎮 Quiz và kiểm tra
- **Nhiều dạng bài**: Multiple choice, điền từ, hoàn thành câu
- **Quiz theo chủ đề**: Tạo bài kiểm tra riêng cho từng chủ đề
- **Quiz tổng hợp**: Kết hợp từ vựng từ nhiều chủ đề
- **Lưu kết quả**: Theo dõi điểm số và hiệu suất làm bài

### 📈 Thống kê chi tiết
- **Tổng quan**: Số từ đã học, quiz đã làm, điểm trung bình
- **Chi tiết theo chủ đề**: Tiến độ, số quiz, từ cần ôn tập
- **Phân tích hiệu suất**: Theo dõi xu hướng học tập

### 🎨 Giao diện thân thiện
- **Responsive Design**: Tương thích với mọi thiết bị (desktop, tablet, mobile)
- **Dark/Light Mode**: Chế độ sáng/tối tùy chọn
- **Animations mượt mà**: Hiệu ứng chuyển đổi trang đẹp mắt
- **Accessibility**: Hỗ trợ người dùng khuyết tật

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18**: Framework chính với hooks và functional components
- **React Router**: Điều hướng single-page application
- **SCSS**: Styling với CSS variables và responsive design
- **Context API**: Quản lý state toàn cục cho theme, language, và progress

### Tính năng kỹ thuật
- **LocalStorage API**: Lưu trữ dữ liệu học tập cục bộ
- **Web Speech API**: Text-to-Speech cho phát âm
- **Intersection Observer**: Lazy loading và performance optimization
- **Performance Optimization**: Memoization, debouncing, virtual scrolling

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 8.0.0

### Cài đặt
```bash
# Clone repository
git clone https://github.com/nhdinhdev03/english-by-topic.git

# Di chuyển vào thư mục dự án
cd english-by-topic/english-topic-web

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## 📊 Tính năng mới - Lưu tiến độ học tập

### LocalStorage Structure
```javascript
// Tiến độ chủ đề
english_topic_progress: {
  "daily-activities": {
    totalWords: 50,
    learnedWords: 25,
    percentage: 50,
    lastStudied: "2024-01-15T10:30:00Z"
  }
}

// Từ đã học
english_learned_words: {
  "daily-activities": [
    {
      english: "wake up",
      vietnamese: "thức dậy",
      learnedAt: "2024-01-15T10:30:00Z",
      reviewCount: 3
    }
  ]
}

// Kết quả quiz
english_quiz_results: {
  "daily-activities": [
    {
      score: 8,
      totalQuestions: 10,
      percentage: 80,
      completedAt: "2024-01-15T11:00:00Z"
    }
  ]
}
```

## 👨‍💻 Tác giả



- **Hoàng Đình** - Developer chính
- GitHub: [@nhdinhdev03](https://github.com/nhdinhdev03)

---

**Happy Learning! 🎓📚**
