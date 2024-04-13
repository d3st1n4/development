import React from "react";

const ListItem = ({
  name,
  dateAdded,
  completeBy,
  category,
  imgUrl,
  moveToWilldo,
  moveToTodo,
  backgroundColor,
  imageBGColor,
  showMoveButton,
  showRemoveButton,
}) => {
  const itemStyle = {
    backgroundColor: backgroundColor,
  };
  const imageStyle = {
    backgroundColor: imageBGColor,
  };

  return (
    <div className="list-item">
      <div class="card">
        <div className="card-container">
          <div className="image-container" style={imageStyle}>
            <img src={imgUrl} />
          </div>
          <div class="item-details" style={itemStyle}>
            <h2>{name}</h2>
            <p>Date added: {dateAdded}</p>
            <p>Complete by: {completeBy}</p>
            <p>Category: {category}</p>
            {showMoveButton && (
              <button onClick={moveToWilldo}>Move to Will-Do</button>
            )}
            {showRemoveButton && <button onClick={moveToTodo}>Remove</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
