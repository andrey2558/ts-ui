import React, { FC, memo, useMemo } from 'react';
import { MainItemStructure } from './useSelect';
import { SearchCallback, SearchProp } from './useSearch';
import SingleSelect from './SingleSelect';
import MultiSelect from './MultiSelect';
import MultiSearchSelect from './MultiSearchSelect';
import SingleSearchSelect from './SingleSearchSelect';

export type SelectProp = {
    value: string | number | Array<string | number>;
    items: any[];
    label?: string;
    readonly?: boolean;
    hideOnSelect?: boolean;
    placeholder?: string;
    fields?: MainItemStructure;
    onChange: (value: any) => void;
    error?: string;
    onClearError?: () => void;
    search?: SearchProp;
    hideSearchIcon?: boolean;
    onSuccessfulRequest?: SearchCallback;
    className?: string;
};
const Select: FC<SelectProp> = props => {
    const {
        value,
        search,
        label = '',
        items,
        hideOnSelect = true,
        hideSearchIcon = false,
        onChange,
        onSuccessfulRequest,
        onClearError = () => {
        },
        fields = { id: 'id', value: 'value' },
        placeholder = '',
        error,
        className = '',
    } = props;
    const component = useMemo(() => {
        let component: typeof SingleSelect | typeof MultiSelect | typeof MultiSearchSelect | typeof SingleSearchSelect | undefined;
        let prop: any = {
            fields,
            label,
            value,
            items,
            placeholder,
            onChange,
            onClearError,
            hideOnSelect,
            error,
        };
        if (Array.isArray(value) && search) {
            component = MultiSearchSelect;
            prop.search = search;
            prop.onSuccessfulRequest = onSuccessfulRequest;
            prop.hideSearchIcon = hideSearchIcon;
        } else if (Array.isArray(value) && !search) {
            component = MultiSelect;
        } else if (!Array.isArray(value) && search) {
            component = SingleSearchSelect;
            prop.search = search;
            prop.onSuccessfulRequest = onSuccessfulRequest;
            prop.hideSearchIcon = hideSearchIcon;
        } else {
            component = SingleSelect;
        }
        prop.className = className;

        return { component, prop };
        // eslint-disable-next-line
    }, [value, search]);

    const SelectComponent = useMemo(() => {
        return component.component;
    }, [component]);
    const selectProps = useMemo(() => {
        return component.prop;
    }, [component]);

    return <SelectComponent {...selectProps} />;
};
export default memo(Select);