import PropTypes from "prop-types";
import "./Card.scss";

const Card = ({
  children,
  variant = "default",
  hoverable = false,
  onClick,
  className = "",
  header,
  footer,
  bordered = true,
  padding = "medium",
  shadow = "medium",
  ...props
}) => {
  const cardClasses = [
    "card",
    `card-${variant}`,
    `card-padding-${padding}`,
    `card-shadow-${shadow}`,
    hoverable && "card-hoverable",
    !bordered && "card-no-border",
    onClick && "card-clickable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const CardWrapper = onClick ? "button" : "div";

  return (
    <CardWrapper className={cardClasses} onClick={onClick} {...props}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </CardWrapper>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "default",
    "primary",
    "success",
    "warning",
    "danger",
    "gradient",
  ]),
  hoverable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  bordered: PropTypes.bool,
  padding: PropTypes.oneOf(["none", "small", "medium", "large"]),
  shadow: PropTypes.oneOf(["none", "small", "medium", "large", "xl"]),
};

export default Card;
