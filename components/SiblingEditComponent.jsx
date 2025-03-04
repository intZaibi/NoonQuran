import React, { useState } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function SiblingEditForm({ student: sibling, handleSubmitEditStudent: onSubmit }) {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    onSubmit(formData);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/siblings`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id})
      });
      
      const result = await res.json();
      console.log(result);

      if (res.ok) {
        onSubmit(formData, formData.id);
      }else throw new Error(result.Error)
    } catch (error) {
      console.log(error)
    }finally {
      setLoading(false)
    }
  }

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
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
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
            <MenuItem value="noorani-qaida">Noorani Qaida</MenuItem>
            <MenuItem value="quran-reading">Quran Reading</MenuItem>
            <MenuItem value="quran-memorization">Quran Memorization (Hifz)</MenuItem>
            <MenuItem value="quran-translation">Quran Translation</MenuItem>
            <MenuItem value="quran-tajweed">Quran Tajweed</MenuItem>
          </Select>
        </FormControl>

        {/* Add more fields as necessary */}
        <Button type="submit" variant="contained" color="primary" className="mt-4">
        {loading ? "Save Changes..." : "Save Changes"}
        </Button>
        <Button type="button" onClick={()=>handleDelete(formData.id)} variant="outlined" color="error" className="mt-4">
          {loading ? "Deleting..." : "Delete"} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mb-1 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </Button>
      </form>
    </div>
  );
}

export default SiblingEditForm;
