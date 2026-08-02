import "./Input.css";

function Input({
  label,
  icon,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="input-group">

      {label && (
        <label className="input-label">
          {label}
        </label>
      )}

      <div
        className={`input-container ${
          error ? "input-error" : ""
        } ${className}`}
      >
        {icon && (
          <span className="input-icon">
            {icon}
          </span>
        )}

        <input
          className="ui-input"
          {...props}
        />
      </div>

      {error && (
        <small className="input-error-text">
          {error}
        </small>
      )}

    </div>
  );
}

export default Input;