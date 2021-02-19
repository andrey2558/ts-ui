import React, { FC, memo, useRef } from 'react';
import { SingleSelectProps } from './SingleSelect';
import useSelect from './useSelect';
// import style from './Select.scss';

export type MultiSelectProps = Omit<SingleSelectProps, 'value'> & {
  value: Array<string | number>;
};

// const {
//   select,
//   selectInner,
//   selectLabel,
//   selectedItem,
//   selectDelete,
//   selectlist,
// } = style;

const MultiSelect: FC<MultiSelectProps> = props => {
  const mainRef = useRef(null);
  const {
    fields = { id: 'id', value: 'value' },
    hideOnSelect = true,
    items,
    onChange,
    value,
    placeholder = '',
    label = '',
    className = '',
  } = props;
  const {
    isOpen,
    toggle,
    onKeydown,
    dropItems,
    getVisibleSelectedValues,
    deleteOneOfMultipleValues,
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
      className={`select ${className}`}
      style={{ position: 'relative' }}
      ref={mainRef}
      onKeyDown={e => onKeydown(e, onItemClick)}
    >
      <div className="select__selectInner">
        {label && <span className="select__selectLabel">{label}</span>}
        <div
          className={`select__selectlist ${isOpen ? "isOpen" : ''}`}
          onClick={() => toggle()}
        >
          {getVisibleSelectedValues
            ? getVisibleSelectedValues.map((v, i) => {
                if (v) {
                  return (
                    <div className="select__selectedItem" key={v?.id + '' + i}>
                      <button
                        className="select__selectDelete"
                        onClick={e => {
                          e.stopPropagation();
                          deleteOneOfMultipleValues(v.id);
                        }}
                      >
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 36 36"
                          fill=""
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M34 1H2a1 1 0 00-1 1v32c0 .6.4 1 1 1h32c.6 0 1-.4 1-1V2c0-.6-.4-1-1-1zM2 0a2 2 0 00-2 2v32c0 1.1.9 2 2 2h32a2 2 0 002-2V2a2 2 0 00-2-2H2z"
                          />
                          <path d="M24.5 9.6L18 16.1l-6.5-6.5-1.9 1.9 6.5 6.5-6.5 6.5 1.9 1.9 6.5-6.5 6.5 6.5 1.9-1.9-6.5-6.5 6.5-6.5-1.9-1.9z" />
                        </svg>
                      </button>
                      {v.value}
                    </div>
                  );
                } else {
                  return <div style={{ display: 'none' }} />;
                }
              })
            : placeholder}
        </div>
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
      </div>
      {dropItems}
    </div>
  );
};
export default memo(MultiSelect);
