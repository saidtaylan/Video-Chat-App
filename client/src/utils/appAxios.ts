import axios from "axios";

export const MainServerAxios = axios.create({
  baseURL: "http://localhost:3000",
});
