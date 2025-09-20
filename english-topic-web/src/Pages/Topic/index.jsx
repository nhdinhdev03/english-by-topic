import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SpeechReader from '../../components/SpeechReader';
import { getTopicData, getTopicMetadata } from '../../utils/topicUtils';
import './Topic.css';

const Topic = () => {
  const { topicName } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWords, setFilteredWords] = useState([]);

  useEffect(() => {
    const loadTopicData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getTopicData(topicName);
        const metadata = getTopicMetadata();
        
        if (data && Array.isArray(data) && data.length > 0) {
          const topicInfo = metadata[topicName] || {
            description: `Từ vựng về ${topicName.replace(/-/g, ' ').toLowerCase()}`,
            icon: '📚'
          };
          
          setTopicData({
            title: topicName.replace(/-/g, ' '),
            description: topicInfo.description,
            icon: topicInfo.icon,
            words: data
          });
          setFilteredWords(data);
        } else {
          setError('Chủ đề này chưa có dữ liệu hoặc không tồn tại');
        }
      } catch (err) {
        console.error('Error loading topic:', err);
        setError('Không thể tải dữ liệu chủ đề');
      } finally {
        setIsLoading(false);
      }
    };

    if (topicName) {
      loadTopicData();
    }
  }, [topicName]);

  useEffect(() => {
    if (topicData?.words) {
      const filtered = topicData.words.filter(word =>
        word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.vietnamese.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWords(filtered);
    }
  }, [searchTerm, topicData]);

  if (isLoading) {
    return (
      <div className="topic-loading">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Đang tải chủ đề...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="topic-error">
        <div className="container">
          <h2>⚠️ Có lỗi xảy ra</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="topic">
      <div className="container">
        <div className="topic-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Quay lại
          </button>
          <div className="topic-info">
            <h1>
              {topicData?.icon} {topicData?.title}
            </h1>
            <p>{topicData?.description}</p>
            <div className="topic-stats">
              <span className="word-count">
                📊 {topicData?.words?.length || 0} từ vựng
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/practice/${topicName}`)} 
            className="btn-practice"
          >
            🎤 Luyện phát âm
          </button>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm từ vựng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="vocabulary-table-container">
          <table className="vocabulary-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Từ vựng</th>
                <th>Phiên âm</th>
                <th>Dịch nghĩa</th>
                <th>Loại từ</th>
                <th>Phát âm</th>
              </tr>
            </thead>
            <tbody>
              {filteredWords.map((word, index) => (
                <tr key={index} className="vocabulary-row">
                  <td className="row-number">{index + 1}</td>
                  <td className="word-english">
                    <strong>{word.english}</strong>
                  </td>
                  <td className="word-pronunciation">
                    {word.pronunciation}
                  </td>
                  <td className="word-vietnamese">
                    {word.vietnamese}
                  </td>
                  <td className="word-type">
                    <span className="type-badge">
                      {word.type || 'n'}
                    </span>
                  </td>
                  <td className="word-audio">
                    <SpeechReader 
                      text={word.english} 
                      language="en-US"
                      showControls={false}
                      buttonText="🔊"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredWords.length === 0 && (
            <div className="no-results">
              <p>Không tìm thấy từ vựng nào phù hợp với "{searchTerm}"</p>
            </div>
          )}
        </div>

        <div className="topic-actions">
          <button 
            onClick={() => navigate('/topics')} 
            className="btn-secondary"
          >
            📚 Xem tất cả chủ đề
          </button>
          <button 
            onClick={() => navigate(`/practice/${topicName}`)} 
            className="btn-primary"
          >
            🎯 Luyện tập Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topic;