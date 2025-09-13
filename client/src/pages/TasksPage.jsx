import React, { useState, useEffect } from "react";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/Login");
        return;
      }
    };

    fetchTasks();
  }, [navigate]);

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
      console.log("Fetched username:", response.data.username);

      setError(null);
    } catch (err) {
      setError("Failed to fetch user details");
      console.error(err);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);



  return (
    <div className="tasks-page w-full">
      {/* <TodoForm addTask={addTask} /> */}
      <TodoList user={userDetails} />
    </div>
  );
};

export default TasksPage;
