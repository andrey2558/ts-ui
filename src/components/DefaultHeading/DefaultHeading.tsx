import React, { FC, memo } from 'react';
// import style from './DefaultHeading.scss';
//
// const { defaultHeading, headBox } = style;

export type DefaultHeadingProps = {
    title?: string;
    children?: JSX.Element | string;
    className?:string;
};
const DefaultHeading: FC<DefaultHeadingProps> = props => {
    const { children, title, className = '' } = props;

    return (
        <div className={`defaultHeading ${className}`}>
            {title && <h1 className="defaultHeading__title">{title}</h1>}

            <div className="defaultHeading__headBox">{children}</div>
        </div>
    );
};

export default memo(DefaultHeading);
