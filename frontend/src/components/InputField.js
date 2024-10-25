import React from 'react';

const InputField = ({ label, type, placeholder, autoComplete }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="input-field"
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default InputField;
