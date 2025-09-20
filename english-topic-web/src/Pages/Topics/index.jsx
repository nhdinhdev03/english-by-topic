import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Topics.scss';

const Topics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for topics
  const topics = [
    { id: 1, name: 'Daily Activities', category: 'life', wordCount: 120, progress: 75, color: '#3b82f6' },
    { id: 2, name: 'Food & Drink', category: 'life', wordCount: 180, progress: 60, color: '#10b981' },
    { id: 3, name: 'Travel', category: 'life', wordCount: 150, progress: 40, color: '#f59e0b' },
    { id: 4, name: 'Business', category: 'work', wordCount: 200, progress: 30, color: '#8b5cf6' },
    { id: 5, name: 'Technology', category: 'work', wordCount: 175, progress: 80, color: '#06b6d4' },
    { id: 6, name: 'Health', category: 'life', wordCount: 140, progress: 50, color: '#ef4444' },
    { id: 7, name: 'Education', category: 'academic', wordCount: 190, progress: 65, color: '#f97316' },
    { id: 8, name: 'Environment', category: 'academic', wordCount: 160, progress: 25, color: '#84cc16' },
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: topics.length },
    { id: 'life', name: 'Đời sống', count: topics.filter(t => t.category === 'life').length },
    { id: 'work', name: 'Công việc', count: topics.filter(t => t.category === 'work').length },
    { id: 'academic', name: 'Học thuật', count: topics.filter(t => t.category === 'academic').length },
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="topics-page">
      <div className="container">
        {/* Header Section */}
        <div className="topics-header">
          <h1 className="heading-1">Chủ đề từ vựng</h1>
          <p className="topics-subtitle">
            Khám phá và học từ vựng theo các chủ đề đa dạng, từ cơ bản đến nâng cao
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="topics-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                <span className="badge">{category.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="topics-grid grid grid-3">
          {filteredTopics.map(topic => (
            <Link
              key={topic.id}
              to={`/learn/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="topic-card card card-interactive"
            >
              <div className="topic-header">
                <div 
                  className="topic-icon"
                  style={{ backgroundColor: topic.color }}
                >
                  📚
                </div>
                <div className="topic-meta">
                  <h3>{topic.name}</h3>
                  <p>{topic.wordCount} từ vựng</p>
                </div>
              </div>

              <div className="topic-progress">
                <div className="progress-info">
                  <span>Tiến độ</span>
                  <span>{topic.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${topic.progress}%`,
                      backgroundColor: topic.color 
                    }}
                  ></div>
                </div>
              </div>

              <div className="topic-actions">
                <span className="learn-btn">Học ngay</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Không tìm thấy chủ đề nào</h3>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topics;