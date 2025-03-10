"use client";
import StudentsTable from "@/components/StudentsTable";
import AdminSideBar from "@/components/AdminSidebar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Modal from '@/components/modal'

export default function Dashboard() {
  const router = useRouter();
  const token = Cookies.get("admin");
  
  const authenticate = async () => {
    // setLoading(true)
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
      else
        setIsAuthenticated(true);
    } catch(err) {
      console.log('error while authentication:', err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [students, setStudents] = useState([]);
  const [siblings, setSiblings] = useState([]);

  const fetchData = async () => {
    // setLoading(true);
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
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);



  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleEditButtonClick = (studentData) => {
    setCurrentStudent(studentData);
    setShowModal(true);
  };

  const handleCloseEditModal = () => {
    setShowModal(false);
  };

  const handleSubmitEditStudent = async (updatedData, DeletedId) => {
    // Logic to update student data
    try{
        if(DeletedId){
          // Update client-side state immediately
          if (updatedData.role === 'mainStudent') {
            setStudents(prevStudents => prevStudents.filter(student => student.id !== DeletedId ));
          } else if (updatedData.role === 'sibling') {
            setSiblings(prevSiblings => prevSiblings.filter(sibling => sibling.id !== DeletedId ));
          }
        }
        else{
          await fetch('http://localhost:3000/api/updateData', {
            method: "POST",
            headers: {
              'Cache-Control': 'max-age=600', // Cache response for 10 minutes
            },
            body: JSON.stringify({formData: updatedData})
          });

          // Update client-side state immediately
          if (updatedData.role === 'mainStudent') {
            setStudents(prevStudents => prevStudents.map(student => 
              student.id === updatedData.id ? { ...student, ...updatedData } : student
            ));
          } else if (updatedData.role === 'sibling') {
            setSiblings(prevSiblings => prevSiblings.map(sibling => 
              sibling.id === updatedData.id ? { ...sibling, ...updatedData } : sibling
            ));
          }
        }
      } catch(error) {
        console.log('Error updating/deleting data: ', error)
      } finally {
        setShowModal(false);
      }
  };

  const handleBarClick = () => {
    setOpenMenu(!openMenu);
  }
  return (
    <React.Fragment>
      {showModal &&
      <Modal currentStudent={currentStudent} handleCloseEditModal={handleCloseEditModal} handleSubmitEditStudent={handleSubmitEditStudent}/>
      }
      <div className=" absolute pl-5 cursor-pointer w-5 z-40" onClick={handleBarClick}>
        {!openMenu ? 
        <div className="transition-transform duration-300 transform">
          <svg id="menuIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-8 w-8 h-8 stroke-2 stroke-gray-800 transition-transform duration-300 relative top-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>:
        <div className="">
          <AdminSideBar/>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-8 w-8 h-8 stroke-2 stroke-gray-800 transition-transform duration-300 transform rotate-180 relative z-50 top-3 left-44">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div> 
        }
      </div>
    <div className="flex flex-col items-center justify-center select-none">
      <div className="text-center pt-6">
        <h1 className="text-4xl font-bold">Admin Panel Noon Quran</h1>
      </div>
      <div className="px-8 py-3 grid grid-cols-3 grid-rows-5 gap-6 h-[90vh] select-none">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center h-full">
            <div className="animate-spin h-10 w-10 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          isAuthenticated && 
          <>
            <div
              id="totalStudents"
              className="flex flex-col justify-center text-center bg-white shadow-[0_8px_20px_#080f342f] rounded-2xl min-h-4 min-w-10 col-span-1 row-span-1"
            >
              <h1 className="text-3xl font-bold">Total Main Students</h1>
              <p className="mt-3 text-lg text-gray-600">
                <span className="font-bold">{students?.length || 0}</span> | Students has made payments
              </p>

            </div>

            <div
              id="Siblings"
              className="flex flex-col justify-center text-center bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl min-h-4 min-w-10 col-span-1 row-span-1"
            >
              <h1 className="text-3xl font-bold">Total Siblings</h1>
              <p className="mt-3 text-lg text-gray-600">
                <span className="font-bold">{siblings?.length || 0}</span> | registered siblings
              </p>

            </div>

            <div
              id="Siblings"
              className="flex flex-col text-center justify-center bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl min-h-4 min-w-10 col-span-1 row-span-1"
            >
              <h1 className="text-3xl font-bold">Total Revenue</h1>
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
