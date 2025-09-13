import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DarkThemeToggle } from "flowbite-react";

const EditTodo = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [todo, setTodo] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details
  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/auth/user-details", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUserDetails(response.data.username);
    } catch (err) {
      setError("Failed to fetch user details");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/Login");
    } else {
      getUserDetails();
    }

    if (state?.todo) {
      setTodo(state.todo);
    } else {
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:5000/api/todos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTodo(res.data.todo))
        .catch(() => setError("Failed to fetch todo"));
    }
  }, [state, id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTodo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, todo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (error) {
      setError("Failed to update task");
      console.error("Error updating todo:", error);
    }
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/auth/logout")
      .then(() => {
        localStorage.removeItem("token");
        navigate("/Login");
      })
      .catch((error) => console.error("Error logging out:", error));
  };

  return (
    <div className="overflow-x-auto">
      <main className="flex flex-col px-4 min-h-screen items-center justify-center gap-4 dark:bg-gray-800 w-screen">
        <div className="w-3/4 max-w-7xl mx-auto p-4 bg-white rounded shadow-md dark:bg-gray-900">
          <div className="flex gap-4 p-2">
            <img
              srcSet="https://heroshotphotography.com/wp-content/uploads/2023/03/male-linkedin-corporate-headshot-on-white-square-1024x1024.jpg"
              alt="profile-image"
              className="w-fit h-[50px] rounded-full"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 w-full flex items-center justify-start gap-2">
              Edit Todo
              <span className="font-thin">
                {userDetails ? `(${userDetails})` : <span className="text-red-500">{error}</span>}
              </span>
            </h1>
            <div className="flex gap-4 items-center">
              <DarkThemeToggle />
              <button
                onClick={handleLogout}
                className="bg-slate-600 dark:bg-pink-700 p-1 text-white"
              >
                Logout
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-5">
            <input
              type="text"
              name="title"
              value={todo.title}
              onChange={handleChange}
              placeholder="Task Title"
              className="w-full rounded-lg border text-black border-gray-300 px-4 py-2 focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />

            <textarea
              name="description"
              value={todo.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="w-full rounded-lg border text-black border-gray-300 px-4 py-2 focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="completed"
                checked={todo.completed}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-gray-700 dark:text-white">Completed</span>
            </label>

            <button
              type="submit"
              className="bg-blue-500 text-white text-sm font-semibold rounded-md px-4 py-3 transition duration-300 ease hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Update Task
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditTodo;
