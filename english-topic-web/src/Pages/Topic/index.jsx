import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import VocabularyQuiz from '../../components/VocabularyQuiz';
import './Topic.css';

const Topic = () => {
  const { topicName } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topicData, setTopicData] = useState(null);

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

  useEffect(() => {
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
          <button onClick={() => navigate('/')} className="btn-primary">
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="topic">
      <div className="container">
        <div className="topic-header">
          <button onClick={() => navigate('/')} className="btn-back">
            ← Quay lại
          </button>
          <div className="topic-info">
            <h1>{topicData.title}</h1>
            <p>{topicData.description}</p>
          </div>
        </div>
        
        <VocabularyQuiz words={topicData.words} topicTitle={topicData.title} />
      </div>
    </div>
  );
};

export default Topic;