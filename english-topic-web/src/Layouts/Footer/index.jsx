import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    features: [
      { name: 'Ôn tập chủ động', path: '/quiz' },
      { name: 'Luyện phát âm', path: '/learn' },
      { name: 'Theo dõi tiến độ', path: '/progress' },
      { name: 'Trắc nghiệm thông minh', path: '/quiz' },
    ],
    topics: [
      { name: 'Đời sống hàng ngày', path: '/topics/daily-life' },
      { name: 'Công việc', path: '/topics/work' },
      { name: 'Du lịch', path: '/topics/travel' },
      { name: 'Xem tất cả', path: '/topics' },
    ],
    support: [
      { name: 'Hướng dẫn sử dụng', path: '/help' },
      { name: 'Góp ý', path: '/feedback' },
      { name: 'Báo lỗi', path: '/report' },
      { name: 'Cài đặt', path: '/settings' },
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: '📦', url: 'https://github.com' },
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <Link to="/" className="footer-logo">
              <h3>English by Topic</h3>
            </Link>
            <p className="footer-description">
              Học 3000+ từ cốt lõi với trải nghiệm chống học vẹt. 
              Phương pháp học hiệu quả, thân thiện và hoàn toàn miễn phí.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={social.name}
                >
                  <span>{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Features Section */}
          <div className="footer-section">
            <h4>Tính năng</h4>
            <ul className="footer-links">
              {footerLinks.features.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Topics Section */}
          <div className="footer-section">
            <h4>Chủ đề phổ biến</h4>
            <ul className="footer-links">
              {footerLinks.topics.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Section */}
          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <ul className="footer-links">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} English by Topic. Tất cả quyền được bảo lưu.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="footer-bottom-link">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="footer-bottom-link">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;