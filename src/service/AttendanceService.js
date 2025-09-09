import axios from 'axios';
import config from '../config';

const GetAllAttendance = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}attendances?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                attendances: response.data.attendances,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalItems: response.data.totalItems,
            };
        }
    } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
            return {
                status: 401,
                message: error.response.data.message
            };
        }
    }
}

const GetById = async (id) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'attendances/aId/' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                attendance: response.data.attendance
            };
        }
    } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
            return {
                status: 401,
                message: error.response.data.message
            };
        }
    }
}

const Add = async (batchId, userId, lessonPlannerId, attendanceDate, attendanceStatus, remarks) => {
    try {
        const data = new FormData();
        data.append("batchId", batchId);
        data.append("userId", userId);
        data.append("lessonPlannerId", lessonPlannerId);
        data.append("attendanceDate", attendanceDate);
        data.append("attendanceStatus", attendanceStatus);
        data.append("remarks", remarks);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'attendances/add/', data,
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
                attendance: response.data.attendance
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

//update attendance
const Update = async (id, batchId, userId, lessonPlannerId, attendanceDate, attendanceStatus, remarks, status) => {
    try {
        const data = new FormData();
        data.append("batchId", batchId);
        data.append("userId", userId);
        data.append("lessonPlannerId", lessonPlannerId);
        data.append("attendanceDate", attendanceDate);
        data.append("attendanceStatus", attendanceStatus);
        data.append("remarks", remarks);
        data.append("status", status);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'attendances/update/' + id, data,
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
                attendance: response.data.attendance
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

//get attendances by lessonPlanner id
const GetByLessonPlannerId = async (lessonPlannerId) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'attendances/lessonPlannerId/' + lessonPlannerId,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.status === 200) {
            return {
                status: 200,
                attendances: response.data.attendances
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

//delete attendances by batchId and lessonPlannerId
const DeleteByBatchAndLessonPlanner = async (batchId, lessonPlannerId) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.delete(`${config.apiUrl}attendances/delete/${batchId}/${lessonPlannerId}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message
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

export { Add, Update, GetById, GetAllAttendance, GetByLessonPlannerId, DeleteByBatchAndLessonPlanner };
