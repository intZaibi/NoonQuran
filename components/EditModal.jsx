import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";

// Modal to choose between student or sibling edit
function EditModal({ open, onClose, onEditStudent, onEditSibling }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption === "student") {
      onEditStudent();
    } else if (selectedOption === "sibling") {
      onEditSibling();
    }
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Edit Data</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <p>Do you want to edit the student's data or sibling's data?</p>
          <div className="flex space-x-4">
            <Button
              onClick={() => handleOptionSelect("student")}
              variant={selectedOption === "student" ? "filled" : "outlined"}
              className="w-full"
            >
              Edit Student
            </Button>
            <Button
              onClick={() => handleOptionSelect("sibling")}
              variant={selectedOption === "sibling" ? "filled" : "outlined"}
              className="w-full"
            >
              Edit Sibling
            </Button>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={handleSubmit}
          color="green"
          className="w-full"
          disabled={!selectedOption}
        >
          Confirm
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default EditModal;
