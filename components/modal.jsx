import React, { useState } from 'react'
import StudentEditForm from './StudentEditComponent';
import SiblingEditForm from './SiblingEditComponent';

export default function modal({ currentStudent, handleCloseEditModal, handleSubmitEditStudent }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className={`flex flex-col bg-white p-4 rounded-lg shadow-lg ${currentStudent.role === 'sibling' ? 'w-96' : 'w-[50%]'} max-h-[95%]`}>
            <button
              onClick={handleCloseEditModal}
              className="ml-auto mr-0 text-xl font-bold text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-2xl px-4 font-semibold mb-4">Edit Form</h2>
              
            {currentStudent.role === 'sibling' ? 
            <SiblingEditForm student={currentStudent} onSubmit={handleCloseEditModal} handleSubmitEditStudent={handleSubmitEditStudent}/>
            :
            <StudentEditForm student={currentStudent} onSubmit={handleCloseEditModal} handleSubmitEditStudent={handleSubmitEditStudent}/>
            }
          </div>
    </div>
  )
}
