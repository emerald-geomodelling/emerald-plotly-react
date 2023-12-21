import React, { useState } from "react";
import { Cog6ToothIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import CustomMenuPopup from "./CustomMenuPopup";

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

const CustomMenu = ({ element, toggleLegend, additionalItems = [] }) => {
  // MAYBE MOBE ALL OF THIS TO A HOOK

  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const handleItemClick = (item) => {
    console.log(`${item.label} clicked`);
    if (showPopup) {
      setShowPopup(false);
    } else {
      console.log(`Content for ${item.label}:`, item.content);
      setShowPopup(true);
      setPopupContent(item.content);
      setPopupPosition({ x: element.x, y: element.y });
    }
  };
  //////////////////

  const defaultMenuItems =
    element.type === "colorbar"
      ? [
          {
            icon: <Cog6ToothIcon className="w-4 h-4" />,
            onClick: () => console.log("Default Item 1 clicked"),
            label: element.colorbarName,
          },
        ]
      : [
          {
            icon: <Cog6ToothIcon className="w-4 h-4" />,
            onClick: () =>
              handleItemClick({
                label: element.subplotName,
                content: element.subplotName,
              }),
            label: element.subplotName,
          },
          {
            icon: <ListBulletIcon className="w-4 h-4" />,
            onClick: toggleLegend,
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
          position={popupPosition}
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
position={position}
additionalItems={[
            { icon: 'custom-icon', label: 'Custom Item 1', onClick: () => console.log('Custom Item 1 clicked') },
            { icon: 'custom-icon', label: 'Custom Item 2', onClick: () => console.log('Custom Item 2 clicked') }
        ]}
        />
        */
