import { useEffect, useState } from 'react';
import { useProgress } from '../../contexts/useProgress';
import './Progress.scss';

const Progress = () => {
  const { 
    userStats, 
    getAllTopicsProgress, 
    calculateStreak, 
    getDetailedTopicStats 
  } = useProgress();
  
  const [streak, setStreak] = useState(0);
  const [detailedStats, setDetailedStats] = useState([]);

  useEffect(() => {
    // Load all topics progress
    const allProgress = getAllTopicsProgress();
    
    // Calculate streak
    const currentStreak = calculateStreak();
    setStreak(currentStreak);
    
    // Get detailed stats for each topic
    const topicIds = Object.keys(allProgress);
    const detailed = topicIds.map(topicId => {
      const stats = getDetailedTopicStats(topicId);
      return {
        id: topicId,
        ...stats
      };
    }).filter(topic => topic.totalWords > 0);
    
    setDetailedStats(detailed);
  }, [getAllTopicsProgress, calculateStreak, getDetailedTopicStats]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getTopicDisplayName = (topicId) => {
    const displayNames = {
      'daily-activities': 'Hoạt động hàng ngày',
      'food': 'Thức ăn',
      'travel': 'Du lịch',
      'animals': 'Động vật',
      'colors': 'Màu sắc',
      'family': 'Gia đình',
      'health': 'Sức khỏe',
      'work': 'Công việc',
      'count': 'Số đếm',
      'clothes': 'Quần áo',
      'weather': 'Thời tiết',
      'school': 'Trường học',
      'shopping': 'Mua sắm',
      'environment': 'Môi trường',
      'sport': 'Thể thao'
    };
    return displayNames[topicId] || topicId;
  };

  return (
    <div className="progress-page">
      <div className="container">
        {/* Header */}
        <div className="progress-header">
          <h1 className="heading-1">Tiến độ học tập</h1>
          <p>Theo dõi thành tích và sự tiến bộ của bạn</p>
        </div>

        {/* Overall Stats */}
        <div className="stats-overview grid grid-4">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>{userStats.totalLearnedWords}</h3>
              <p>Từ đã học</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>{userStats.totalQuizzes}</h3>
              <p>Quiz đã làm</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{userStats.averageScore}%</h3>
              <p>Điểm trung bình</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>{streak}</h3>
              <p>Ngày liên tiếp</p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="progress-section">
          <h2>Tiến độ tổng quan</h2>
          <div className="overall-progress">
            <div className="progress-info">
              <span>Tổng tiến độ: {userStats.overallProgress}%</span>
              <span>{userStats.totalLearnedWords}/{userStats.totalWords} từ</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${userStats.overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Topics Progress */}
        <div className="topics-progress-section">
          <h2>Tiến độ theo chủ đề</h2>
          
          {detailedStats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📖</div>
              <h3>Chưa có dữ liệu học tập</h3>
              <p>Bắt đầu học các chủ đề để xem tiến độ của bạn</p>
            </div>
          ) : (
            <div className="topics-progress-grid">
              {detailedStats.map(topic => (
                <div key={topic.id} className="topic-progress-card card">
                  <div className="topic-header">
                    <h3>{getTopicDisplayName(topic.id)}</h3>
                    <span className="progress-percentage">{topic.percentage}%</span>
                  </div>
                  
                  <div className="topic-progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${topic.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="topic-stats">
                    <div className="stat">
                      <span className="label">Từ đã học:</span>
                      <span className="value">{topic.learnedWords}/{topic.totalWords}</span>
                    </div>
                    
                    <div className="stat">
                      <span className="label">Quiz đã làm:</span>
                      <span className="value">{topic.totalQuizzes}</span>
                    </div>
                    
                    {topic.averageQuizScore > 0 && (
                      <div className="stat">
                        <span className="label">Điểm TB:</span>
                        <span className="value">{topic.averageQuizScore}%</span>
                      </div>
                    )}
                    
                    {topic.wordsNeedReview > 0 && (
                      <div className="stat review-needed">
                        <span className="label">Cần ôn tập:</span>
                        <span className="value">{topic.wordsNeedReview} từ</span>
                      </div>
                    )}
                    
                    <div className="stat">
                      <span className="label">Học lần cuối:</span>
                      <span className="value">{formatDate(topic.lastStudied)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {userStats.lastActivity && (
          <div className="recent-activity-section">
            <h2>Hoạt động gần đây</h2>
            <div className="activity-info">
              <p>Lần học cuối: {formatDate(userStats.lastActivity)}</p>
              <p>Số chủ đề đã bắt đầu: {userStats.topicsStarted}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;