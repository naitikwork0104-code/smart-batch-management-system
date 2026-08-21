import '../App.css';
import logo from '../logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {

  const [userId, setUserId] = useState('');
  const [passwd, setPasswd] = useState('');
const navigate = useNavigate();
 const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  const response = await fetch(
    'http://localhost:5000/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        passwd
      })
    }
  );

  const data = await response.json();

   if (response.ok) {

    sessionStorage.setItem('token', data.token);

    navigate('/dashboard');

  } else {

    console.log('Login failed');

  }
};

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center px-4">

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Logo + Brand */}
        <div className="flex items-center gap-3 mb-8">

          <img
            src={logo}
            alt="Student Management System Logo"
            className="w-10 h-10 object-contain"
          />

          <div className="leading-tight">
            <h2 className="font-bold text-gray-900 text-base">
              Student Management
            </h2>

            <h2 className="font-bold text-gray-900 text-base">
              System
            </h2>
          </div>

        </div>


        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="font-bold text-3xl text-gray-900">
            SIGN-IN
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Login to continue to your account
          </p>

        </div>


        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Unique ID */}
          <div className="mb-5">

            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Unique ID
            </label>

            <input
              id="userId"
              type="text"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              required
              className="
                w-full
                border border-gray-300
                p-3
                rounded-lg
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                transition
                duration-200
              "
            />

          </div>


          {/* Password */}
          <div className="mb-4">

            <div className="flex justify-between items-center mb-2">

              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </a>

            </div>

            <input
              id="password"
              type="password"
              name="passwd"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
              placeholder="Enter your password"
              required
              className="
                w-full
                border border-gray-300
                p-3
                rounded-lg
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                transition
                duration-200
              "
            />

          </div>


          {/* Remember Me */}
          <div className="flex items-center mb-6">

            <input
              id="remember"
              type="checkbox"
              name="remember"
              className="w-4 h-4 mr-2 accent-blue-600"
            />

            <label
              htmlFor="remember"
              className="text-sm text-gray-600"
            >
              Remember me
            </label>

          </div>


          {/* Login Button */}
          <button
            type="submit"
            className="
              w-full
              bg-blue-600
              text-white
              p-3
              rounded-lg
              font-medium
              hover:bg-blue-700
              hover:scale-[1.02]
              hover:shadow-md
              transition
              duration-300
            "
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;