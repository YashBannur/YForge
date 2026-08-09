
import axiosInstance from "./axiosInstance"
export const getAchievements = () => axiosInstance.get("/student/achievements")