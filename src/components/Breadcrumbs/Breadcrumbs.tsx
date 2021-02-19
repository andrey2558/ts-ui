import React, { FC, memo } from 'react';

export type BreadcrumbsItem = {
  name: string;
  goTo: () => void;
};
export type BreadcrumbsProps = {
  items: BreadcrumbsItem[];
  className?: string;
  svg?: JSX.Element;
};
const Breadcrumbs: FC<BreadcrumbsProps> = props => {
  const { items, className = '', svg = '' } = props;

  return (
    <div className={`breadcrumbs ${className}`}>
      <div className="breadcrumbs__container">
        <ul className="breadcrumbs__nav">
          {items.map((item, index) => (
            <li className="breadcrumbs__navItem" key={index}>
              <button className="breadcrumbs__link" onClick={item.goTo}>
                <span>{item.name}</span>
              </button>
              {svg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(Breadcrumbs);
