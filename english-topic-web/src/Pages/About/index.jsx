import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <div className="about-content">
          <h1>🎯 Về English Vocabulary</h1>
          <div className="about-section">
            <h2>📚 Phương pháp học</h2>
            <p>
              Ứng dụng này được thiết kế để giúp bạn học từ vựng tiếng Anh một cách hiệu quả thông qua:
            </p>
            <ul>
              <li>Học theo chủ đề cụ thể để dễ nhớ và ứng dụng</li>
              <li>Hệ thống trắc nghiệm với 4 lựa chọn</li>
              <li>Tính năng "Skip" cho những từ bạn đã biết</li>
              <li>Theo dõi tiến độ và kết quả học tập</li>
              <li>Ôn tập lại những từ đã học</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>🎨 Tính năng nổi bật</h2>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">📖</span>
                <h3>Học theo chủ đề</h3>
                <p>12+ chủ đề phong phú từ cơ bản đến nâng cao</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <h3>Quiz thông minh</h3>
                <p>Hệ thống trắc nghiệm với feedback tức thì</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⏭️</span>
                <h3>Skip linh hoạt</h3>
                <p>Bỏ qua những từ bạn đã biết để tối ưu thời gian</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <h3>Theo dõi tiến độ</h3>
                <p>Thống kê chi tiết về quá trình học tập</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>💡 Cách sử dụng</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Chọn chủ đề</h3>
                  <p>Từ trang chủ, chọn chủ đề từ vựng bạn muốn học</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Trả lời câu hỏi</h3>
                  <p>Đọc từ tiếng Anh và chọn nghĩa tiếng Việt đúng</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Skip nếu biết</h3>
                  <p>Nhấn "Tôi đã biết từ này" để bỏ qua và tiết kiệm thời gian</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Xem kết quả</h3>
                  <p>Kiểm tra điểm số và ôn tập lại những từ còn yếu</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>🚀 Mục tiêu</h2>
            <p>
              Chúng tôi mong muốn tạo ra một công cụ học từ vựng tiếng Anh hiệu quả, 
              thân thiện và dễ sử dụng cho mọi người. Ứng dụng này đặc biệt phù hợp với:
            </p>
            <ul>
              <li>Học sinh, sinh viên đang học tiếng Anh</li>
              <li>Người đi làm muốn cải thiện vốn từ vựng</li>
              <li>Ai muốn ôn tập và củng cố kiến thức đã có</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;