import "./App.css";
import React, { useState, useEffect } from "react";
import listData from "./assets/ListItem-data.json";
import ListItem from "./components/ListItem";

function App() {
  const [willdo, setWillDo] = useState([]);
  const [listItems, setListItems] = useState(listData);
  const [resetApp, setResetApp] = useState(false);
  const [selectedSortItem, setSelectedSortItem] = useState("");
  const [selectedFilterItems, setSelectedFilterItems] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [selectedColorFilter, setSelectedColorFilter] = useState("");

  const moveToWilldo = (item) => {
    if (willdo.includes(item)) {
      return;
    } else {
      setWillDo([...willdo, item]);
      setListItems(listItems.filter((listItem) => listItem !== item));
    }
  };

  const moveToTodo = (itemToRemove) => {
    const updatedWilldo = willdo.filter((item) => item !== itemToRemove);
    setListItems([...listItems, itemToRemove]);
    setWillDo(updatedWilldo);
  };

  const appReset = () => {
    setWillDo([]);
    setListItems([]);
    setResetApp(true);
  };

  useEffect(() => {
    if (resetApp) {
      setWillDo([]);
      setListItems(listData);
      setResetApp(false);
    }
  }, [resetApp]);

  const isItemSelected = (item, selectedItemList) => {
    return selectedItemList.includes(item);
  };

  const handleSortItemClick = (item) => {
    if (selectedSortItem === item) {
      // If the clicked item is already selected, deselect it
      setSelectedSortItem("");
      // Reset the listItems array to its original order
      setListItems(listData);
    } else {
      // Sort by most recent dates added
      const sortedListItems = [...listItems].sort((a, b) => {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      });
      // Remove items that are in the willdo array
      const filteredListItems = sortedListItems.filter(
        (listItem) => !willdo.includes(listItem)
      );
      setListItems(filteredListItems);
      setSelectedSortItem("Recent");
    }
  };

  const handleFilterItemClick = (item) => {
    if (selectedFilterItems.includes(item)) {
      setSelectedFilterItems(
        selectedFilterItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedFilterItems([...selectedFilterItems, item]);
    }
  };

  const handleCategoryFilterClick = (category) => {
    const isCategorySelected = selectedCategoryFilter.includes(category);

    if (isCategorySelected) {
      const updatedCategoryFilter = selectedCategoryFilter.filter(
        (selectedCategory) => selectedCategory !== category
      );
      setSelectedCategoryFilter(updatedCategoryFilter);
    } else {
      setSelectedCategoryFilter([...selectedCategoryFilter, category]);
    }
  };

  const handleColorFilterClick = (color) => {
    const isColorSelected = selectedColorFilter.includes(color);

    if (isColorSelected) {
      const updatedColorFilter = selectedColorFilter.filter(
        (selectedColor) => selectedColor !== color
      );
      setSelectedColorFilter(updatedColorFilter);
    } else {
      setSelectedColorFilter([...selectedColorFilter, color]);
    }
  };
  // Filter the listItems array based on the selected colors
  const applyFilters = () => {
    // Filter the listData based on the selected filters
    let filteredListItems = listData.filter((item) => {
      const categoryFilterMatch =
        !selectedCategoryFilter.length ||
        selectedCategoryFilter.includes(item.category);
      const colorFilterMatch =
        !selectedColorFilter.length ||
        selectedColorFilter.includes(item.backgroundColor) ||
        selectedColorFilter.includes(item.imageBackgroundColor);

      return categoryFilterMatch && colorFilterMatch;
    });

    // Update the listItems state with the filtered list
    setListItems(filteredListItems);
  };

  const filteredListData = listData.filter((item) => {
    if (
      (!selectedCategoryFilter || item.category === selectedCategoryFilter) &&
      (!selectedColorFilter || item.color === selectedColorFilter)
    ) {
      return true;
    }
    return false;
  });

  return (
    <div className="App">
      <div className="todo-container">
        <div id="todo-header">
          <h1>To-Do</h1>
          <div id="navbar">
            <div className="nav-container">
              <div class="dropdown">
                <button class="dropbtn">Sort</button>
                <div class="dropdown-content">
                  <a
                    href="#"
                    className={
                      isItemSelected("Recent", selectedSortItem)
                        ? "selected"
                        : ""
                    }
                    onClick={() => handleSortItemClick("Recent")}
                  >
                    Recent
                  </a>
                </div>
              </div>
              <div className="dropdown">
                <button className="dropbtn">Filter</button>
                <div className="dropdown-content">
                  <div className="nested-dropdown">
                    <a href="#" className="category-filter">
                      Category <span className="caret"></span>
                    </a>
                    <div className="dropdown-container">
                      <div className="dropdown-menu">
                        <a
                          href="#"
                          tabIndex="-1"
                          className={
                            isItemSelected(
                              "Assignments",
                              selectedCategoryFilter
                            )
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            handleCategoryFilterClick("Assignments")
                          }
                        >
                          Assignments
                        </a>
                        <a
                          href="#"
                          tabIndex="-1"
                          className={
                            isItemSelected("Reminders", selectedCategoryFilter)
                              ? "selected"
                              : ""
                          }
                          onClick={() => handleCategoryFilterClick("Reminders")}
                        >
                          Reminders
                        </a>
                        <a
                          href="#"
                          tabIndex="-1"
                          className={
                            isItemSelected("Events", selectedCategoryFilter)
                              ? "selected"
                              : ""
                          }
                          onClick={() => handleCategoryFilterClick("Events")}
                        >
                          Events
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-content">
                    <div className="nested-dropdown">
                      <a href="#" className="color-filter">
                        Color <span className="caret"></span>
                      </a>
                      <div className="dropdown-container">
                        <div className="dropdown-menu">
                          <a
                            className={`color-option ${
                              isItemSelected(
                                "rgba(255, 200, 200, 1)",
                                selectedColorFilter
                              )
                                ? "selected"
                                : ""
                            }`}
                            style={{
                              backgroundColor: "rgba(255, 200, 200, 1)",
                            }}
                            onClick={() =>
                              handleColorFilterClick("rgba(255, 200, 200, 1)")
                            }
                          >
                            Coral
                          </a>
                          <a
                            className={`color-option ${
                              isItemSelected(
                                "rgba(164, 236, 240, 1)",
                                selectedColorFilter
                              )
                                ? "selected"
                                : ""
                            }`}
                            style={{
                              backgroundColor: "rgba(164, 236, 240, 1)",
                            }}
                            onClick={() =>
                              handleColorFilterClick("rgba(164, 236, 240, 1)")
                            }
                          >
                            Blue
                          </a>
                          <a
                            className={`color-option ${
                              isItemSelected(
                                "rgba(239, 187, 139, 1)",
                                selectedColorFilter
                              )
                                ? "selected"
                                : ""
                            }`}
                            style={{
                              backgroundColor: "rgba(239, 187, 139, 1)",
                            }}
                            onClick={() =>
                              handleColorFilterClick("rgba(239, 187, 139, 1)")
                            }
                          >
                            Orange
                          </a>
                          <a
                            className={`color-option ${
                              isItemSelected(
                                "rgba(204, 238, 188, 1)",
                                selectedColorFilter
                              )
                                ? "selected"
                                : ""
                            }`}
                            style={{
                              backgroundColor: "rgba(204, 238, 188, 1)",
                            }}
                            onClick={() =>
                              handleColorFilterClick("rgba(204, 238, 188, 1)")
                            }
                          >
                            Green
                          </a>
                          <a
                            className={`color-option ${
                              isItemSelected(
                                "rgba(238, 188, 218, 1)",
                                selectedColorFilter
                              )
                                ? "selected"
                                : ""
                            }`}
                            style={{
                              backgroundColor: "rgba(238, 188, 218, 1)",
                            }}
                            onClick={() =>
                              handleColorFilterClick("rgba(238, 188, 218, 1)")
                            }
                          >
                            Pink
                          </a>
                          <a
                            className={`color-option ${
                              isItemSelected(
                                "rgba(255, 230, 167, 1)",
                                selectedColorFilter
                              )
                                ? "selected"
                                : ""
                            }`}
                            style={{
                              backgroundColor: "rgba(255, 230, 167, 1)",
                            }}
                            onClick={() =>
                              handleColorFilterClick("rgba(255, 230, 167, 1)")
                            }
                          >
                            Yellow
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="revert-button" onClick={appReset}>
                Revert
              </button>
            </div>
          </div>
        </div>

        <div className="flex-container">
          <div className="todo-card-container">
            {listItems.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  name={item.name}
                  dateAdded={item.dateAdded}
                  completeBy={item.completeBy}
                  category={item.category}
                  imgUrl={process.env.PUBLIC_URL + item.image}
                  backgroundColor={item.backgroundColor}
                  imageBGColor={item.imageBackgroundColor}
                  moveToWilldo={() => moveToWilldo(item)}
                  showMoveButton={true}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div id="willdo-section">
        <h1>Will-Do</h1>
        <p className="willdo-tot">Total Items: {willdo.length}</p>
        <div className="willdo-card-container">
          {willdo.map((item, index) => (
            <ListItem
              key={index}
              name={item.name}
              dateAdded={item.dateAdded}
              completeBy={item.completeBy}
              category={item.category}
              imgUrl={process.env.PUBLIC_URL + item.image}
              backgroundColor={item.backgroundColor}
              imageBGColor={item.imageBackgroundColor}
              moveToTodo={() => moveToTodo(item)}
              showRemoveButton={willdo.includes(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
