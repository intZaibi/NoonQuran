"use client";
import { Card, Typography } from "@material-tailwind/react";
import StudentsTable from "@/components/StudentsTable";
import SiblingsTable from "@/components/SiblingsTable";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const token = Cookies.get("admin");
  const authenticate = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/adminLogin`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      }
    );
    if (!res.ok)
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/auth/signIn`);
  };

  useEffect(() => {
    authenticate();
  }, []);

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [siblings, setSiblings] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Main Students Data
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/totalStudents`,
        { method: "GET", cache: "no-store" }
      );
      let data = await res.json();
      setStudents(data?.students);

      //Siblings Data
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/siblings`,
        { method: "GET", cache: "no-store" }
      );
      data = await resp.json();
      setSiblings(data?.siblings);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center pt-8">
          <h1 className="text-3xl font-bold">Admin Panel Noon Quran</h1>
        </div>
      <div className="pl-8 pr-8 pt-8 pb-8 grid grid-cols-3 grid-rows-3 gap-7 h-screen">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center h-full">
            <div className="animate-spin h-10 w-10 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div
              id="totalStudents"
              className="flex flex-col bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl min-h-10 min-w-10 col-span-1 row-span-1"
            >
              <h1 className="text-xl font-bold">Total Main Students</h1>
              <p className="mt-3 text-gray-600">
                {students?.length || 0} | Students has made payments
              </p>

              <Link
                href="#"
                className="py-2 px-4 self-start mt-4 bg-blue-300 shadow-[0_8px_20px_#080f342a] hover:bg-blue-400 duration-200 rounded-xl text-white"
              >
                view detail
              </Link>
            </div>

            <div
              id="Siblings"
              className="flex flex-col bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl min-h-10 min-w-10 col-span-1 row-span-1"
            >
              <h1 className="text-xl font-bold">Total Siblings</h1>
              <p className="mt-3 text-gray-600">
                {siblings?.length || 0} | registered siblings
              </p>

              <Link
                href="#"
                className="py-2 px-4 self-start mt-4 bg-blue-300 shadow-[0_8px_20px_#080f342a] hover:bg-blue-400 duration-200 rounded-xl text-white"
              >
                view detail
              </Link>
            </div>

            <div
              id="Siblings"
              className="flex flex-col bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl min-h-10 min-w-10 col-span-1 row-span-1"
            >
              <h1 className="text-xl font-bold">Total Sales</h1>
              <p className="mt-3 text-gray-600">
                AED {((students?.reduce((acc, order) => acc + parseFloat(order?.total_price), 0)))?.toFixed(2)} | total revenue
              </p>
            </div>


            {/* Main Student Table */}
            <div
              id="Sales"
              className="flex flex-col bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl min-h-10 min-w-10 col-span-3 row-span-2"
              style={{scrollbarWidth: 'thin',
                scrollbarColor: 'transparent transparent'}}
            >
              <h1 className="text-xl font-bold">Main Student Table</h1>
              {/* <Card className="w-full h-full overflow-x-auto overflow-y-scroll scrollbar">
              <table className="w-full min-w-max table-auto text-left">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 px-4 py-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-center leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 px-4 py-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal text-center leading-none opacity-70"
                      >
                        Actions
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map(
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
                      const isLast = index === students?.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

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
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {id}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {name}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {email}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {whatsapp_no}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {phone}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {skype_id}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {guardian_name}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {gender}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {age}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {language}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {class_time}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {course}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {class_days}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {no_of_siblings}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {country}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {total_price}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {idempotencyKey}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {payment_status}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {dateTime}
                            </Typography>
                          </td>

                          <td className={`p-4 fixed right-0 bg-white`}>
                            <div className="flex justify-center space-x-2">
                              <button
                                className="text-blue-600"
                                onClick={() => window.location.href = `mailto:${email}`}
                              >
                                Mail
                              </button>
                              <button
                                className="text-green-600"
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
              </Card> */}
              <StudentsTable orders={students}/>
            </div>

          </>
        )}
      </div>
            {/* Siblings Table */}
            <div
              id="Sales"
              className="flex flex-col mb-5 bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl h-96 w-[95%] col-span-3 row-span-3"
              style={{scrollbarWidth: 'thin',
                scrollbarColor: 'transparent transparent'}}
            >
              <h1 className="text-xl font-bold">Siblings</h1>
              <SiblingsTable orders={ siblings }/>
            </div>
    </div>
  );
}
