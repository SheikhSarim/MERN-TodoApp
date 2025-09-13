import { Button, Checkbox, Label } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { DarkThemeToggle } from "flowbite-react";
import { HiMail, HiEye, HiEyeOff } from "react-icons/hi";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [creds, setcreds] = useState({ username: "", email: "", password: "" });
  const navigator = useNavigate();

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

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        creds
      );
      if (response.status === 201) {
        alert(response.data.message);
        navigator("/Login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response.data.message) {
          return alert(error.response.data.message);
        }
        error.response.data.error.errors.forEach((error) => {
          alert(error.msg);
        });
      } else {
        alert("some error occured");
      }
    }
  };
  return (
    <div>
      <main className="flex flex-col px-4 min-h-screen items-center justify-center gap-4 dark:bg-gray-800 w-screen">
        <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4 max-w-7xl mx-auto p-4 bg-white rounded shadow-md shadow-gray-400 dark:bg-gray-900 dark:shadow-gray-600">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 w-full flex items-center justify-between">
              Sign Up
              <DarkThemeToggle />
            </h1>
          </div>
          <form
            className="flex max-w-full flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* Username Input */}
            <div className="block">
              <Label htmlFor="username" value="Your username" />
            </div>
            <div className="relative">
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Your username"
                required
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 pr-10 py-2 focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-black"
              />
            </div>

            {/* Email Input */}
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

            {/* Password Input */}
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
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>

            {/* Submit Button */}
            <Button className="bg-slate-700 outline-none" type="submit">
              Submit
            </Button>

            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/Login" className="text-[#8681FF] cursor-pointer">
                Log in
              </Link>{" "}
              instead
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
