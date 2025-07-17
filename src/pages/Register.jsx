import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Registration successful!');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 bg-opacity-20 rounded-lg">
      <div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-lg text-white">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg text-white">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-lg text-white">Phone Number</label>
            <input
              type="tel"
              id="phone"
              className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg text-white">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-white">
            Already have an account? <Link to="/login" className="text-blue-400">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
