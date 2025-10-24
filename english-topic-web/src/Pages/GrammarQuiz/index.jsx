import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import "./GrammarQuiz.scss";

const GrammarQuiz = () => {
  const navigate = useNavigate();
  const [indexData, setIndexData] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load index data
  useEffect(() => {
    const loadIndexData = async () => {
      try {
        const response = await fetch("/data/Grammar-TopNotch2-Index.json");
        const data = await response.json();
        setIndexData(data);
      } catch (error) {
        console.error("Error loading index data:", error);
      }
    };
    loadIndexData();
  }, []);

  // Load quiz data for selected unit
  const loadUnitQuiz = async (unit) => {
    setLoading(true);
    try {
      const response = await fetch(`/data/${unit.fileData}`);
      const data = await response.json();
      setQuizData(data);
      setSelectedUnit(unit);
      setCurrentQuestion(0);
      setScore(0);
      setAnsweredQuestions([]);
      setQuizCompleted(false);
      setShowResult(false);
      setSelectedAnswer(null);
    } catch (error) {
      console.error("Error loading quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerClick = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  // Check answer
  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect =
      selectedAnswer === quizData.questions[currentQuestion].correctAnswer;

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        questionId: quizData.questions[currentQuestion].id,
        question: quizData.questions[currentQuestion].question,
        selectedAnswer,
        correctAnswer: quizData.questions[currentQuestion].correctAnswer,
        isCorrect,
        explanation: quizData.questions[currentQuestion].explanation,
        options: quizData.questions[currentQuestion].options,
      },
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setSelectedUnit(null);
    setQuizData(null);
    setCurrentQuestion(0);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizCompleted(false);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  // Restart same quiz
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizCompleted(false);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (!indexData) {
    return (
      <div className="grammar-quiz">
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Unit selection screen
  if (!selectedUnit) {
    return (
      <div className="grammar-quiz">
        <div className="quiz-header">
          <h1>{indexData.title}</h1>
          <p className="description">{indexData.description}</p>
        </div>

        <div className="units-grid">
          {indexData.units.map((unit) => (
            <Card key={unit.unitNumber} className="unit-card">
              <div className="unit-number">Unit {unit.unitNumber}</div>
              <h3 className="unit-name">{unit.unitName}</h3>
              <div className="unit-topic">{unit.topic}</div>
              <div className="unit-grammar">{unit.grammar}</div>
              <Button
                onClick={() => loadUnitQuiz(unit)}
                variant="primary"
                className="start-button"
              >
                Bắt đầu luyện tập
              </Button>
            </Card>
          ))}
        </div>

        <div className="quiz-instructions">
          <h3>📖 Hướng dẫn:</h3>
          <ul>
            <li>
              Mỗi Unit có <strong>50 câu hỏi</strong> trắc nghiệm
            </li>
            <li>Chọn đáp án đúng nhất trong 4 lựa chọn A, B, C, D</li>
            <li>
              Sau khi trả lời, bạn sẽ thấy <strong>giải thích chi tiết</strong>
            </li>
            <li>Hoàn thành tất cả câu hỏi để xem kết quả tổng hợp</li>
          </ul>
        </div>
      </div>
    );
  }

  // Quiz completed screen
  if (quizCompleted) {
    const percentage = ((score / quizData.questions.length) * 100).toFixed(1);
    let resultMessage = "";
    let resultClass = "";

    if (percentage >= 90) {
      resultMessage = "🌟 Xuất sắc! Bạn đã thành thạo chủ đề này!";
      resultClass = "excellent";
    } else if (percentage >= 70) {
      resultMessage = "👍 Tốt lắm! Bạn đã nắm vững phần lớn kiến thức!";
      resultClass = "good";
    } else if (percentage >= 50) {
      resultMessage = "💪 Khá tốt! Hãy ôn lại một số phần để cải thiện!";
      resultClass = "fair";
    } else {
      resultMessage = "📚 Hãy ôn lại kiến thức và thử lại nhé!";
      resultClass = "needs-improvement";
    }

    return (
      <div className="grammar-quiz">
        <Card className="quiz-result-card">
          <h2>🎯 Kết quả ôn tập</h2>
          <div className={`result-summary ${resultClass}`}>
            <div className="score-display">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {quizData.questions.length}</span>
            </div>
            <div className="percentage">{percentage}%</div>
            <p className="result-message">{resultMessage}</p>
          </div>

          <div className="quiz-info">
            <h3>{selectedUnit.unitName}</h3>
            <p>{quizData.topic}</p>
          </div>

          <div className="answers-review">
            <h3>📝 Xem lại câu trả lời</h3>
            <div className="answers-list">
              {answeredQuestions.map((answer, index) => (
                <div
                  key={index}
                  className={`answer-item ${
                    answer.isCorrect ? "correct" : "incorrect"
                  }`}
                >
                  <div className="answer-header">
                    <span className="question-number">Câu {index + 1}</span>
                    <span
                      className={`result-icon ${
                        answer.isCorrect ? "correct" : "incorrect"
                      }`}
                    >
                      {answer.isCorrect ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="question-text">{answer.question}</div>
                  <div className="options-review">
                    {answer.options.map((option, optIndex) => {
                      const isSelected = optIndex === answer.selectedAnswer;
                      const isCorrect = optIndex === answer.correctAnswer;
                      let className = "option-review";
                      if (isCorrect) className += " correct-answer";
                      if (isSelected && !isCorrect)
                        className += " wrong-answer";

                      return (
                        <div key={optIndex} className={className}>
                          <span className="option-label">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className="option-text">{option}</span>
                          {isCorrect && <span className="correct-mark">✓</span>}
                          {isSelected && !isCorrect && (
                            <span className="wrong-mark">✗</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="explanation">
                    <strong>💡 Giải thích:</strong> {answer.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="result-actions">
            <Button onClick={handleRestartQuiz} variant="primary">
              🔄 Làm lại bài này
            </Button>
            <Button onClick={handleResetQuiz} variant="secondary">
              📚 Chọn Unit khác
            </Button>
            <Button onClick={() => navigate("/")} variant="outline">
              🏠 Về trang chủ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Quiz in progress
  if (loading) {
    return (
      <div className="grammar-quiz">
        <div className="loading">Đang tải câu hỏi...</div>
      </div>
    );
  }

  if (!quizData || !quizData.questions) {
    return (
      <div className="grammar-quiz">
        <div className="error">Không tải được dữ liệu câu hỏi</div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="grammar-quiz">
      <div className="quiz-progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <Card className="quiz-card">
        <div className="quiz-header-info">
          <div className="unit-info">
            <span className="unit-label">Unit {selectedUnit.unitNumber}</span>
            <span className="topic-label">{quizData.topic}</span>
          </div>
          <div className="question-counter">
            Câu {currentQuestion + 1} / {quizData.questions.length}
          </div>
        </div>

        <div className="question-section">
          <h2 className="question-text">{question.question}</h2>

          <div className="options-grid">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              let className = "option-button";

              if (showResult) {
                if (isCorrect) className += " correct";
                else if (isSelected) className += " incorrect";
                else className += " disabled";
              } else if (isSelected) {
                className += " selected";
              }

              return (
                <button
                  key={index}
                  className={className}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showResult}
                >
                  <span className="option-label">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                  {showResult && isCorrect && (
                    <span className="check-mark">✓</span>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <span className="cross-mark">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className={`result-feedback ${
                selectedAnswer === question.correctAnswer
                  ? "correct"
                  : "incorrect"
              }`}
            >
              <div className="feedback-icon">
                {selectedAnswer === question.correctAnswer ? "✓" : "✗"}
              </div>
              <div className="feedback-content">
                <div className="feedback-title">
                  {selectedAnswer === question.correctAnswer
                    ? "Chính xác!"
                    : "Chưa đúng!"}
                </div>
                <div className="feedback-explanation">
                  <strong>💡 Giải thích:</strong> {question.explanation}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="quiz-actions">
          <div className="score-display-mini">
            Điểm: <strong>{score}</strong> /{" "}
            {currentQuestion + (showResult ? 1 : 0)}
          </div>

          {!showResult ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              variant="primary"
              className="check-button"
            >
              Kiểm tra đáp án
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              variant="primary"
              className="next-button"
            >
              {currentQuestion < quizData.questions.length - 1
                ? "Câu tiếp theo →"
                : "Xem kết quả"}
            </Button>
          )}

          <Button
            onClick={handleResetQuiz}
            variant="outline"
            className="exit-button"
          >
            Thoát
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GrammarQuiz;
