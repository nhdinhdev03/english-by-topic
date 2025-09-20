import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>English Vocabulary</h3>
            <p>Học từ vựng tiếng Anh theo chủ đề một cách hiệu quả và thú vị.</p>
          </div>
          
          <div className="footer-section">
            <h4>Liên kết hữu ích</h4>
            <ul>
              <li><a href="/">Trang chủ</a></li>
              <li><a href="/about">Giới thiệu</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Liên hệ</h4>
            <p>Email: support@englishvocab.com</p>
            <p>Phone: +84 123 456 789</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 English Vocabulary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;