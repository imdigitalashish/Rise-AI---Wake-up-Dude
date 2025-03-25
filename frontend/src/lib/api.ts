import axios from "axios";

const app_api = axios.create({
    baseURL: "http://localhost:9090/api/v1",
  
});

export default app_api