import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  const features = [
    {
      title: "Ôn tập chủ động",
      description: "Trắc nghiệm 4 đáp án ngẫu nhiên, tránh lặp với chế độ ôn cách quãng",
      icon: "🧠",
      link: "/quiz"
    },
    {
      title: "Danh mục theo chủ đề",
      description: "Dễ duyệt, lọc, đánh dấu trạng thái học của từng từ",
      icon: "📚",
      link: "/topics"
    },
    {
      title: "Luyện phát âm",
      description: "Nghe TTS nhiều giọng, thu âm và so khớp phát âm cơ bản",
      icon: "🎤",
      link: "/learn"
    },
    {
      title: "Theo dõi tiến độ",
      description: "Điểm, streak, biểu đồ tiến bộ, mức tự tin từng từ",
      icon: "📊",
      link: "/progress"
    }
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>English by Topic</h1>
            <p className="hero-subtitle">
              Học 3000+ từ cốt lõi với trải nghiệm chống học vẹt
            </p>
            <div className="hero-actions">
              <Link to="/learn" className="btn btn-primary">
                Bắt đầu học
              </Link>
              <Link to="/topics" className="btn btn-secondary">
                Xem chủ đề
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Tính năng nổi bật</h2>
          <div className="features-grid grid grid-2">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid grid grid-3">
            <div className="stat-item">
              <div className="stat-number">3000+</div>
              <div className="stat-label">Từ vựng cốt lõi</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Chủ đề đa dạng</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Miễn phí</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng bắt đầu hành trình học từ vựng?</h2>
            <p>Tham gia ngay hôm nay và trải nghiệm phương pháp học hiệu quả</p>
            <Link to="/learn" className="btn btn-primary">
              Học ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;