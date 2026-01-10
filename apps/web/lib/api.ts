import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const serverApi = async () => {
  const cookieStore = await cookies();
  
  const instance = axios.create({
    baseURL: "http://localhost:3001",
    headers: { Cookie: cookieStore.toString() },
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        redirect("/sign-in"); 
      }
      return Promise.reject(error);
    }
  );

  return instance;
};