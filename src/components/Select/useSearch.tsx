import { MainItemStructure, RendererList } from './useSelect';
import React, { useEffect, useMemo, useState } from 'react';
import get from 'lodash.get';

export type SingleCallback = (value: string) => void;
export type SearchProp = {
    isLocal?: boolean;
    searchParams?: {
        url: string;
        field: string;
        nameField: string;
        idField: string;
        searchField: string;
        params: {
            search?: string;
            headers: any;
        };
    };
};
export type UseSearchProps = {
    search: SearchProp;
    items: any[];
    onSuccessfulRequest?: (data: any) => any;
    hideSearchIcon: boolean;
    fields: MainItemStructure;
    value: string | number | Array<string | number>;
    onChange: (item: any) => void;
    highlightIndex: number;
    isOpen: boolean;
    getDropList: (items: any[], value: string | number | Array<string | number>, highlightIndex: number) => RendererList;
    hideOnSelect: boolean;
    hide: () => void;
};
export type SearchCallback = (data: any[]) => any[];

export default (props: UseSearchProps) => {
    const { items, value, search, onChange, fields, highlightIndex, isOpen, getDropList, hide, hideOnSelect, onSuccessfulRequest } = props;
    const getCurrentInputValue: string = useMemo(() => {
        let str: string = '';
        if (Array.isArray(value)) {
            //
        } else {
            const clone = items.find(item => {
                const iId = get(item, fields.id, '');
                return iId === value;
            });
            if (clone) {
                str = get(clone, fields.value, '');
            }
        }
        return str;
    }, [value, items, fields.value, fields.id]);
    const [stateItems, setStateItems] = useState<any[]>(items);

    const [visibleValues, setVisibleValues] = useState<{ id: string | number; value: string }[]>([]);
    useEffect(() => {
        if (Array.isArray(value)) {
            const arr: any[] = [];

            value.forEach((val, index) => {
                let clone = stateItems.find(i => {
                    const iId = get(i, fields.id, '');
                    return iId + '' === val + '';
                });
                if (!clone) {
                    clone = visibleValues[index];
                }
                arr.push({
                    id: get(clone, fields.id, ''),
                    value: get(clone, fields.value, ''),
                });
            });

            setVisibleValues(arr);
        }
        // eslint-disable-next-line
    }, []);

    const [inputValue, setInputValue] = useState<string>(getCurrentInputValue);
    useEffect(() => {
        const value = inputValue.toLowerCase();

        if (search.isLocal && value) {
            //if is local search
            const newItems = items.filter(v => {
                const iValue = get(v, fields.value, '').toLowerCase();
                return iValue.includes(value);
            });
            setStateItems(newItems);
        } else if (search.isLocal && !value) {
            //if is local search and value === ''
            setStateItems(items);
        } else if (search.searchParams && value) {
            //if is async search
            const fetchMethod = async (search: SearchProp, searchString: string): Promise<any> => {
                const getQueryParamsFromObject = (queryObject: any, searchStr: string): string => {
                    queryObject[search.searchParams?.searchField || 'q'] = searchStr;
                    let queryString = '?';

                    for (let k in queryObject) {
                        if (queryObject.hasOwnProperty(k) && ![undefined, null, ''].includes(queryObject[k])) {
                            if (Array.isArray(queryObject[k])) {
                                // eslint-disable-next-line
                                queryObject[k].forEach((i: any) => {
                                    queryString += `${k}[]=${i}&`;
                                });
                            } else if (k !== 'headers') {
                                queryString += `${k}=${queryObject[k]}&`;
                            }
                        }
                    }

                    return queryString.slice(0, -1);
                };

                const params = search.searchParams;
                if (params) {
                    const headers = params.params.headers;

                    let query = '';
                    if (params.params) {
                        query = getQueryParamsFromObject(params.params, searchString);
                    }

                    const url = `${params.url || ''}${query ? query : ''}`;
                    const response = await fetch(url, { headers: headers });
                    return response.json();
                }
            };
            fetchMethod(search, value).then(response => {
                const list = get(response, search?.searchParams?.field || 'items', []);

                if (Array.isArray(list) && list.length > 0) {
                    setStateItems(
                        typeof onSuccessfulRequest === 'function'
                            ? onSuccessfulRequest(list)
                            : list.map(item => ({
                                  ...item,
                                  [fields.id]: get(item, search.searchParams?.idField || '', ''),
                                  [fields.value]: get(item, search.searchParams?.nameField || '', ''),
                              }))
                    );
                }
            });
        }
        // eslint-disable-next-line
    }, [inputValue]);

    const onInput = (e: string) => {
        const value = e.toLowerCase();
        setInputValue(value);
    };

    const onBlur = (): void => {
        const reset = (): void => {
            setInputValue('');
        };
        if (!inputValue) {
            reset();
        } else {
            const clone = items.find(i => {
                const idV = get(i, props.fields.id, '');
                return idV === value;
            });
            if (clone) {
                setInputValue(get(clone, props.fields.value, ''));
            } else {
                reset();
            }
        }
    };

    const onItemClickCallback: SingleCallback = (value: any): void => {
        setInputValue(value ? get(value, props.fields.value, '') : '');
    };

    const onItemClick = (idValue: string | number): void => {
        if (hideOnSelect) {
            hide();
        }
        const idV = idValue + '';
        if (Array.isArray(value)) {
            //if is multiple input
            if (value.map(v => v + '').includes(idV)) {
                //if is delete multiple input action
                deleteOneOfMultipleValues(idV);
            } else {
                //is push multiple input action
                const clone = stateItems.find(i => {
                    const itemId = get(i, fields.id, '') + '';
                    return itemId + '' === idV;
                });
                const changedValue = [...visibleValues, clone];
                console.log(
                    changedValue.map(item => ({
                        id: get(item, fields.id, '') + '',
                        value: get(item, fields.value, '') + '',
                    }))
                );
                setVisibleValues(
                    changedValue.map(item => ({
                        id: get(item, fields.id, '') + '',
                        value: get(item, fields.value, '') + '',
                    }))
                );
                onChange(changedValue);
            }
        } else {
            //single input
            const clone = stateItems.find(i => {
                const itemId = get(i, fields.id, '') + '';
                return itemId + '' === idV;
            });
            if (clone) {
                const getId = get(clone, fields.id, '');
                const cloneParam = getId + '' === value + '' ? null : clone;
                onChange(cloneParam);
                onInput(get(cloneParam, fields.value, ''));
            }
        }
    };

    const dropItems: JSX.Element = useMemo(() => {
        const dropList = getDropList(stateItems, value, highlightIndex);
        if (dropList.length > 0) {
            return (
                <div className={`select__dropList ${isOpen ? '' : 'dNone'}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                    {dropList.map((item, index) => (
                        <button
                            className={`select__dropItem ${item.isActive ? 'isSelected' : ''} ${item.isHighlighted ? 'isActive' : ''}`}
                            key={item.id}
                            onClick={() => onItemClick(item.id)}>
                            {item.value}
                        </button>
                    ))}
                </div>
            );
        } else {
            return <div style={{ display: 'none' }} />;
        }
        // eslint-disable-next-line
    }, [stateItems, value, highlightIndex, fields, isOpen]);

    const deleteOneOfMultipleValues = (id: string): void => {
        if (Array.isArray(value)) {
            const ids = value.filter(v => v + '' !== id);
            const changedValue = ids.map(i => {
                let clone = stateItems.find(item => {
                    const itemId = get(item, props.fields.id, '') + '';
                    return itemId === i + '';
                });
                if (!clone) {
                    clone = visibleValues.find(item => {
                        return item.id + '' === i + '';
                    });
                }
                return clone;
            });
            setVisibleValues(
                changedValue.map(item => ({
                    id: get(item, fields.id, '') + '',
                    value: get(item, fields.value, '') + '',
                }))
            );

            onChange(changedValue);
        }
    };

    return { stateItems, onInput, inputValue, onItemClickCallback, onBlur, dropItems, onItemClick, visibleValues, deleteOneOfMultipleValues };
};
