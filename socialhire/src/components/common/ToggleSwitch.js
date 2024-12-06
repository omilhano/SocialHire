import React from "react";
import "../../styles/ToggleSwitch.css";

const ToggleSwitch = ({ id, checked, onChange }) => {
  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="toggle-switch-checkbox"
      />
      <label htmlFor={id} className="toggle-switch-label">
        <span className="toggle-switch-inner" />
        <span className="toggle-switch-switch" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
