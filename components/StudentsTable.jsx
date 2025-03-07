import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = [
  "id",
  "name",
  "age",
  "gender",
  "course",
  "email",
  "whatsapp_no",
  "phone",
  "skype_id",
  "total_price",
  "payment_status",
  "class_time",
  "class_days",
  "no_of_siblings",
  "country",
  "language",
  "guardian_name",
  "created_at",
];

const PAGE_SIZE = 20;

function TableComponent({ students, siblings, handleEditButtonClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  const totalPages = Math.ceil(students.length / PAGE_SIZE);
  const currentData = students.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function convertToRoman(num) {
  const romanNumerals = [
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["ix", 9],
    ["v", 5],
    ["iv", 4],
    ["i", 1]
  ];

  let result = '';
  for (let [symbol, value] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (idempotencyKey) => {
    setExpandedStudentId((prev) => (prev === idempotencyKey ? null : idempotencyKey));
  };

  return (
    <Card className="w-full h-full overflow-x-auto overflow-y-scroll scrollbar-hidden select-text">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead className="sticky top-0 bg-white z-30">
            <tr>
              {TABLE_HEAD.map((head, idx) => (
                <th
                  key={head}
                  className={`border-b border-blue-gray-100 bg-blue-gray-50 px-4 py-4 ${
                    idx === 0 || idx === TABLE_HEAD.length - 1
                      ? "sticky left-0 z-30 bg-white"
                      : ""
                  }`}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-extrabold text-center leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 px-4 py-4 sticky right-0 z-30 bg-white">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-extrabold text-center leading-none opacity-70"
                >
                  Actions
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(
              (
                {
                  id,
                  name,
                  email,
                  whatsapp_no,
                  phone,
                  skype_id,
                  guardian_name,
                  gender,
                  age,
                  language,
                  class_time,
                  course,
                  class_days,
                  no_of_siblings,
                  country,
                  total_price,
                  idempotencyKey,
                  payment_status,
                  created_at,
                },
              ) => {
                const dateTime =
                  created_at
                    ?.toString()
                    ?.split("T")[1]
                    ?.split(".")[0]
                    ?.substr(0, created_at?.toString()?.split("T")[1]?.split(".")[0]?.length - 3) +
                  ", " +
                  created_at?.toString()?.split("T")[0];

                const filteredSiblings = siblings.filter((sibling) => sibling.idempotencyKey === idempotencyKey);

                return (
                  <React.Fragment key={id}>
                    <tr onClick={() => handleRowClick(idempotencyKey)}>
                      <td className="p-4 sticky left-0 bg-white z-20">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {id}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {name}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {age}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {gender}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {course}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {email}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {whatsapp_no}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {phone}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {skype_id}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          AED {total_price}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {payment_status}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {class_time}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {class_days}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {no_of_siblings}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {country}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {language}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {guardian_name}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal text-center">
                          {dateTime}
                        </Typography>
                      </td>
                      <td className="p-4 sticky right-0 bg-white z-20">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="px-2 py-1 bg-blue-500 text-white rounded-md"
                            onClick={() => window.location.href = `mailto:${email}`}
                          >
                            Mail
                          </button>
                          <button
                            className="px-2 py-1 bg-green-600 text-white rounded-md"
                            onClick={() => window.location.href = `https://wa.me/${whatsapp_no}`}
                          >
                            WhatsApp
                          </button>
                          <button
                            className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                            onClick={() => handleEditButtonClick({role: 'mainStudent', id, idempotencyKey, name, email, whatsapp_no, phone, skype_id, guardian_name, gender, age, language, class_time, course, payment_status })}
                          >
                            Edit Student
                          </button>
                        </div>
                      </td>
                    </tr>

                    {
                      filteredSiblings.length > 0 ? (
                        filteredSiblings.map(({ id, name, age, gender, course }, i) => (
                          <tr key={i} className="bg-gray-100">
                            <td className="p-4 sticky left-0 z-20">
                              <Typography variant="small" color="blue-gray" className="font-normal text-center">
                                {convertToRoman(i + 1)}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray" className="font-normal text-center">
                                {name}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray" className="font-normal text-center">
                                {age}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray" className="font-normal text-center">
                                {gender}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray" className="font-normal text-center">
                                {course}
                              </Typography>
                            </td>
                            <td colSpan={15}>
                              <button
                                className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                                onClick={() => handleEditButtonClick({role: 'sibling', id, name, age, gender, course, idempotencyKey })}
                              >
                                Edit Sibling
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-gray-100">
                          <td colSpan={12} className="text-center">No Sibling</td>
                        </tr>
                      )
                    }
                    <tr>
                      <td colSpan={TABLE_HEAD.length + 1} className="border-t-2 border-blue-700">
                        {/* This is the divider */}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePagination(currentPage - 1)}
          className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePagination(currentPage + 1)}
          className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
    </Card>
  );
}

export default TableComponent;
