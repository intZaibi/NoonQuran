import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react"; 

const TABLE_HEAD = [
  "id",
  "name",
  "gender",
  "age",
  "course",
  "reference_name",
  "idempotencyKey",
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
            </tr>
          </thead>
          <tbody>
            {currentData.map(
              (
                {
                  id,
                  name,
                  gender,
                  age,
                  course,
                  reference_name,
                  idempotencyKey,
                },
                index
              ) => {
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
                        {course}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {reference_name}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {idempotencyKey}
                      </Typography>
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
