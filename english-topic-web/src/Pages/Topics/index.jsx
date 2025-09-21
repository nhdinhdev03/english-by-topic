import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AudioButton from '../../components/AudioButton';
import { useProgress } from '../../contexts/useProgress';
import './Topics.scss';

const Topics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getTopicProgressData, initializeTopic } = useProgress();

  // Real topics based on available JSON files
  useEffect(() => {
    const loadTopicsWithWordCount = async () => {
      const topicsData = [
        { 
          id: 'daily-activities', 
          name: 'Hoạt động hàng ngày', 
          category: 'life', 
          fileName: 'Daily-Activities.json',
          progress: 0, 
          color: '#3b82f6',
          description: 'Các hoạt động thường ngày'
        },
        { 
          id: 'food', 
          name: 'Thức ăn', 
          category: 'life', 
          fileName: 'Food.json',
          progress: 0, 
          color: '#10b981',
          description: 'Đồ ăn và đồ uống'
        },
        { 
          id: 'travel', 
          name: 'Du lịch', 
          category: 'life', 
          fileName: 'Travel.json',
          progress: 0, 
          color: '#f59e0b',
          description: 'Từ vựng về du lịch'
        },
        { 
          id: 'animals', 
          name: 'Động vật', 
          category: 'nature', 
          fileName: 'Animal.json',
          progress: 0, 
          color: '#8b5cf6',
          description: 'Các loài động vật'
        },
        { 
          id: 'colors', 
          name: 'Màu sắc', 
          category: 'basic', 
          fileName: 'Color.json',
          progress: 0, 
          color: '#06b6d4',
          description: 'Tên các màu sắc'
        },
        { 
          id: 'family', 
          name: 'Gia đình', 
          category: 'life', 
          fileName: 'Family.json',
          progress: 0, 
          color: '#ef4444',
          description: 'Thành viên gia đình'
        },
        { 
          id: 'health', 
          name: 'Sức khỏe', 
          category: 'life', 
          fileName: 'Health.json',
          progress: 0, 
          color: '#f97316',
          description: 'Y tế và sức khỏe'
        },
        { 
          id: 'work', 
          name: 'Công việc', 
          category: 'work', 
          fileName: 'Work.json',
          progress: 0, 
          color: '#84cc16',
          description: 'Nghề nghiệp và công việc'
        },
        { 
          id: 'count', 
          name: 'Số đếm', 
          category: 'basic', 
          fileName: 'Count.json',
          progress: 0, 
          color: '#ec4899',
          description: 'Số và toán học'
        },
        { 
          id: 'clothes', 
          name: 'Quần áo', 
          category: 'life', 
          fileName: 'Clothes.json',
          progress: 0, 
          color: '#6366f1',
          description: 'Trang phục và phụ kiện'
        },
        { 
          id: 'weather', 
          name: 'Thời tiết', 
          category: 'nature', 
          fileName: 'Weather.json',
          progress: 0, 
          color: '#14b8a6',
          description: 'Hiện tượng thời tiết'
        },
        { 
          id: 'school', 
          name: 'Trường học', 
          category: 'education', 
          fileName: 'School.json',
          progress: 0, 
          color: '#f59e0b',
          description: 'Giáo dục và học tập'
        },
        { 
          id: 'shopping', 
          name: 'Mua sắm', 
          category: 'life', 
          fileName: 'Shopping.json',
          progress: 0, 
          color: '#8b5cf6',
          description: 'Mua bán và cửa hàng'
        },
        { 
          id: 'environment', 
          name: 'Môi trường', 
          category: 'nature', 
          fileName: 'Environment.json',
          progress: 0, 
          color: '#10b981',
          description: 'Bảo vệ môi trường'
        },
        { 
          id: 'sport', 
          name: 'Thể thao', 
          category: 'activity', 
          fileName: 'Sport.json',
          progress: 0, 
          color: '#ef4444',
          description: 'Các môn thể thao'
        }
      ];

      // Load word count for each topic and get progress from localStorage
      const topicsWithWordCount = await Promise.all(
        topicsData.map(async (topic) => {
          try {
            const response = await fetch(`/data/${topic.fileName}`);
            if (response.ok) {
              const data = await response.json();
              const wordCount = data.length;
              
              // Initialize topic progress if not exists
              initializeTopic(topic.id, wordCount);
              
              // Get current progress from localStorage
              const progress = getTopicProgressData(topic.id);
              
              return { 
                ...topic, 
                wordCount,
                progress: progress.percentage || 0,
                learnedWords: progress.learnedWords || 0,
                lastStudied: progress.lastStudied
              };
            } else {
              console.warn(`Failed to load ${topic.fileName}`);
              return { ...topic, wordCount: 0, progress: 0, learnedWords: 0 };
            }
          } catch (error) {
            console.error(`Error loading ${topic.fileName}:`, error);
            return { ...topic, wordCount: 0, progress: 0, learnedWords: 0 };
          }
        })
      );

      setTopics(topicsWithWordCount);
      setLoading(false);
    };

    loadTopicsWithWordCount();
  }, [initializeTopic, getTopicProgressData]);

  const categories = useMemo(() => [
    { id: 'all', name: 'Tất cả', count: topics.length },
    { id: 'life', name: 'Đời sống', count: topics.filter(t => t.category === 'life').length },
    { id: 'work', name: 'Công việc', count: topics.filter(t => t.category === 'work').length },
    { id: 'nature', name: 'Tự nhiên', count: topics.filter(t => t.category === 'nature').length },
    { id: 'basic', name: 'Cơ bản', count: topics.filter(t => t.category === 'basic').length },
    { id: 'education', name: 'Giáo dục', count: topics.filter(t => t.category === 'education').length },
    { id: 'activity', name: 'Hoạt động', count: topics.filter(t => t.category === 'activity').length },
  ], [topics]);

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [topics, searchTerm, selectedCategory]);

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

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải danh sách chủ đề...</p>
          </div>
        ) : (
          <>
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
                  to={`/learn/${topic.id}`}
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
                      <div className="topic-title-row">
                        <h3>{topic.name}</h3>
                        <AudioButton
                          text={topic.name}
                          language="en"
                          size="small"
                          variant="minimal"
                          className="topic-audio-btn"
                        />
                      </div>
                      <div className="topic-stats">
                        <p>{topic.wordCount} từ vựng</p>
                        {topic.learnedWords > 0 && (
                          <small className="learned-count">{topic.learnedWords} từ đã học</small>
                        )}
                        {topic.lastStudied && (
                          <small className="last-studied">
                            Học lần cuối: {new Date(topic.lastStudied).toLocaleDateString('vi-VN')}
                          </small>
                        )}
                      </div>
                      <small>{topic.description}</small>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Topics;