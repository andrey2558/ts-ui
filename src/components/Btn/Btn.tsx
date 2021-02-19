import React, { FC, memo, useMemo } from 'react';

export type BtnProps = {
  type?: 'success' | 'danger' | '';
  error?: any;
  iconPosition?: 'first' | 'last' | 'top' | 'bottom';
  title?: string;
  onClick?: () => void;
  onDbClick?: () => void;
  iconSlot?: JSX.Element;
  className?: string;
  children?: JSX.Element | string;
  disabled?: boolean;
};

const Btn: FC<BtnProps> = props => {
  const {
    onClick,
    onDbClick,
    type,
    iconPosition,
    error,
    iconSlot,
    children,
    className = '',
    disabled = false,
  } = props;

  const buttonClass = useMemo((): string => {
    let string = '';
    if (disabled) {
      string += ' disabled ';
    }
    if (error) {
      string += 'isError ';
    }
    if (type === 'success') {
      string += 'btnSuccess ';
    }
    if (type === 'danger') {
      string += 'btnDanger';
    }
    if (iconPosition === 'first') {
      string += 'iconFirst ';
    }
    if (iconPosition === 'last' || !iconPosition) {
      string += 'iconLast ';
    }
    if (iconPosition === 'top') {
      string += 'iconTop ';
    }
    if (iconPosition === 'bottom') {
      string += 'iconBottom ';
    }
    if (className) {
      string += className;
    }

    return string;
  }, [error, type, iconPosition, className]);

  return (
    <button
      className={`btn ${buttonClass}`}
      name="btn"
      onClick={onClick}
      onDoubleClick={onDbClick}
      disabled={disabled}
    >
      {children || ''}
      {iconSlot && iconSlot}
      {error && <p className="btn__errorMessage">{error}</p>}
    </button>
  );
};

export default memo(Btn);
