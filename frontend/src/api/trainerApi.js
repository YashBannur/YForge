import axiosInstance from "./axiosInstance"

export const getTrainerDashboard = () => axiosInstance.get("/trainer/dashboard")