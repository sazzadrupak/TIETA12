import React from "react";
const Radio = ({ name, label, id, ...rest }) => {
  return (
    <div className="form-check form-check-inline">
      <input
        {...rest}
        name={name}
        id={id}
        type="radio"
        className="form-check-input"
      />
      <label htmlFor={id} className="form-check-label">
        {label}
      </label>
    </div>
  );
};

export default Radio;
