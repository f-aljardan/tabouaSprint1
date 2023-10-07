import React, { useState } from 'react';
import SummeryStaffInfo from '../viewInfo/SummeryStaffInfo';

export default function StaffForm (){
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [showSummary, setShowSummary] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input fields
    if (
      formData.firstName.trim() === '' ||
      formData.lastName.trim() === '' ||
      formData.email.trim() === '' ||
      formData.password.trim() === ''
    ) {
      alert('Please fill in all fields');
      return;
    }

    setShowSummary(true);
  };

  return (
    <>
      <button onClick={handleOpen}>Add Staff</button>
      <Dialog open={open} handleClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <br />
          <button type="submit">Add</button>
        </form>
      </Dialog>
      {showSummary && (
        <SummeryStaffInfo
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
        />
      )}
    </>
  );
};

