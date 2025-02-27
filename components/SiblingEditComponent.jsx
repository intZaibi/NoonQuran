import React, { useState } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function SiblingEditForm({ student: sibling, handleSubmitEditStudent: onSubmit }) {
  const [formData, setFormData] = useState({
    ...sibling,
    name: sibling?.name || '',
    gender: sibling?.gender || '',
    age: sibling?.age || '',
    course: sibling?.course || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Special handling for Select, as it's not a standard input element
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-h-screen overflow-y-auto p-4">
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-5">
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        
        <FormControl fullWidth>
          <InputLabel>Age</InputLabel>
          <Select
            label="Age"
            name="age"
            value={formData.age}
            onChange={(e) => handleSelectChange("age", e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select Age</em>
            </MenuItem>
            <MenuItem value="5-10">5-10</MenuItem>
            <MenuItem value="11-15">11-15</MenuItem>
            <MenuItem value="16-20">16-20</MenuItem>
            <MenuItem value="21-25">21-25</MenuItem>
            <MenuItem value="26-30">26-30</MenuItem>
            <MenuItem value="30 Above">30 Above</MenuItem>
            <MenuItem value="40 Above">40 Above</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={(e) => handleSelectChange("gender", e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select Gender</em>
            </MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Course</InputLabel>
          <Select
            label="Course"
            name="course"
            value={formData.course}
            onChange={(e) => handleSelectChange("course", e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select Course</em>
            </MenuItem>
            <MenuItem value="Noorani Qaida">Noorani Qaida</MenuItem>
            <MenuItem value="Quran Reading">Quran Reading</MenuItem>
            <MenuItem value="Quran Memorization (Hifz)">Quran Memorization (Hifz)</MenuItem>
            <MenuItem value="Quran Translation">Quran Translation</MenuItem>
            <MenuItem value="Quran Tajweed">Quran Tajweed</MenuItem>
          </Select>
        </FormControl>

        {/* Add more fields as necessary */}
        <Button type="submit" variant="contained" color="primary" className="mt-4">
          Save Changes
        </Button>
      </form>
    </div>
  );
}

export default SiblingEditForm;
