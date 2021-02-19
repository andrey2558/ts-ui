import React, { FC, memo, useCallback, useEffect } from 'react';
import IMask from 'imask';

export type MaskedInputProps = {
    mask?: string;
    value: string;
    name?: string;
    onChange: (e: string) => void;
    className?: string;
    onFocus: (e:string) => void;
    onBlur: () => void;
    disabled?: boolean;
};
const MaskedInput: FC<MaskedInputProps> = props => {
    const { mask = '+{7}(000) 000-0000', value, onChange, className, onBlur, onFocus, disabled } = props;
    const maskOptions: IMask.AnyMaskedOptions = {
        mask,
        lazy: false,
    };
    let iMask: IMask.InputMask<typeof maskOptions> | undefined;
    useEffect(() => {
        return () => {
            iMask?.destroy();
        };
    }, [mask, iMask]);
    const inputRef = useCallback(
        (element: HTMLInputElement) => {
            // eslint-disable-next-line
            element && (iMask = IMask(element, maskOptions));
        },
        // eslint-disable-next-line
        [mask]
    );

    return (
        <input
            className={className}
            ref={inputRef}
            value={value}
            disabled={disabled}
            onChange={e => onChange(e.currentTarget.value)}
            onInput={e => onChange(e.currentTarget.value)}
            onFocus={e => onFocus(e.currentTarget.value)}
            onBlur={onBlur}
        />
    );
};
export default memo(MaskedInput);