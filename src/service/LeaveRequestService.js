import axios from 'axios';
import config from '../config';

const Add = async (userId, lessonPlannerId, applyRemarks) => {
    try {
        const data = new FormData();
        data.append("userId", userId);
        data.append("lessonPlannerId", lessonPlannerId);
        data.append("applyRemarks", applyRemarks);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'leaveRequests/add/', data,
            {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                }
            });

        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                leaveRequest: response.data.leaveRequest
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}

//get all leave requests
const GetAll = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + `leaveRequests?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                leaveRequests: response.data.leaveRequests,
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
                totalItems: response.data.totalItems
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}

//update leave request
const Update = async (id, responseRemarks, status) => {
    try {
        const data = new FormData();
        data.append("responseRemarks", responseRemarks);
        data.append("status", status);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + `leaveRequests/update/${id}`, data,
            {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                }
            });

        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                leaveRequest: response.data.leaveRequest
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}

export { Add, GetAll, Update};
