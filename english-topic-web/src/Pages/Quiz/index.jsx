import React from 'react';
import './Quiz.scss';

const Quiz = () => {
  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <h1>Trắc nghiệm</h1>
        <p>Kiểm tra kiến thức với câu hỏi trắc nghiệm 4 đáp án</p>
        {/* MCQ component sẽ được thêm ở đây */}
      </div>
    </div>
  );
};

export default Quiz;