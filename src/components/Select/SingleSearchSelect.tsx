import React, { FC, memo, useRef } from 'react';
import { SingleSelectProps } from './SingleSelect';
import useSelect from './useSelect';
import useSearch, { SearchCallback, SearchProp } from './useSearch';
import CustomInput from '../CustomInput';

export type SingleSearchSelectProps = SingleSelectProps & {
    search: SearchProp;
    hideSearchIcon?: boolean;
    onSuccessfulRequest?: SearchCallback;
};
const SingleSearchSelect: FC<SingleSearchSelectProps> = props => {
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
    const { onInput, inputValue, dropItems, onItemClick } = useSearch({
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

    return (
        <div
            className={`select singleSelect ${className}`}
            style={{ position: 'relative' }}
            ref={mainRef}
            onKeyDown={e => useSelectData.onKeydown(e, onItemClick)}>
            {label && <span className="select__selectLabel">{label}</span>}
            <div
                className="select__singleInner"
                onKeyUp={e => {
                    e.keyCode === 13 && useSelectData.open();
                }}>
                <CustomInput
                    className="select__input"
                    value={inputValue}
                    onChange={onInput}
                    onFocus={() => useSelectData.open()}
                    type={'text'}
                    placeholder={placeholder}
                />
                <div className="select__iconWrapper">
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="select__icon isSearch">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.15 2A5.57 5.57 0 004.6 7.59c0 3.09 2.5 5.59 5.55 5.59 3.06 0 5.55-2.5 5.55-5.6C15.7 4.5 13.21 2 10.15 2zM2.6 7.59A7.57 7.57 0 0110.15 0c4.18 0 7.55 3.4 7.55 7.59A7.57 7.57 0 015.56 13.6l-4.16 4.1L0 16.3l4.15-4.1A7.58 7.58 0 012.6 7.6z"/>
                    </svg>
                </div>
            </div>
            {dropItems}
        </div>
    );
};
export default memo(SingleSearchSelect);
