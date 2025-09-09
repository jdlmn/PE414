import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const getDogFact = () => API.get("/dogfact");
export const getBreeds = () => API.get("/breeds");
export const getBreedImages = (breed) => API.get(`/breeds/${breed}`);

export default API;