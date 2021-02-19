import React, { FC, memo, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export type TabItemProp = {
  name: string;
  id: number | string;
  children: JSX.Element | string;
};
export type TabComponentProps = {
  activeIndex?: number;
  items: TabItemProp[];
  forceRender?: boolean;
  className?: string;
};
const TabComponent: FC<TabComponentProps> = props => {
  const { items, activeIndex = 0, forceRender = true, className = '' } = props;
  const [tabIndex, setTabIndex] = useState<number>(activeIndex);

  return (
    <Tabs
      className={`tabs ${className}`}
      selectedIndex={tabIndex}
      onSelect={index => setTabIndex(index)}
    >
      <TabList className="tabs__list">
        {items.map(item => (
          <Tab
            className="tabs__tab"
            selectedClassName="isActive"
            key={item.id}
          >
            {item.name}
          </Tab>
        ))}
      </TabList>

      {items.map(item => (
        <TabPanel
          className="tabs__panels"
          selectedClassName="isSelect"
          key={item.id}
          forceRender={forceRender}
        >
          {item.children}
        </TabPanel>
      ))}
    </Tabs>
  );
};
export default memo(TabComponent);
