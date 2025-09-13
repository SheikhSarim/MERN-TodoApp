import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DarkThemeToggle,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadContext,
  TableRow,
  Table,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

const TodoList = ({ user }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/auth/logout")
      .then((response) => {
        console.log(response.data.message);
        localStorage.removeItem("token");
        navigate("/Login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found. Please log in.");
          navigate("/Login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setData(response.data.todos || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);
  
  useEffect(() => {
    const theme = localStorage.getItem("flowbite-theme-mode");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      // Default to light if not set
      document.documentElement.classList.remove("dark");
      localStorage.setItem("flowbite-theme-mode", "light");
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <main className="flex flex-col px-4 min-h-screen items-center justify-center gap-4 dark:bg-gray-800 w-screen">
        <div className="w-3/4 max-w-7xl mx-auto p-4 bg-white rounded shadow-md dark:bg-gray-900">
          {/* Header */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex gap-4 items-center">
              <img
                src="https://heroshotphotography.com/wp-content/uploads/2023/03/male-linkedin-corporate-headshot-on-white-square-1024x1024.jpg"
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Todo App <span className="font-light">({user})</span>
              </h1>
            </div>
            <div className="flex gap-4 items-center">
              <DarkThemeToggle />
              <button
                onClick={handleLogout}
                className="bg-slate-600 dark:bg-pink-700 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate("/todoform")}
              className="bg-teal-700 dark:bg-teal-300 text-white dark:text-black px-4 py-1 rounded"
            >
              Add Task
            </button>
          </div>

          <Table hoverable striped>
            <TableHead>
              <TableHeadCell className="text-center">Title</TableHeadCell>
              <TableHeadCell className="text-center">Description</TableHeadCell>
              <TableHeadCell className="text-center">Completed</TableHeadCell>
              <TableHeadCell className="text-center">Actions</TableHeadCell>
            </TableHead>

            <TableBody className="border-t border-gray-200 dark:border-gray-700">
              {data.map((item) => (
                <TableRow
                  key={item._id}
                  className="text-center transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <TableCell className="text-gray-900 dark:text-white">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {item.description}
                  </TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="cursor-default accent-teal-600 dark:accent-teal-400"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-4">
                      <Link
                        to={`/edit/${item._id}`}
                        state={{ todo: item }}
                        className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-sm font-medium text-red-600 hover:underline dark:text-red-400 focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default TodoList;
