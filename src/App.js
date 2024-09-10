import "./App.css";
import React, { useState, useEffect } from "react";
import listData from "./assets/ListItem-data.json";
import ListItem from "./components/ListItem";
import $ from "jquery";

function App() {
  const [willdo, setWillDo] = useState([]);
  const [todo, setToDo] = useState([]);
  const [listItems, setListItems] = useState(listData);
  const [resetApp, setResetApp] = useState(false);
  const [selectedSortItem, setSelectedSortItem] = useState("");
  const [selectedFilterItems, setSelectedFilterItems] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState([]);
  const [filteredItems, setFilteredItems] = useState(listItems);
  const [selectedColorFilter, setSelectedColorFilter] = useState("");

  useEffect(() => {
    (function ($) {
      var CheckboxDropdown = function (el) {
        var _this = this;
        this.isOpen = false;
        this.areAllChecked = false;
        this.$el = $(el);
        this.$label = this.$el.find(".dropdown-label");
        this.$checkAll = this.$el.find('[data-toggle="check-all"]').first();
        this.$inputs = this.$el.find('[type="checkbox"]');

        this.onCheckBox();

        this.$label.on("click", function (e) {
          e.preventDefault();
          _this.toggleOpen();
        });

        this.$checkAll.on("click", function (e) {
          e.preventDefault();
          _this.onCheckAll();
        });

        this.$inputs.on("change", function (e) {
          _this.onCheckBox();
        });
      };

      CheckboxDropdown.prototype.onCheckBox = function () {
        this.updateStatus();
      };

      CheckboxDropdown.prototype.updateStatus = function () {
        var checked = this.$el.find(":checked");

        this.areAllChecked = false;
        this.$checkAll.html("Check All");

        if (checked.length <= 0) {
          // this.$label.html("Sort");
        } else if (checked.length === 1) {
          // this.$label.html(checked.parent("label").text());
        } else if (checked.length === this.$inputs.length) {
          // this.$label.html("All Selected");
          this.areAllChecked = true;
          this.$checkAll.html("Uncheck All");
        } else {
          // this.$label.html(checked.length + " Selected");
        }
      };

      CheckboxDropdown.prototype.onCheckAll = function (checkAll) {
        if (!this.areAllChecked || checkAll) {
          this.areAllChecked = true;
          this.$checkAll.html("Uncheck All");
          this.$inputs.prop("checked", true);
        } else {
          this.areAllChecked = false;
          this.$checkAll.html("Check All");
          this.$inputs.prop("checked", false);
        }

        this.updateStatus();
      };

      CheckboxDropdown.prototype.toggleOpen = function (forceOpen) {
        var _this = this;

        if (!this.isOpen || forceOpen) {
          this.isOpen = true;
          this.$el.addClass("on");
          $(document).on("click", function (e) {
            if (!$(e.target).closest("[data-control]").length) {
              _this.toggleOpen();
            }
          });
        } else {
          this.isOpen = false;
          this.$el.removeClass("on");
          $(document).off("click");
        }
      };

      var checkboxesDropdowns = document.querySelectorAll(
        '[data-control="checkbox-dropdown"]'
      );
      for (var i = 0, length = checkboxesDropdowns.length; i < length; i++) {
        new CheckboxDropdown(checkboxesDropdowns[i]);
      }
    })($);
  }, []);

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
    const updatedTodo = todo.filter((item) => item == itemToRemove);
    setListItems([...listItems, itemToRemove]);
    setWillDo(updatedWilldo);
    setToDo(updatedTodo);
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

  const handleSortDateClick = (event) => {
    const item = event.target.value;
    if (selectedSortItem === item) {
      setSelectedSortItem("");
      setListItems(listData);
    } else {
      const sortedListItems = [...listItems].sort((a, b) => {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      });
      const sortedItems = sortedListItems.filter(
        (listItem) => !willdo.includes(listItem)
      );
      setListItems(sortedItems);
      setSelectedSortItem(item);
    }
  };

  const handleSortCompleteClick = (event) => {
    const item = event.target.value;
    if (selectedSortItem === item) {
      setSelectedSortItem("");
      setListItems(listData);
    } else {
      const sortedListItems = [...listItems].sort((a, b) => {
        return new Date(b.completeBy) - new Date(a.completeBy);
      });
      const sortedItems = sortedListItems.filter(
        (listItem) => !willdo.includes(listItem)
      );
      setListItems(sortedItems);
      setSelectedSortItem(item);
    }
  };

  const handleFilterClick = (event) => {
    const category = event.target.value;
    const isCategorySelected = selectedCategoryFilter.includes(category);

    let updatedCategoryFilter;

    if (isCategorySelected) {
      // Remove category from filter
      updatedCategoryFilter = selectedCategoryFilter.filter(
        (selectedCategory) => selectedCategory !== category
      );
    } else {
      updatedCategoryFilter = [...selectedCategoryFilter, category];
    }
    setSelectedCategoryFilter(updatedCategoryFilter);

    // Filter items based on updated category filter
    const filteredItems = listData.filter(
      (item) =>
        updatedCategoryFilter.length === 0 ||
        updatedCategoryFilter.includes(item.category)
    );

    // Update filtered listItems state
    setListItems(filteredItems);
  };

  const handleColorFilterClick = (event) => {
    const color = event.target.value;
    const isColorSelected = selectedColorFilter.includes(color);

    let updatedColorFilter;

    if (isColorSelected) {
      updatedColorFilter = selectedColorFilter.filter(
        (selectedColor) => selectedColor !== color
      );
    } else {
      updatedColorFilter = [...selectedColorFilter, color];
    }
    setSelectedColorFilter(updatedColorFilter);

    // Filter items based on updated color filter
    const filteredItems = listData.filter(
      (item) =>
        updatedColorFilter.length === 0 ||
        updatedColorFilter.includes(item.backgroundColor)
    );

    // Update filtered listItems state
    setListItems(filteredItems);
  };

  // const applyFilters = () => {
  //   let filteredListItems = listData.filter((item) => {
  //     const categoryFilterMatch =
  //       !selectedCategoryFilter.length ||
  //       selectedCategoryFilter.includes(item.category);
  //     const colorFilterMatch =
  //       !selectedColorFilter.length ||
  //       selectedColorFilter.includes(item.backgroundColor) ||
  //       selectedColorFilter.includes(item.imageBackgroundColor);

  //     return categoryFilterMatch && colorFilterMatch;
  //   });

  //   setListItems(filteredListItems);
  // };

  // const filteredListData = listData.filter((item) => {
  //   if (
  //     (!selectedCategoryFilter || item.category === selectedCategoryFilter) &&
  //     (!selectedColorFilter || item.color === selectedColorFilter)
  //   ) {
  //     return true;
  //   }
  //   return false;
  // });

  return (
    <div className="App">
      <div className="pg-top">
        <div className="header">
          <h1>AgenDo</h1>
        </div>
        <div className="control-cont">
          <div className="control-ctr">
            <div className="dropdown" data-control="checkbox-dropdown">
              <label className="dropdown-label">Sort</label>
              <div className="dropdown-list">
                <a href="#" data-toggle="check-all" className="dropdown-option">
                  Check All
                </a>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="Selection 1"
                    onChange={handleSortDateClick}
                  />
                  Date Added
                </label>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="Selection 2"
                    onChange={handleSortCompleteClick}
                  />
                  Complete By
                </label>
              </div>
            </div>
            <div className="dropdown" data-control="checkbox-dropdown">
              <label className="dropdown-label">Filter</label>
              <div className="dropdown-list">
                <a href="#" data-toggle="check-all" className="dropdown-option">
                  Check All
                </a>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="Reminders"
                    onChange={handleFilterClick}
                  />
                  Reminders
                </label>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="Assignments"
                    onChange={handleFilterClick}
                  />
                  Assignments
                </label>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="Events"
                    onChange={handleFilterClick}
                  />
                  Events
                </label>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="rgba(255, 200, 200, 1)"
                    onChange={handleColorFilterClick}
                  />
                  <span id="coral" class="dot"></span> Coral
                </label>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="rgba(238, 188, 218, 1)"
                    onChange={handleColorFilterClick}
                  />
                  <span id="pink" class="dot"></span> Pink
                </label>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="rgba(164, 236, 240, 1)"
                    onChange={handleColorFilterClick}
                  />
                  <span id="blue" class="dot"></span> Blue
                </label>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="rgba(239, 187, 139, 1)"
                    onChange={handleColorFilterClick}
                  />
                  <span id="orange" class="dot"></span> Orange
                </label>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="rgba(255, 230, 167, 1)"
                    onChange={handleColorFilterClick}
                  />
                  <span id="yellow" class="dot"></span> Yellow
                </label>
                <label className="dropdown-option">
                  <input
                    type="checkbox"
                    name="dropdown-group"
                    value="rgba(204, 238, 188, 1)"
                    onChange={handleColorFilterClick}
                  />
                  <span id="green" class="dot"></span> Green
                </label>
              </div>
            </div>
            <div>
              <button className="revert-button" onClick={appReset}>
                Revert
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="main-div">
        <div className="todo-container">
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
        <div className="willdo-section">
          <div className="willdo-header">
            <h1>Will-Do</h1>
            <p className="willdo-tot">Total Items: {willdo.length}</p>
          </div>
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
      {/* <div className="todo-container">
        <div id="todo-header">
          <h1>To-Do</h1>
          
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
      </div> */}
    </div>
  );
}

export default App;
