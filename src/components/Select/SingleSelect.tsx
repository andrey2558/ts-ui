import React, { FC, memo, useRef } from 'react';
import useSelect, { MainItemStructure } from './useSelect';

export type SingleSelectProps = {
  value: string | number;
  items: any[];
  label?: string;
  readonly?: boolean;
  hideOnSelect?: boolean;
  placeholder?: string;
  fields?: MainItemStructure;
  onChange: (value: any) => void;
  error?: string;
  onClearError?: () => void;
  className?: string;
};
const SingleSelect: FC<SingleSelectProps> = props => {
  const mainRef = useRef(null);
  const {
    fields = { id: 'id', value: 'value' },
    hideOnSelect = true,
    items,
    onChange,
    value,
    placeholder = '',
    label = '',
    error = '',
    className = '',
  } = props;
  const {
    isOpen,
    toggle,
    onKeydown,
    getVisibleSelectedValue,
    dropItems,
    onItemClick,
  } = useSelect({
    ref: mainRef,
    fields,
    hideOnSelect,
    items,
    onChange,
    value,
  });

  return (
    <div
      className={`select select__singleSelect ${className}`}
      style={{ position: 'relative' }}
      ref={mainRef}
      onKeyDown={e => onKeydown(e, onItemClick)}
    >
      {label && <span className="select__selectLabel">{label}</span>}
      <div className="select__singleInner">
        <button
          className={`select__singleButton ${isOpen ? "isOpen" : ''}`}
          onClick={toggle}
        >
          {getVisibleSelectedValue?.value || placeholder}
        </button>
        <div className="select__iconWrapper">
          <svg
            className="select__icon"
            width="8"
            height="12"
            viewBox="0 0 8 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 4.10742L4 -0.000140408L8 4.10742H0Z" />
            <path d="M0 7.89258L4 12.0001L8 7.89258H0Z" />
          </svg>
        </div>
        {error}
      </div>

      {dropItems}
    </div>
  );
};
export default memo(SingleSelect);
