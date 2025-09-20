import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const topics = [
    { name: 'Animal', title: 'Động vật', description: 'Học từ vựng về các loài động vật', icon: '🐾', color: '#FF6B6B' },
    { name: 'Food', title: 'Thức ăn', description: 'Từ vựng về đồ ăn thức uống', icon: '🍎', color: '#4ECDC4' },
    { name: 'Family', title: 'Gia đình', description: 'Các thành viên trong gia đình', icon: '👨‍👩‍👧‍👦', color: '#45B7D1' },
    { name: 'Color', title: 'Màu sắc', description: 'Tên các màu sắc cơ bản', icon: '🎨', color: '#96CEB4' },
    { name: 'Sport', title: 'Thể thao', description: 'Các môn thể thao phổ biến', icon: '⚽', color: '#FFEAA7' },
    { name: 'Weather', title: 'Thời tiết', description: 'Từ vựng về thời tiết', icon: '☀️', color: '#DDA0DD' },
    { name: 'School', title: 'Trường học', description: 'Đồ dùng và hoạt động học tập', icon: '🎓', color: '#98D8C8' },
    { name: 'Travel', title: 'Du lịch', description: 'Từ vựng liên quan đến du lịch', icon: '✈️', color: '#F7DC6F' },
    { name: 'Shopping', title: 'Mua sắm', description: 'Hoạt động mua sắm hàng ngày', icon: '🛒', color: '#BB8FCE' },
    { name: 'Work', title: 'Công việc', description: 'Nghề nghiệp và môi trường làm việc', icon: '💼', color: '#85C1E9' },
    { name: 'Health', title: 'Sức khỏe', description: 'Từ vựng về sức khỏe và y tế', icon: '🏥', color: '#F8C471' },
    { name: 'Technology', title: 'Công nghệ', description: 'Thiết bị và công nghệ hiện đại', icon: '💻', color: '#82E0AA' }
  ];

  return (
    <div className="home">
      <div className="container">
        <section className="hero">
          <h1>🎯 Học từ vựng tiếng Anh theo chủ đề</h1>
          <p>Phương pháp học hiệu quả với hệ thống trắc nghiệm thông minh</p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">📚</span>
              <span>Học theo chủ đề</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Trắc nghiệm thông minh</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⏭️</span>
              <span>Skip từ đã biết</span>
            </div>
          </div>
        </section>

        <section className="topics">
          <h2>Chọn chủ đề học tập</h2>
          <div className="topics-grid">
            {topics.map((topic) => (
              <Link 
                key={topic.name} 
                to={`/topic/${topic.name.toLowerCase()}`} 
                className="topic-card"
                style={{ borderLeft: `4px solid ${topic.color}` }}
              >
                <div className="topic-icon" style={{ backgroundColor: `${topic.color}20` }}>
                  {topic.icon}
                </div>
                <div className="topic-content">
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  <span className="topic-start">Bắt đầu học →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="stats">
          <div className="stat-item">
            <div className="stat-number">12+</div>
            <div className="stat-label">Chủ đề</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Từ vựng</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Luyện tập</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;