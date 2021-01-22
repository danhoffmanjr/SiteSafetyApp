import React from "react";

const ConfirmDeleteBody = () => {
  return (
    <>
      <p>Are you sure you want to delete this company?</p>
      <p>
        <strong style={{ color: "red" }}>Warning:</strong> All sites associated with this company will also be deleted.
      </p>
    </>
  );
};

export default ConfirmDeleteBody;
