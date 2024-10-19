import React from 'react';

const InputField = ({ label, type, placeholder }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} placeholder={placeholder} className="input-field" />
    </div>
  );
};

export default InputField;