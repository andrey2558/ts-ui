import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import MaskedInput from './MaskedInput';
import Counter from './Counter';
import { useDebounce } from '../../hooks/useDebounce';

export type CustomInputProps = {
  label?: string;
  readonly?: boolean;
  error?: string;
  value: string;
  type: 'text' | 'counter' | 'tel';
  name?: string;
  placeholder?: string;
  mask?: string;
  required?: boolean;
  min?: number;
  max?: number;
  onClearError?: () => void;
  onChange: (val: string) => void;
  onClick?: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
};
const CustomInput: FC<CustomInputProps> = props => {
  const {
    onClearError,
    label,
    error,
    onClick,
    onChange,
    value,
    type,
    name,
    placeholder,
    readonly,
    mask,
    className,
    min,
    max,
    onFocus,
    onBlur,
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  const { debounceChange, stringValue } = useDebounce(value, onChange, 150);
  useEffect(() => {
    debounceChange(value);
    // eslint-disable-next-line
  }, [value]);
  const focus = (e: string): void => {
    debounceChange(e);
    setIsFocused(true);
    onClearError && onClearError();
    onFocus && onFocus();
  };
  const blur = (): void => {
    setIsFocused(false);
    onBlur && onBlur();
  };
  const labelElement = useMemo(
    (): JSX.Element => <span className="input__labelText">{label}</span>,
    [label]
  );
  const errorElement = useMemo(
    (): JSX.Element => (
      <p className="input__errorMessage" title={error}>
        {error}
      </p>
    ),
    [error]
  );
  const classNames = useMemo((): string => {
    let string = '';
    if (error) {
      string += 'isError ';
    }
    if (isFocused && !error) {
      string += 'isSuccess ';
    }
    if (className) {
      string += className;
    }
    return string;
  }, [isFocused, error, className]);

  return (
    <div
      className={`input ${classNames}`}
      onClick={() => onClick && onClick(value)}
    >
      {type === 'text' && (
        <label className="input__label">
          {labelElement}
          <div className="input__wrapper">
            <input
              className="input__input"
              type={type}
              name={name}
              placeholder={placeholder}
              value={stringValue}
              disabled={!!readonly}
              autoComplete={'off'}
              onChange={e => debounceChange(e.currentTarget.value)}
              onFocus={e => focus(e.currentTarget.value)}
              onBlur={blur}
            />
          </div>
          {errorElement}
        </label>
      )}

      {type === 'tel' && (
        <label className="input__label">
          {labelElement}
          <div className="input__wrapper">
            <MaskedInput
              className="input__input"
              name={name}
              value={stringValue}
              mask={mask}
              disabled={!!readonly}
              onFocus={e => focus(e)}
              onBlur={() => blur()}
              onChange={e => debounceChange(e)}
            />
          </div>
          {errorElement}
        </label>
      )}

      {type === 'counter' && (
        <label>
          {labelElement}
          <div className="input__wrapper">
            <Counter
              value={parseFloat(value)}
              min={min}
              max={max}
              onChange={e => debounceChange(e + '')}
            />
          </div>
          {errorElement}
        </label>
      )}
    </div>
  );
};
export default memo(CustomInput);
