"use client";
import React, { useState, useEffect } from "react";
import AdminSideBar from '@/components/AdminSidebar';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Messages() {

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

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch messages data
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages`, {
        method: "GET",
        headers: {
          'Cache-Control': 'max-age=600', // Cache response for 10 minutes
        },
      });
      let data = await res.json();
      setMessages(data?.messages || []);
    } catch (error) {
      console.log("Error fetching messages: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [isAuthenticated]);

  const handleBarClick = () => {
    setOpenMenu(!openMenu);
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/messages`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id})
      });
      
      const result = await res.json();
      console.log(result);

      if (res.ok) {
        setMessages(messages.filter((message)=>message.id!==id));
      }else throw new Error(result.Error)
    } catch (error) {
      console.log(error)
    }finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
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
          <h1 className="text-4xl font-bold">Messages</h1>
        </div>
        <div className="px-8 py-3 grid grid-cols-1 gap-6 w-full select-none">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin h-10 w-10 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-[0_8px_20px_#080f342f] p-4 rounded-2xl">
              <h1 className="text-xl font-bold mb-4">Messages Table</h1>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Id</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">WhatsApp</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length > 0 ? (
                    messages.map(({id, name, email, whatsapp, created_at}) => (
                      <tr key={id} className="border-b">
                        <td className="px-4 py-2  text-sm">{id}</td>
                        <td className="px-4 py-2  text-sm">{name}</td>
                        <td className="px-4 py-2  text-sm">{email}</td>
                        <td className="px-4 py-2  text-sm">{whatsapp}</td>
                        <td className="px-4 py-2  text-sm">{new Date(created_at).toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-4">
                            <button
                              className="px-2 py-1 bg-blue-500 text-white rounded-md"
                              onClick={() => window.location.href = `mailto:${email}`}
                            >
                              Mail
                            </button>
                            <button
                              className="px-2 py-1 bg-green-600 text-white rounded-md"
                              onClick={() => window.location.href = `https://wa.me/${whatsapp}`}
                            >
                              WhatsApp
                            </button>
                            <button
                              className="px-2 py-1 bg-red-600 text-white rounded-md"
                              onClick={()=>handleDelete(id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-2 text-center">No messages found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
