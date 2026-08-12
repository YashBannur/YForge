import axiosInstance from "./axiosInstance"
export const getAllStudents = () => axiosInstance.get("/trainer/students")