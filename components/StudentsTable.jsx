import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react"; 

const TABLE_HEAD = [
  "id",
  "name",
  "email",
  "whatsapp_no",
  "phone",
  "skype_id",
  "guardian_name",
  "gender",
  "age",
  "language",
  "class_time",
  "course",
  "class_days",
  "no_of_siblings",
  "country",
  "total_price",
  "idempotencyKey",
  "payment_status",
  "created_at",
];

const PAGE_SIZE = 20;

function TableComponent({ orders }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const currentData = orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  return (
    <Card className="w-full h-full overflow-x-auto overflow-y-scroll scrollbar-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead className="sticky top-0 bg-white z-30">
          <tr>
              {TABLE_HEAD.map((head, idx) => {
                return (
                  <th
                    key={head}
                    className={`border-b border-blue-gray-100 bg-blue-gray-50 px-4 py-4 ${
                      idx === 0 || idx === TABLE_HEAD.length - 1
                        ? "sticky left-0 z-30  bg-white"
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
                );
              })}
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 px-4 py-4 sticky right-0 z-30  bg-white">
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
                index
              ) => {
                const dateTime =
                  created_at
                    ?.toString()
                    ?.split("T")[1]
                    ?.split(".")[0]
                    ?.substr(0, created_at?.toString()?.split("T")[1]?.split(".")[0]?.length - 3) +
                  ", " +
                  created_at?.toString()?.split("T")[0];

                return (
                  <tr key={id}>
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
                        {guardian_name}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {gender}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {age}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {language}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {class_time}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {course}
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
                        {total_price}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {idempotencyKey}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {payment_status}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {dateTime}
                      </Typography>
                    </td>
                    {/* Actions Column */}
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
                      </div>
                    </td>
                  </tr>
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
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePagination(currentPage + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </Card>
  );
}

export default TableComponent;
