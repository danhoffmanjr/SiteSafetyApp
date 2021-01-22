import axios from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..'

const token = localStorage.getItem("ps-token");
const baseURL = "https://127.0.0.1:5001/api";
let tokenRecheck: string | null = null;

const axiosInstance = axios.create({
    baseURL: baseURL
});

axiosInstance.interceptors.request.use(
    config => {
      if (token === null) {
        tokenRecheck = localStorage.getItem("ps-token");
      } else {
        tokenRecheck = token;
      }
      if (tokenRecheck !== null) {
        config.headers.Authorization = `Bearer ${tokenRecheck}`;
        return config;
      } else {
        return config;
      }
    },
    error => {
      console.log("Axios - Token Error", error); //remove
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(undefined, (error) => {
    const { status, data, config, headers } = error.response;

    if (error.message === "Network Error" && !error.response) {
      toast.error("Error - Network connection refused.");
    }

    if (status === 401 && headers['www-authentication'] === 'Bearer error="invalid_token", error_description="The token is expired"') {
      localStorage.removeItem("ps-token");
      history.push('/');
      toast.info("Your session has expired, please login again.");
    }

    if (status === 404) {
      history.push("/notfound");
    }

    if (
      status === 400 &&
      config.method === "get" &&
      data.errors.hasOwnProperty("id")
    ) {
      history.push("/notfound");
    }
    
    if (status === 500) {
      toast.error(`500 Internal Server Error: ${data.error}`);
    }
    throw error.response;
  });

export default axiosInstance;