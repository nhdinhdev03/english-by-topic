import PropTypes from 'prop-types';
import { useLanguage } from '../../contexts/useLanguage';
import './AudioButton.scss';

const AudioButton = ({ 
  text, 
  language = 'en', 
  size = 'medium',
  variant = 'primary',
  className = '',
  onClick,
  disabled = false,
  ...props 
}) => {
  const { t, playText } = useLanguage();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick(e);
    }
    
    if (text && !disabled) {
      playText(text, language);
    }
  };

  const sizeClass = {
    small: 'audio-btn--small',
    medium: 'audio-btn--medium', 
    large: 'audio-btn--large'
  }[size];

  const variantClass = {
    primary: 'audio-btn--primary',
    secondary: 'audio-btn--secondary',
    minimal: 'audio-btn--minimal'
  }[variant];

  return (
    <button
      className={`audio-btn ${sizeClass} ${variantClass} ${className} ${disabled ? 'audio-btn--disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      title={t('listenToPronunciation')}
      aria-label={t('playPronunciation')}
      {...props}
    >
      <span className="audio-btn__icon">🔊</span>
      <span className="audio-btn__ripple"></span>
    </button>
  );
};

AudioButton.propTypes = {
  text: PropTypes.string.isRequired,
  language: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'minimal']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default AudioButton;