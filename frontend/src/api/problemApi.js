import axiosInstance from "./axiosInstance"

// Student-facing
export const getProblems = () => axiosInstance.get("/problems")

// Trainer-facing
export const getTrainerProblems = () => axiosInstance.get("/trainer/problems")
export const getTrainerProblem = (id) => axiosInstance.get(`/trainer/problems/${id}`)
export const createProblem = (data) => axiosInstance.post("/trainer/problems", data)
export const updateProblem = (id, data) => axiosInstance.put(`/trainer/problems/${id}`, data)
export const deleteProblem = (id) => axiosInstance.delete(`/trainer/problems/${id}`)