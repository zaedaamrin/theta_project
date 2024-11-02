import React from 'react';

const InputField = ({ label, type, placeholder, autoComplete, value, onChange }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="input-field"
        autoComplete={autoComplete}
        value={value} 
        onChange={onChange} 
      />
    </div>
  );
};

export default InputField;
