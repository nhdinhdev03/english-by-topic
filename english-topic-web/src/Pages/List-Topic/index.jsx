import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopicMetadata, getTopicWordCount, importAllTopics } from '../../utils/topicUtils';
import './ListTopic.css';

const ListTopic = () => {
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        const availableTopics = importAllTopics();
        const topicMetadata = getTopicMetadata();
        
        const topicList = await Promise.all(
          availableTopics.map(async (topic) => {
            const wordCount = await getTopicWordCount(topic);
            const metadata = topicMetadata[topic] || {
              icon: '📚',
              description: `Từ vựng về ${topic.replace(/-/g, ' ').toLowerCase()}`,
              category: 'Other'
            };
            
            return {
              name: topic,
              displayName: topic.replace(/-/g, ' '),
              wordCount: wordCount,
              ...metadata
            };
          })
        );
        
        setTopics(topicList);
        setFilteredTopics(topicList);
      } catch (error) {
        console.error('Error loading topics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  useEffect(() => {
    // Lọc topics theo từ khóa tìm kiếm
    const filtered = topics.filter(topic =>
      topic.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTopics(filtered);
  }, [searchTerm, topics]);

  // Nhóm topics theo category
  const groupedTopics = filteredTopics.reduce((acc, topic) => {
    const category = topic.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(topic);
    return acc;
  }, {});

  return (
    <div className="list-topic">
      <div className="list-topic-header">
        <h1>📚 Danh Sách Chủ Đề Từ Vựng</h1>
        <p>Chọn chủ đề bạn muốn học và thực hành từ vựng tiếng Anh</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="topics-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách chủ đề...</p>
          </div>
        ) : (
          Object.keys(groupedTopics).map(category => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="topics-grid">
                {groupedTopics[category].map(topic => (
                  <div key={topic.name} className="topic-card">
                    <div className="topic-icon">{topic.icon}</div>
                    <h3 className="topic-title">{topic.displayName}</h3>
                    <p className="topic-description">{topic.description}</p>
                    <div className="topic-stats">
                      <span className="word-count">
                        📊 {topic.wordCount} từ vựng
                      </span>
                    </div>
                    <div className="topic-actions">
                      <Link
                        to={`/topic/${topic.name}`}
                        className="btn btn-primary"
                      >
                        Học từ vựng
                      </Link>
                      <Link
                        to={`/practice/${topic.name}`}
                        className="btn btn-secondary"
                      >
                        Luyện tập
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {filteredTopics.length === 0 && (
        <div className="no-results">
          <p>Không tìm thấy chủ đề nào phù hợp với từ khóa "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default ListTopic;