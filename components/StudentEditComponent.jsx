import React, { useState } from "react";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

function StudentEditForm({ student, handleSubmitEditStudent: onSubmit }) {
  // console.log(student)
  // Initialize the form data with default values if student is undefined or has missing properties
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...student,
    name: student?.name || '',
    guardian_name: student?.guardian_name || '',
    email: student?.email || '',
    whatsapp_no: student?.whatsapp_no || '',
    skype_id: student?.skype_id || '',
    phone: student?.phone || '',
    gender: student?.gender || '',
    payment_status: student?.payment_status || '',
    age: student?.age || '',
    language: student?.language || '',
    class_time: student?.class_time || '',
    course: student?.course || ''
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

  return (
    <div className="max-h-screen overflow-y-auto p-4">
      <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-5">
        <TextField
          className="mb-4"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          className="mb-4"
          label="Guardian Name"
          name="guardian_name"
          value={formData.guardian_name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          className="mb-4"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          className="mb-4"
          label="Whatsapp"
          name="whatsapp_no"
          value={formData.whatsapp_no}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          className="mb-4"
          label="Skype ID"
          name="skype_id"
          value={formData.skype_id}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          className="mb-4"
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          fullWidth
        />
        <FormControl fullWidth className="mb-4">
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
        <FormControl fullWidth className="mb-4">
          <InputLabel>Payment Status</InputLabel>
          <Select
            label="Payment Status"
            name="payment_status"
            value={formData.payment_status}
            onChange={(e) => handleSelectChange("payment_status", e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select Payment Status</em>
            </MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-4">
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
        <FormControl fullWidth className="mb-4">
          <InputLabel>Language</InputLabel>
          <Select
            label="Language"
            name="language"
            value={formData.language}
            onChange={(e) => handleSelectChange("language", e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select Language</em>
            </MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Hindi/Urdu">Hindi/Urdu</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <InputLabel>Class Time</InputLabel>
          <Select
            label="Class Time"
            name="class_time"
            value={formData.class_time}
            onChange={(e) => handleSelectChange("class_time", e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select Time</em>
            </MenuItem>
            <MenuItem value="Any Time in the Morning">Any Time in the Morning</MenuItem>
            <MenuItem value="Any Time in the Evening">Any Time in the Evening</MenuItem>
            <MenuItem value="Between 08AM – 10AM">Between 08AM – 10AM</MenuItem>
            <MenuItem value="Between 10AM – 12PM">Between 10AM – 12PM</MenuItem>
            <MenuItem value="Between 12PM – 02PM">Between 12PM – 02PM</MenuItem>
            <MenuItem value="Between 02PM – 04PM">Between 02PM – 04PM</MenuItem>
            <MenuItem value="Between 04PM – 06PM">Between 04PM – 06PM</MenuItem>
            <MenuItem value="Between 06PM – 08PM">Between 06PM – 08PM</MenuItem>
            <MenuItem value="Between 08PM – 10PM">Between 08PM – 10PM</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-4">
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
            <MenuItem value="Noorani Qaida">{'Noorani Qaida'}</MenuItem>
            <MenuItem value="Quran Reading">{'Quran Reading'}</MenuItem>
            <MenuItem value="Quran Memorization (Hifz)">{'Quran Memorization (Hifz)'}</MenuItem>
            <MenuItem value="Quran Translation">{'Quran Translation'}</MenuItem>
            <MenuItem value="Quran Tajweed">{'Quran Tajweed'}</MenuItem>
          </Select>
        </FormControl>

        <div className="col-span-2 flex justify-center mt-4">
          <Button type="submit" variant="contained" color="primary" className="w-96">
            {loading ? "Save Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StudentEditForm;
