import { useEffect, useState } from "react";
import axios from "axios";
import { DarkThemeToggle } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const TodoForm = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [taskTitle, setTaskTitle] = useState(""); // State for task title
  const [taskDescription, setTaskDescription] = useState(""); // State for task description
  const [taskCompleted, setTaskCompleted] = useState(false); // State for task completion status

  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        return;
      }
      // http://localhost:5000/api/auth/login
      const response = await axios.get(
        "http://localhost:5000/api/auth/user-details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUserDetails(response.data.username);
      setError(null);
    } catch (err) {
      setError("Failed to fetch user details");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/Login");
    } else {
      getUserDetails();
    }
  }, [navigate]);

  // Handle task input change for title
  const handleTaskTitleChange = (e) => {
    setTaskTitle(e.target.value);
  };

  // Handle task input change for description
  const handleTaskDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  // Handle task completed checkbox change
  const handleTaskCompletedChange = (e) => {
    setTaskCompleted(e.target.checked);
  };

  // Handle task creation
  const addTask = async () => {
    if (!taskTitle.trim() || !taskDescription.trim()) {
      setError("Please enter both a task title and description.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to add a task.");
        navigate("/Login");
        return;
      }

      setError(null);

      const newTask = {
        title: taskTitle,
        description: taskDescription,
        completed: taskCompleted,
      };

      const response = await axios.post(
        "http://localhost:5000/api/todos/create",
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Reset the form upon successful creation
      setTaskTitle("");
      setTaskDescription("");
      setTaskCompleted(false);

      // Optionally navigate to another page (like task list)
      navigate("/");
    } catch (err) {
      setError("Failed to add task. Please try again.");
      console.error(err);
    } 
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/auth/logout")
      .then(() => {
        localStorage.removeItem("token");
        navigate("/Login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
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
              My Todo App
              <span className="font-thin">
                {/* Displaying userDetails or error */}
                {/* {loading ? (
                  "Loading..."
                ) : userDetails ? (
                  `(${userDetails})`
                ) : (
                  <span className="text-red-500">{error}</span>
                )} */}
                {userDetails ? (
                  `(${userDetails})`
                ) : (
                  <span className="text-red-500">{error}</span>
                )}
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

          <div className="flex flex-col gap-4 m-5">
            {/* Title Input */}
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={handleTaskTitleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring focus:ring-blue-500 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />

            {/* Description Input */}
            <textarea
              placeholder="Task Description"
              value={taskDescription}
              onChange={handleTaskDescriptionChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring focus:ring-blue-500 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />

            {/* Completed Checkbox */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={taskCompleted}
                onChange={handleTaskCompletedChange}
                className="w-5 h-5"
              />
              <span className="text-gray-700  dark:text-white">Completed</span>
            </label>

            {/* Add Task Button */}
            <button
              onClick={addTask}
              className="bg-blue-500 text-white text-sm font-semibold rounded-md px-4 py-3 transition duration-300 ease hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Add Task
            </button>

            {/* Error message if task is not added */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoForm;
