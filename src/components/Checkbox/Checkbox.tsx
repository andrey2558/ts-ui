import React, { FC, memo, useMemo } from 'react';

export type CheckboxProps = {
    type?: 'roll' | 'radio';
    value: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
    children?: JSX.Element | string;
    className?: string;
};

const Checkbox: FC<CheckboxProps> = props => {
    const { value, type, disabled, onChange, children, className = '' } = props;

    const classNames = useMemo((): string => {
        let classes = className + ' ';
        if (value) {
            classes += 'isActive';
        }
        if (type) {
            classes += `${type === 'roll' ? 'checkboxRoll' : 'checkboxRadio'}`;
        }
        if (disabled) {
            classes += 'checkboxDisabled';
        }
        return classes;
    }, [value, type, disabled]);

    return (
        <label className={`checkbox ${classNames}`}>
            <span className="checkbox__checkboxCustom" />

            <input className="checkboxCustom__checkboxInput" type="checkbox" checked={value} disabled={disabled} onChange={() => onChange(!value)} />

            {children && <span className="checkboxCustom__checkboxText">{children}</span>}
        </label>
    );
};

export default memo(Checkbox);
