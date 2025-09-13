import { Button, Checkbox, DarkThemeToggle, Label } from "flowbite-react";
import React, { useState } from "react";

import { HiMail, HiEye, HiEyeOff } from "react-icons/hi";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [creds, setcreds] = useState({ email: "", password: "" });
  const navigator = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [errors, setErrors] = useState({ email: "", password: "" });
  // useEffect(() => {
  //   const checkLoggedIn = () => {
  //     if (localStorage.getItem("token")) {
  //       navigator("/");
  //     }
  //   };

  //   checkLoggedIn();
  // }, [navigator]);

  const onChange = (e) => {
    setcreds({ ...creds, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Email:", creds.email.trim());
  //   console.log("Password:", creds.password.trim());

  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formIsValid = true;
    let newErrors = { email: "", password: "" };

    // Client-side validation
    if (!creds.email) {
      formIsValid = false;
      newErrors.email = "Email is required.";
    }

    if (!creds.password) {
      formIsValid = false;
      newErrors.password = "Password is required.";
    }

    if (!formIsValid) {
      setErrors(newErrors);
      return; // Stop execution if validation fails
    }

 
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        creds,

        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);

        navigator("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle error from backend
        console.log(error.response);  // You can log the full error to debug
        setErrorMessage(error.response?.data?.message || "Invalid credentials");
      } else {
        setErrorMessage("some error occured");
      }
    }

    console.log("handle login works");
  };

  return (
    <div>
      <main className="flex flex-col px-4 min-h-screen items-center justify-center gap-4 dark:bg-gray-800 w-screen">
        <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4 max-w-7xl mx-auto p-4 bg-white rounded shadow-md shadow-gray-400 dark:bg-gray-900 dark:shadow-gray-600">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 w-full flex items-center justify-between">
              Login
              <DarkThemeToggle />
            </h1>
          </div>
          {errorMessage && (
            <div className="alert alert-danger text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
          )}
          <form
            className="flex max-w-full flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div className="block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <div className="relative">
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@flowbite.com"
                required
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 pr-10 py-2 focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-black"
              />
              <HiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
            <div className="block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                required
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 pr-10 py-2 focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-black"
              />
              {showPassword ? (
                <HiEyeOff
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                />
              ) : (
                <HiEye
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                />
              )}
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button className="bg-slate-700 outline-none" type="submit">
              Login
            </Button>

            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/Register" className="text-[#8681FF] cursor-pointer">
                Sign up
              </Link>{" "}
              now
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
