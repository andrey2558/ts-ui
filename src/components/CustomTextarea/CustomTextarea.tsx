import React, { FC, memo } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useDebounce } from '../../hooks/useDebounce';

export type CustomTextareaType = {
  value: string;
  onChange: (string: string) => void;
  label?: string;
  error?: string;
  minRows?: number;
  onClearError?: () => void;
  className?: string;
  readonly?: boolean;
  placeholder?: string;
};

const CustomTextarea: FC<CustomTextareaType> = props => {
  const {
    value,
    onChange,
    label = '',
    error = '',
    minRows = 3,
    onClearError = () => {},
    className = '',
    readonly = false,
    placeholder = '',
  } = props;
  const { stringValue, debounceChange } = useDebounce(value, onChange, 150);
  const change = (value: string): void => {
    debounceChange(value);
    onClearError();
  };
  return (
    <label className={`textArea ${className}`}>
      <span className="textArea__label">{label}</span>
      <TextareaAutosize
        disabled={readonly}
        className="textArea__textareaInner"
        cacheMeasurements
        value={stringValue}
        onChange={e => change(e.target.value)}
        placeholder={placeholder}
        minRows={minRows}
      />
      {error}
    </label>
  );
};
export default memo(CustomTextarea);
