import React from 'react';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>English by Topic</h3>
            <p>Học 3000+ từ cốt lõi với trải nghiệm chống học vẹt</p>
          </div>
          
          <div className="footer-section">
            <h4>Tính năng</h4>
            <ul>
              <li>Ôn tập chủ động</li>
              <li>Luyện phát âm</li>
              <li>Theo dõi tiến độ</li>
              <li>Trắc nghiệm thông minh</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <ul>
              <li>Hướng dẫn sử dụng</li>
              <li>Góp ý</li>
              <li>Báo lỗi</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} English by Topic. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;