import axios from "axios";

const instant = axios.create({
    baseURL: "http://localhost:5000/",
});
export default instant;