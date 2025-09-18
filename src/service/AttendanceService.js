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

//get attendance reports with date and batch filters
const GetAttendanceReportsByBatchId = async (fromDate, toDate, batchId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}attendances/batchwise-attendance-report?fromDate=${fromDate}&toDate=${toDate}&batchId=${batchId}&page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
           const d = response.data.data; // ✅ correct level
            return {
                status: 200,
                message: response.data.message,
                attendances: d.attendances,
                totalItems: d.totalItems,
                totalPages: d.totalPages,
                currentPage: d.currentPage,               
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


//get attendance reports by studentid with pagination
const GetAttendanceReportsByStudentId = async (fromDate, toDate, studentId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}attendances/studentwise-attendance-report?fromDate=${fromDate}&toDate=${toDate}&studentId=${studentId}&page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            const data = response.data.data;
            return {
                status: 200,
                message: response.data.message,
                attendances: data.attendances,
                totalItems: data.totalItems, 
                totalPages: data.totalPages,
                currentPage: data.currentPage
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

//get attendance reports by lessonplannerid with pagination
const GetAttendanceReportsByLessonPlannerId = async (fromDate, toDate, lessonPlannerId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}attendances/lessonwise-attendance-report-student?fromDate=${fromDate}&toDate=${toDate}&lessonId=${lessonPlannerId}&page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            const data = response.data.data;
            return {
                status: 200,
                message: response.data.message,
                attendances: data.attendances,
                totalItems: data.totalItems, 
                totalPages: data.totalPages,
                currentPage: data.currentPage
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

//get monthly summary report by month, year
const GetMonthlySummaryReport = async (month, year) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(
            `${config.apiUrl}attendances/monthly-summary?month=${month}&year=${year}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        );

        if (response.status === 200) {
            const data = response.data;

            return {
                status: 200,
                message: data.message,
                summary: data.data,      // map backend "data" into "summary"
                totalItems: data.data.length,  // count batches
                totalPages: 1,           // no pagination yet, so set to 1
                currentPage: 1
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response?.data?.message || "Something went wrong"
        };
    }
};


export { Add, Update, GetById, GetAllAttendance, GetByLessonPlannerId, DeleteByBatchAndLessonPlanner, GetAttendanceReportsByBatchId, GetAttendanceReportsByStudentId, GetAttendanceReportsByLessonPlannerId, GetMonthlySummaryReport };

