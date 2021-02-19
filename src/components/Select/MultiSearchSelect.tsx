import React, { FC, memo, useRef, useState } from 'react';
import useSelect from './useSelect';
import useSearch, { SearchCallback, SearchProp } from './useSearch';
import { MultiSelectProps } from './MultiSelect';
import CustomInput from '../CustomInput';
// import style from './Select.scss';

export type MultiSearchSelectProps = MultiSelectProps & {
  search: SearchProp;
  hideSearchIcon?: boolean;
  onSuccessfulRequest?: SearchCallback;
};

// const {
//   select,
//   selectInner,
//   selectLabel,
//   selectlist,
//   selectedItem,
//   selectDelete,
//   nested,
//   inputSearch,
//   isActive,
// } = style;

const MultiSearchSelect: FC<MultiSearchSelectProps> = props => {
  const mainRef = useRef(null);
  const {
    fields = { id: 'id', value: 'value' },
    hideOnSelect = true,
    items,
    onChange,
    value,
    placeholder = '',
    label = '',
    hideSearchIcon = false,
    onSuccessfulRequest,
    search,
    className = '',
  } = props;
  const useSelectData = useSelect({
    ref: mainRef,
    fields,
    hideOnSelect,
    items,
    onChange,
    value,
  });
  const {
    onInput,
    inputValue,
    dropItems,
    onItemClick,
    visibleValues,
    deleteOneOfMultipleValues,
  } = useSearch({
    items,
    fields,
    value,
    hideSearchIcon,
    onChange,
    onSuccessfulRequest,
    search,
    isOpen: useSelectData.isOpen,
    highlightIndex: useSelectData.highlightIndex,
    getDropList: useSelectData.getDropList,
    hide: useSelectData.hide,
    hideOnSelect,
  });
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const onInputFocus = () => {
    useSelectData.open();
    setIsInputVisible(true);
  };
  const onInputBlur = () => {
    setIsInputVisible(false);
  };
  return (
    <div
      className={`select ${className}`}
      style={{ position: 'relative' }}
      ref={mainRef}
      onKeyDown={e => useSelectData.onKeydown(e, onItemClick)}
    >
      <div className={`select__selectInner ${isInputVisible ? 'isActive' : ''}`}>
        {label && <span className="select__selectLabel">{label}</span>}
        <div className="select__selectlist" onClick={() => onInputFocus()}>
          {Array.isArray(visibleValues)
            ? visibleValues.map((v, i) => {
                if (v) {
                  return (
                    <div className="select__selectedItem" key={v.id}>
                      <button
                        className="select__selectDelete"
                        onClick={e => {
                          e.stopPropagation();
                          deleteOneOfMultipleValues(v.id + '');
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
          <CustomInput
            className={`select__inputSearch ${isInputVisible ? 'nested' : ''}`}
            value={inputValue}
            onChange={onInput}
            onFocus={() => onInputFocus()}
            onBlur={() => onInputBlur()}
            type={'text'}
          />
        </div>
        <div className="select__iconWrapper">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            className="select__icon isSearch"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.15 2A5.57 5.57 0 004.6 7.59c0 3.09 2.5 5.59 5.55 5.59 3.06 0 5.55-2.5 5.55-5.6C15.7 4.5 13.21 2 10.15 2zM2.6 7.59A7.57 7.57 0 0110.15 0c4.18 0 7.55 3.4 7.55 7.59A7.57 7.57 0 015.56 13.6l-4.16 4.1L0 16.3l4.15-4.1A7.58 7.58 0 012.6 7.6z"
            />
          </svg>
        </div>
      </div>
      {dropItems}
    </div>
  );
};
export default memo(MultiSearchSelect);
