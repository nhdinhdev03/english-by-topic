import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VocabularyPractice from '../../components/VocabularyPractice';
import WordList from '../../components/WordList';
import './Practice.css';

const Practice = () => {
  const { topicName } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [practiceMode, setPracticeMode] = useState('list'); // 'list' or 'practice'

  useEffect(() => {
    // Mock data cho demo (sẽ thay thế bằng việc load từ file JSON thực tế)
    const mockTopics = {
      animal: {
        title: "Động vật",
        description: "Học từ vựng về các loài động vật",
        words: [
          {
            english: "dog",
            vietnamese: "chó",
            pronunciation: "/dɔːɡ/",
            example: "I have a pet dog.",
            options: ["chó", "mèo", "chim", "cá"]
          },
          {
            english: "cat",
            vietnamese: "mèo", 
            pronunciation: "/kæt/",
            example: "The cat is sleeping on the sofa.",
            options: ["chó", "mèo", "thỏ", "gấu"]
          },
          {
            english: "bird",
            vietnamese: "chim",
            pronunciation: "/bɜːrd/",
            example: "The bird is singing in the tree.",
            options: ["cá", "chim", "voi", "sư tử"]
          },
          {
            english: "elephant",
            vietnamese: "voi",
            pronunciation: "/ˈeləfənt/",
            example: "The elephant is the largest land animal.",
            options: ["voi", "hổ", "gấu", "ngựa"]
          },
          {
            english: "lion",
            vietnamese: "sư tử",
            pronunciation: "/ˈlaɪən/",
            example: "The lion is known as the king of the jungle.",
            options: ["hổ", "sư tử", "gấu", "thỏ"]
          }
        ]
      },
      food: {
        title: "Thức ăn",
        description: "Từ vựng về đồ ăn thức uống",
        words: [
          {
            english: "apple",
            vietnamese: "táo",
            pronunciation: "/ˈæpəl/",
            example: "An apple a day keeps the doctor away.",
            options: ["táo", "chuối", "cam", "nho"]
          },
          {
            english: "banana",
            vietnamese: "chuối",
            pronunciation: "/bəˈnænə/",
            example: "Bananas are rich in potassium.",
            options: ["táo", "chuối", "dưa hấu", "dứa"]
          },
          {
            english: "rice",
            vietnamese: "cơm",
            pronunciation: "/raɪs/",
            example: "We eat rice every day.",
            options: ["cơm", "bánh mì", "mì", "phở"]
          }
        ]
      }
    };

    // Simulate loading data
    setTimeout(() => {
      const data = mockTopics[topicName];
      if (data) {
        setTopicData(data);
        setIsLoading(false);
      } else {
        setError('Chủ đề không tồn tại');
        setIsLoading(false);
      }
    }, 500);
  }, [topicName]);

  const handlePracticeComplete = (results, stats) => {
    console.log('Practice completed:', results, stats);
    setPracticeMode('list');
  };

  if (isLoading) {
    return (
      <div className="practice-loading">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Đang tải chủ đề...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="practice-error">
        <div className="container">
          <h2>⚠️ Có lỗi xảy ra</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (practiceMode === 'practice') {
    return (
      <VocabularyPractice 
        words={topicData.words}
        topicTitle={topicData.title}
        onComplete={handlePracticeComplete}
      />
    );
  }

  return (
    <div className="practice">
      <div className="container">
        <div className="practice-header">
          <button onClick={() => navigate('/')} className="btn-back">
            ← Quay lại
          </button>
          <div className="practice-info">
            <h1>Luyện phát âm: {topicData.title}</h1>
            <p>{topicData.description}</p>
          </div>
          <button 
            onClick={() => setPracticeMode('practice')} 
            className="btn-start-practice"
          >
            🎤 Bắt đầu luyện tập
          </button>
        </div>
        
        <WordList 
          words={topicData.words} 
          title={`Danh sách từ vựng - ${topicData.title}`}
          showPractice={true}
        />
      </div>
    </div>
  );
};

export default Practice;