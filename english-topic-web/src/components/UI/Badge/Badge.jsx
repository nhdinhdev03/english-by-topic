import PropTypes from "prop-types";
import "./Badge.scss";

const Badge = ({
  children,
  variant = "primary",
  size = "medium",
  dot = false,
  pill = false,
  outlined = false,
  className = "",
  ...props
}) => {
  const badgeClasses = [
    "badge",
    `badge-${variant}`,
    `badge-${size}`,
    dot && "badge-dot",
    pill && "badge-pill",
    outlined && "badge-outlined",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={badgeClasses} {...props}>
      {dot ? <span className="badge-dot-indicator"></span> : children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "neutral",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  dot: PropTypes.bool,
  pill: PropTypes.bool,
  outlined: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
