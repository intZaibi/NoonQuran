"use client";
import StudentsTable from "@/components/StudentsTable";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Modal from '@/components/modal'

export default function Dashboard() {
  const router = useRouter();
  const token = Cookies.get("admin");
  
  const authenticate = async () => {
    setLoading(true)
    try{
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
        setIsAuthenticated(true)
    } catch(err) {
      console.log('error while authentication:', err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      console.log("error while fetching Data: ",error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);



  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  const handleEditButtonClick = (studentData) => {
    setCurrentStudent(studentData);
    setShowModal(true);
  };

  const handleCloseEditModal = () => {
    setShowModal(false);
  };

  const handleSubmitEditStudent = async (updatedData) => {
    // Logic to update student data
    console.log("Student Data:", students);
    try{
      setCurrentStudent(updatedData);
      console.log('object')
      await fetch('http://localhost:3000/api/updateData', {
        method: "POST",
        body: JSON.stringify({formData: updatedData})
      });

    } catch(error) {
      console.log('Error updating data: ', error)
    } finally {
      setShowModal(false);
    }
    
  };

  // const handleEditSibling = (updatedData) => {
  //   // Logic to update sibling data
  //   console.log("Updated Sibling Data:", updatedData);
  //   setShowModal(false);
  // };

  return (
    <React.Fragment>
      {showModal &&
      <Modal currentStudent={currentStudent} handleCloseEditModal={handleCloseEditModal} handleSubmitEditStudent={handleSubmitEditStudent}/>
      }
    <div className="flex flex-col items-center justify-center bg-[antiquewhite]">
      <div className="text-center pt-8">
          <h1 className="text-4xl font-bold">Admin Panel Noon Quran</h1>
        </div>
      <div className="pl-8 pr-8 pt-8 pb-8 grid grid-cols-3 grid-rows-3 gap-7 h-[120vh]">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center h-full">
            <div className="animate-spin h-10 w-10 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div
              id="totalStudents"
              className="flex flex-col justify-center text-center bg-white shadow-[0_8px_20px_#080f342f] rounded-2xl min-h-10 min-w-10 col-span-1 row-span-1"
            >
              <h1 className="text-3xl font-bold">Total Main Students</h1>
              <p className="mt-3 text-lg text-gray-600">
                <span className="font-bold">{students?.length || 0}</span> | Students has made payments
              </p>

            </div>

            <div
              id="Siblings"
              className="flex flex-col justify-center text-center bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl min-h-10 min-w-10 col-span-1 row-span-1"
            >
              <h1 className="text-3xl font-bold">Total Siblings</h1>
              <p className="mt-3 text-lg text-gray-600">
                <span className="font-bold">{siblings?.length || 0}</span> | registered siblings
              </p>

            </div>

            <div
              id="Siblings"
              className="flex flex-col text-center justify-center bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl min-h-10 min-w-10 col-span-1 row-span-1"
            >
              <h1 className="text-3xl font-bold">Total Sales</h1>
              <p className="mt-3 text-lg text-gray-600">
                <span className="font-bold">AED {((students?.reduce((acc, order) => acc + parseFloat(order?.total_price), 0)))?.toFixed(2)}</span> | total revenue
              </p>
            </div>

            {/* Table */}
            <div
              id="Sales"
              className="flex flex-col bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl min-h-10 min-w-10 col-span-3 row-span-4"
              style={{scrollbarWidth: 'thin',
                scrollbarColor: 'transparent transparent'}}
            >
              <h1 className="text-xl font-bold">Main Student Table</h1>
              <StudentsTable students={students} siblings={siblings} handleEditButtonClick={handleEditButtonClick} />
            </div>

          </>
        )}
      </div>
    </div>
    </React.Fragment>
  );
}
