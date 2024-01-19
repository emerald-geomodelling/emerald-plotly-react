import React, { useState } from "react";
import { Cog6ToothIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import CustomMenuPopup from "./CustomMenuPopup";
import DefaultSubplotEditor from "../DefaultSubplotEditor";
import DefaultColoraxisEditor from "../DefaultColoraxisEditor";
import { defaultSchema, fullPlotlyColorAxisSchema } from "../../utils";

const renderMenuItem = ({
  item,
  index,
  plot,
  setPlot,
  elements,
  element,
  context,
}) => {
  return (
    <li
      key={`${item.label}-${index}`}
      onClick={() =>
        item.onClick({ plot, setPlot, elements, element, context })
      }
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
  element,
  context,
  setShowLegend,
  setSelectedElement,
  additionalMenuItems,
  customSubplotEditor,
  customColoraxisEditor,
  useDefaultSchema,
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

  const handleLegendOnClick = (element) => {
    setShowLegend((prevShowLegend) => {
      setSelectedElement(element.subplotName);
      return !prevShowLegend;
    });
  };

  // Use custom editors if provided, otherwise use default
  const SubplotEditor = customSubplotEditor || DefaultSubplotEditor;
  const ColoraxisEditor = customColoraxisEditor || DefaultColoraxisEditor;
  const colorAxisSchema = useDefaultSchema
    ? defaultSchema
    : fullPlotlyColorAxisSchema;

  const defaultMenuItems =
    element.type === "colorbar"
      ? [
          {
            icon: <Cog6ToothIcon className="w-4 h-4" />,
            onClick: () =>
              handleShowCustomMenuOnClick({
                label: element.subplotName,
                content: (
                  <ColoraxisEditor
                    plot={plot}
                    setPlot={setPlot}
                    elements={elements}
                    element={element}
                    schema={colorAxisSchema}
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
                  <SubplotEditor
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
            onClick: () => handleLegendOnClick(element),
            label: "toggle legend",
          },
        ];

  const style = {
    left: `${element.x - 13}px`,
    top: `${element.y + 22}px`,
    zIndex: 10,
  };

  return (
    <div style={style} className="absolute">
      <div className="relative">
        <ul className="rounded p-1 flex flex-col gap-1">
          {(additionalMenuItems
            ? defaultMenuItems.concat(additionalMenuItems)
            : defaultMenuItems
          ).map((item, index) =>
            renderMenuItem({
              item,
              index,
              plot,
              setPlot,
              elements,
              element,
              context,
            })
          )}
        </ul>
        {showPopup && (
          <CustomMenuPopup
            content={popupContent}
            clickPosition={popupPosition}
            setPopupPosition={setPopupPosition}
            setShowPopup={setShowPopup}
          />
        )}
      </div>
    </div>
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
