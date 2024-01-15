import React, { useState } from "react";
import { Cog6ToothIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import CustomMenuPopup from "./CustomMenuPopup";
import DefaultSubplotEditor from "../DefaultSubplotEditor";
import DefaultColoraxisEditor from "../DefaultColoraxisEditor";

const renderMenuItem = (item, index) => {
  return (
    <li
      key={`${item.label}-${index}`}
      onClick={item.onClick}
      className="menu-item"
      aria-label={item.label}
      role="button"
      tabIndex={0}
    >
      <span className={`menu-icon`}>{item.icon}</span>
    </li>
  );
};

const CustomMenu = ({
  plot,
  setPlot,
  elements,
  context,
  element,
  setShowLegend,
  additionalItems = [],
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const handleShowCustomMenuOnClick = (item) => {
    console.log(`${item.label} clicked`);
    console.log("element clicked:", element, "elements", elements);
    if (showPopup) {
      setShowPopup(false);
    } else {
      console.log(`Content for ${item.label}:`, item.content);
      setShowPopup(true);
      setPopupContent(item.content);
      setPopupPosition({
        x: element.x,
        y: element.y,
        clientWidth: element.clientWidth,
        clientHeight: element.clientHeight,
      });
    }
  };

  const handleLegendOnClick = () => {
    setShowLegend((prevShowLegend) => !prevShowLegend);
  };

  const defaultMenuItems =
    element.type === "colorbar"
      ? [
          {
            icon: <Cog6ToothIcon className="w-4 h-4" />,
            onClick: () =>
              handleShowCustomMenuOnClick({
                label: element.subplotName,
                content: (
                  <DefaultColoraxisEditor
                    plot={plot}
                    setPlot={setPlot}
                    elements={elements}
                    element={element}
                  />
                ),
              }),
            label: element.colorbarName,
          },
        ]
      : [
          {
            icon: <Cog6ToothIcon className="w-4 h-4" />,
            onClick: () =>
              handleShowCustomMenuOnClick({
                label: element.subplotName,
                content: (
                  <DefaultSubplotEditor
                    plot={plot}
                    setPlot={setPlot}
                    elements={elements}
                    context={context}
                    subplotName={element.subplotName}
                  />
                ),
              }),
            label: element.subplotName,
          },
          {
            icon: <ListBulletIcon className="w-4 h-4" />,
            onClick: () => handleLegendOnClick(),
            label: "toggle legend",
          },
        ];

  const style = {
    left: `${element.x - 13}px`,
    top: `${element.y + 22}px`,
    zIndex: 10,
  };

  return (
    <ul style={style} className="absolute rounded p-1 flex flex-col gap-1">
      {defaultMenuItems
        .concat(additionalItems)
        .map((item, index) => renderMenuItem(item, index))}
      {showPopup && (
        <CustomMenuPopup
          content={popupContent}
          clickPosition={popupPosition}
          setPopupPosition={setPopupPosition}
          setShowPopup={setShowPopup}
        />
      )}
    </ul>
  );
};

export default CustomMenu;

/* 

To add menu items: 

<CustomMenu
  additionalItems={[
    { icon: 'custom-icon', label: 'Custom Item 1', onClick: () => console.log('Custom Item 1 clicked') },
    { icon: 'custom-icon', label: 'Custom Item 2', onClick: () => console.log('Custom Item 2 clicked') }
  ]}

        />
        */
