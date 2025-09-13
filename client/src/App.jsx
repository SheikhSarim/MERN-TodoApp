import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import TodoList from "./components/TodoList";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TasksPage from "./pages/TasksPage";

import "./App.css";
import EditTodo from "./components/TodoEdit";
import TodoForm from "./components/TodoForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/App" element={<TasksPage />} />
        <Route path="/todoform" element={<TodoForm />} />
        <Route path="/edit/:id" element={<EditTodo />} />
        {/* <Route path="/todolist" element={<TodoList />} />
        <Route path="/todoform" element={<TodoForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
