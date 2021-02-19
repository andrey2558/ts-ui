import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

export const useDebounce = (value: string, onChange: (string: string) => void, delay: number) => {
    const [stateValue, setValue] = useState(value);
    const delayedTextareaValue = useCallback(debounce(onChange, delay), []);
    const debounceChange = (e: string) => {
        if (stateValue !== e) {
            setValue(e);
            delayedTextareaValue(e);
        }
    };
    return { debounceChange, stringValue: stateValue };
};
