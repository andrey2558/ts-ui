import React, { FC, memo, useEffect, useState } from 'react';

export type CounterProps = {
    value: number;
    name?: string;
    disabled?: boolean;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
};

const Counter: FC<CounterProps> = props => {
    const {
        onChange,
        value,
        min = 0,
        max = Number.MAX_SAFE_INTEGER,
        name = 'counter',
        disabled = false,
    } = props;
    const [state, setState] = useState<string>(value + '');
    useEffect(() => {
        const val = value + '';
        if (val !== state) {
            setState(val);
        }
    }, [value]);
    const valid = (number: number): number => {
        number = [NaN].includes(number) ? min : number;
        if (number < min) {
            number = min;
        }
        if (number > max) {
            number = max;
        }
        return number;
    };
    const increment = (): void => {
        const value = valid(parseFloat(state) + 1);
        setState(value + '');
        onChange(value);
    };
    const decrement = (): void => {
        const value = valid(parseFloat(state) - 1);
        setState(value + '');
        onChange(value);
    };
    const input = (e: string): void => setState(e);
    const update = (): void => {
        const val = value + '';
        if (val !== state) {
            setState(valid(parseFloat(state)) + '');
            onChange(valid(parseFloat(state)));
        }
    };

    return (
        <div className={`counter ${disabled ? 'isDisabled' : ''}`}>
            <button
                className="counter__item counter__item--minus"
                name="decrement"
                onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    decrement();
                }}
            >
                <svg
                    className="counter__icon"
                    width="10"
                    height="2"
                    viewBox="0 0 10 2"
                    fill=""
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 1.71422H5.71429H4.28571H0V0.285645H4.28571L5.71429 0.285784L10 0.285645V1.71422Z"
                    />
                </svg>
            </button>

            <label className="counter__item">
        <span className="visually-hidden" hidden>
          Counter
        </span>
                <input
                    name={name}
                    type="number"
                    className="counter__field"
                    value={state}
                    disabled={disabled}
                    onBlur={update}
                    onChange={e => input(e.currentTarget.value)}
                    onKeyUp={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (e.key === 'Enter') {
                            update();
                        }
                    }}
                />
            </label>

            <button
                className="counter__item counter__item--plus"
                name="increment"
                onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    increment();
                }}
            >
                <svg
                    className="counter__counterIcon"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z"
                    />
                </svg>
            </button>
        </div>
    );
};

export default memo(Counter);