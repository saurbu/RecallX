
import axios from "axios";

const axiosBaseQuery =
    ({ baseUrl } = { baseUrl: "" }) =>
    async ({ url, method = "GET", data, params }) => {
        try {
            const result = await axios({
                url: `${baseUrl}${url}`,
                method,
                data,
                params,
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return { data: result.data };
        } catch (axiosError) {
            return {
                error: {
                    status: axiosError.response?.status || "FETCH_ERROR",
                    data: axiosError.response?.data || {
                        message: axiosError.message
                    }
                }
            };
        }
    };

export default axiosBaseQuery;
