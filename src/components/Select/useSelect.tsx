import { MutableRefObject, useMemo, useState } from 'react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import get from 'lodash.get';
import React from 'react';

export type UseSelectProps = {
    ref: MutableRefObject<any>;
    items: any[];
    fields: MainItemStructure;
    hideOnSelect: boolean;
    onChange: (item: any) => void;
    value: string | number | Array<string | number>;
};
export type MainItemStructure = {
    id: string;
    value: string;
};
export type RendererList = Array<{
    id: string;
    value: string;
    isActive: boolean;
    isHighlighted: boolean;
}>;
export type SingleCallback = (value: string) => void;
export type MultipleCallback = (value: string[]) => void;
export type SelectCallback = {
    single?: SingleCallback;
    multiple?: MultipleCallback;
};

export default (props: UseSelectProps) => {
    const { ref, items, value, fields, hideOnSelect, onChange } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const open = (): void => setIsOpen(true);
    const hide = (): void => setIsOpen(false);
    const toggle = (): void => setIsOpen(!isOpen);
    useOnClickOutside(ref, hide);

    const [highlightIndex, setHighlightIndex] = useState<number>(0);

    const getDropList = (items: any[], value: string | number | Array<string | number>, highlightIndex: number): RendererList => {
        return items.map((item, index) => {
            const id = get(item, fields.id, '') + '';
            const fValue = get(item, fields.value, '');
            const isActive = Array.isArray(value) ? value.map(v => v + '').includes(id) : id === value + '';
            const isHighlighted = highlightIndex === index;

            return {
                id,
                value: fValue,
                isActive,
                isHighlighted,
            };
        });
    };

    const dropItems: JSX.Element = useMemo(() => {
        const dropItems = getDropList(items, value, highlightIndex);

        if (dropItems.length > 0) {
            return (
                <div className={`select__dropList ${isOpen ? '' : 'dNone'}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                    {dropItems.map((item, index) => (
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
    }, [items, value, highlightIndex, fields, isOpen]);
    const getVisibleSelectedValue: MainItemStructure = useMemo(() => {
        let id = '';
        let val = '';
        if (Array.isArray(value) === false) {
            const clone = items.find(i => {
                const itemId = get(i, fields.id, '');
                return itemId + '' === value + '';
            });
            id = get(clone, fields.id, '');
            val = get(clone, fields.value, '');
        }

        return {
            id,
            value: val,
        };
    }, [items, fields, value]);

    const getVisibleSelectedValues: MainItemStructure[] = useMemo(() => {
        return Array.isArray(value)
            ? value.map(id => {
                  return items.find(i => {
                      const itemId = get(i, fields.id, '') + '';
                      return itemId + '' === id + '';
                  });
              })
            : [];
    }, [value, items, fields]);

    const onItemClick = (idValue: string | number, callback?: SelectCallback): void => {
        if (hideOnSelect) {
            hide();
        }
        const idV = idValue + '';
        if (Array.isArray(value)) {
            if (value.map(v => v + '').includes(idV)) {
                const ids = value.filter(v => v + '' !== idV);
                onChange(
                    ids
                        .map(i => {
                            return items.find(item => {
                                const itemId = get(item, props.fields.id, '') + '';
                                return itemId === i + '';
                            });
                        })
                        .filter(v => v)
                );
            } else {
                const clone = items.find(i => {
                    const itemId = get(i, fields.id, '') + '';
                    return itemId + '' === idValue + '';
                });
                const ids = [...value, get(clone, fields.id, '')];
                onChange(
                    ids
                        .map(i => {
                            return items.find(item => {
                                const itemId = get(item, props.fields.id, '') + '';
                                return itemId === i + '';
                            });
                        })
                        .filter(v => v)
                );
            }
        } else {
            const clone = items.find(i => {
                const itemId = get(i, fields.id, '') + '';
                return itemId + '' === idV;
            });
            if (clone) {
                const getId = get(clone, fields.id, '');
                const cloneParam = getId + '' === value + '' ? null : clone;
                onChange(cloneParam);
            }
        }
    };
    const onKeydown = (e: any, callback: (v: string | number) => void) => {
        if (isOpen) {
            let dropList = ref.current;
            if (dropList) {
                let dropListOffset = dropList.scrollTop;
                if (highlightIndex >= 0) {
                    if (e.keyCode === 40 && highlightIndex + 1 < props.items.length) {
                        e.preventDefault();
                        setHighlightIndex(highlightIndex + 1);
                        dropList.scrollTo({
                            top: dropListOffset + 36,
                            behavior: 'auto',
                        });
                    }
                    if (e.keyCode === 38 && highlightIndex > 0) {
                        e.preventDefault();
                        setHighlightIndex(highlightIndex - 1);
                        dropList.scrollTo({
                            top: dropListOffset - 36,
                            behavior: 'auto',
                        });
                    }
                    if (e.keyCode === 13 && !e.ctrlKey) {
                        e.preventDefault();
                        callback(get(props.items[highlightIndex], props.fields.id, ''));
                    }
                    if (e.keyCode === 9) {
                        hide();
                    }
                    if (e.keyCode === 13 && e.ctrlKey) {
                        e.preventDefault();
                        callback(get(props.items[highlightIndex], props.fields.id, ''));
                    }
                }
            }
        } else if (e.code === 'Enter' && !e.ctrlKey) {
            e.preventDefault();
            open();
        }
    };
    const deleteOneOfMultipleValues = (id: string, stateItems: any[] = items): void => {
        if (Array.isArray(value)) {
            const changedValue = value
                .filter(v => v + '' !== id + '')
                .map(i => {
                    return stateItems.find(item => {
                        const itemId = get(item, fields.id, '');
                        return itemId + '' === i + '';
                    });
                })
                .filter(v => v);
            onChange(changedValue);
            if (hideOnSelect) {
                hide();
            }
        }
    };

    return {
        isOpen,
        open,
        hide,
        toggle,
        onKeydown,
        getDropList,
        getVisibleSelectedValue,
        getVisibleSelectedValues,
        highlightIndex,
        deleteOneOfMultipleValues,
        onItemClick,
        dropItems,
    };
};
