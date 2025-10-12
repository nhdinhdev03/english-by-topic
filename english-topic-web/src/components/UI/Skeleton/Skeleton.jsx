import PropTypes from "prop-types";
import "./Skeleton.scss";

const Skeleton = ({
  variant = "text",
  width,
  height,
  borderRadius,
  count = 1,
  className = "",
  animation = "pulse",
  ...props
}) => {
  const skeletonStyle = {
    width,
    height,
    borderRadius,
  };

  const skeletonClasses = [
    "skeleton",
    `skeleton-${variant}`,
    `skeleton-animation-${animation}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={skeletonClasses}
      style={skeletonStyle}
      {...props}
    />
  ));

  return count > 1 ? (
    <div className="skeleton-group">{skeletons}</div>
  ) : (
    skeletons
  );
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(["text", "circular", "rectangular", "rounded"]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.number,
  className: PropTypes.string,
  animation: PropTypes.oneOf(["pulse", "wave", "none"]),
};

// Preset components
export const SkeletonText = ({ lines = 3, ...props }) => (
  <Skeleton variant="text" count={lines} {...props} />
);

SkeletonText.propTypes = {
  lines: PropTypes.number,
};

export const SkeletonAvatar = ({ size = 48, ...props }) => (
  <Skeleton variant="circular" width={size} height={size} {...props} />
);

SkeletonAvatar.propTypes = {
  size: PropTypes.number,
};

export const SkeletonCard = ({ ...props }) => (
  <div className="skeleton-card" {...props}>
    <Skeleton variant="rectangular" height={180} />
    <div className="skeleton-card-content">
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" count={2} />
    </div>
  </div>
);

export const SkeletonList = ({ items = 5, ...props }) => (
  <div className="skeleton-list" {...props}>
    {Array.from({ length: items }, (_, index) => (
      <div key={index} className="skeleton-list-item">
        <SkeletonAvatar size={40} />
        <div className="skeleton-list-content">
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="80%" />
        </div>
      </div>
    ))}
  </div>
);

SkeletonList.propTypes = {
  items: PropTypes.number,
};

export default Skeleton;
