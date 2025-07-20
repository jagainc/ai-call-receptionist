import React from 'react';
import '../styles/variables.css'; // Component-specific styles

/**
 * AppleStyleButton Component
 * A reusable button component styled to match the Apple light theme,
 * featuring glassmorphism effects for the default type and a solid primary variant.
 * It can also function as a link (<a> tag) if an 'href' is provided.
 *
 * @param {object} props - Component props.
 * @param {function} [props.onClick] - The function to call when the button is clicked.
 * Required if 'href' is not provided.
 * @param {string} props.text - The text content of the button.
 * @param {string} [props.type='default'] - The style type of the button.
 * Can be 'default' (glass) or 'primary' (solid blue).
 * @param {string} [props.href] - If provided, the button will render as an <a> tag
 * to navigate to this URL.
 * @param {boolean} [props.external=false] - If true and 'href' is provided,
 * the link will open in a new tab.
 * @param {boolean} [props.disabled=false] - If true, the button will be disabled and
 * non-interactive.
 * @param {boolean} [props.isLoading=false] - If true, shows a loading spinner inside the button.
 * @param {React.ReactNode} [props.icon] - An optional React node (e.g., SVG, FontAwesome icon)
 * to display alongside the text.
 * @param {string} [props.ariaLabel] - Optional ARIA label for accessibility.
 */
function AppleStyleButton({
  onClick,
  text,
  type = 'default',
  href,
  external = false,
  disabled = false,
  isLoading = false,
  icon,
  ariaLabel,
}) {
  const commonProps = {
    className: `apple-style-button ${type} ${disabled ? 'disabled' : ''} ${isLoading ? 'loading' : ''}`,
    'aria-label': ariaLabel || text,
    disabled: disabled || isLoading, // Disable if explicitly disabled or loading
  };

  // If href is provided, render an anchor tag (link)
  if (href) {
    return (
      <a
        href={href}
        {...commonProps}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })} // Open in new tab for external links
        onClick={disabled || isLoading ? (e) => e.preventDefault() : onClick} // Prevent click if disabled/loading
      >
        {isLoading ? (
          <span className="button-spinner"></span> // Loading spinner
        ) : (
          <>
            {icon && <span className="button-icon">{icon}</span>}
            {text}
          </>
        )}
      </a>
    );
  }

  // Otherwise, render a button tag
  return (
    <button
      onClick={onClick}
      {...commonProps}
    >
      {isLoading ? (
        <span className="button-spinner"></span> // Loading spinner
      ) : (
        <>
          {icon && <span className="button-icon">{icon}</span>}
          {text}
        </>
      )}
    </button>
  );
}

export default AppleStyleButton;
