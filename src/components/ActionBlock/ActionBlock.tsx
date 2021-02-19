import React, { FC, memo } from 'react';
import Btn from '../Btn';

export type ArrayParams = {
    url: string;
    data: any;
    method: 'put' | 'post';
    headers: any;
    order: number;
};
export type ActionBlockProps = {
    arrayParams: ArrayParams[];
    isCancelButtonNeed?: boolean;
    cancelButtonText?: string;
    successButtonText?: string;
    disabled?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    onError?: (data: any) => void;
    onSuccess?: () => void;
    children?: JSX.Element | string;
    className?: string;
};
const ActionBlock: FC<ActionBlockProps> = props => {
    const voidMethod = () => {
    };
    const {
        disabled = false,
        isCancelButtonNeed = true,
        onCancel = voidMethod,
        successButtonText = 'Сохранить',
        cancelButtonText = 'Назад',
        onError = voidMethod,
        onSuccess = voidMethod,
        children,
        className = '',
    } = props;
    const save = async (): Promise<void> => {
        const resultArray: any[] = [];

        props.arrayParams.forEach(params => {
            params.order = isNaN(params.order) ? 0 : params.order;
            if (Array.isArray(resultArray[params.order]) === false) {
                resultArray[params.order] = [];
            }
            resultArray[params.order].push(params);
        });

        const fetchMethod = (params: any) => {
            if (Object.keys(params?.data || {}).length > 0 && params?.url && params?.method) {
                return fetch(params.url, {
                    method: params.method.toLowerCase() === 'put' ? 'PUT' : 'POST',
                    body: JSON.stringify(params.data),
                    headers: {
                        'content-type': 'application/json;charset=UTF-8',
                        accept: 'application/json, text/plain, */*',
                        ...params.headers,
                    },
                });
            }
        };

        for (const group of resultArray) {
            const promises: Promise<any>[] = [];
            let isError = false;

            group.forEach((params: any) => {
                // @ts-ignore
                return promises.push(fetchMethod(params));
            });

            await Promise.all(promises)
                .then(responses => {
                    responses.forEach(async res => {
                        if (res.status === 200) {
                            // @ts-ignore
                            onSuccess(await res.json());
                        } else {
                            isError = true;
                            onError(await res);
                        }
                    });
                })
                .catch(error => {
                    isError = true;
                    onError(error);
                });

            if (isError) {
                break;
            }
        }
    };

    // const { actionBlock, blockDisabled, btn, cancelButtons } = style;

    return (
        <div className={` actionBlock ${disabled ? 'actionBlock__blockDisabled' : ''} ${className}`}>
            <Btn className="actionBlock__btn" type="success" onClick={save}>
                {successButtonText}
            </Btn>

            {isCancelButtonNeed && (
                <div className="actionBlock__cancelButtons">
                    <Btn className="actionBlock__btn" type="danger" onClick={onCancel}>
                        {cancelButtonText}
                    </Btn>
                </div>
            )}

            {children}
        </div>
    );
};

export default memo(ActionBlock);
