// src/components/auth/LoginForm.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from 'prop-types';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Log in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                {...register('email')}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-gray-800 focus:bg-gray-800 sm:text-sm sm:leading-6"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                {...register('password')}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-gray-800 focus:bg-gray-800 sm:text-sm sm:leading-6"
              />
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>
          </div>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-900 px-2 text-gray-400">Or</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => (window.location.href = 'http://localhost:3000/auth/google')}
            className="flex w-full items-center justify-center rounded-md bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
              <path
                fill="#4285F4"
                d="M24 9.5c3.8 0 6.4 1.6 7.9 2.9l5.8-5.7C33.8 3.8 29.3 2 24 2 14.7 2 6.9 7.8 3.8 16.5l6.9 5.4C12.3 14.5 17.6 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.5 24c0-1.7-.2-3.4-.5-5H24v10h12.8c-.5 2.7-2.2 5-4.5 6.4l6.9 5.3C43.1 37.6 46.5 31.3 46.5 24z"
              />
              <path
                fill="#FBBC05"
                d="M10.7 28.4c-.8-2.5-.8-5.3 0-7.8l-6.9-5.4C1.3 19.7 0 21.8 0 24s1.3 4.3 3.8 8.8l6.9-5.4z"
              />
              <path
                fill="#EA4335"
                d="M24 46c6.2 0 11.4-2 15.1-5.5L32.2 35C30.4 36.3 27.5 37 24 37c-6.4 0-11.7-5-13.3-11.5L3.8 32.8C6.9 40.5 14.7 46 24 46z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoginForm;
