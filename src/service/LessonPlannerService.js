import axios from 'axios';
import config from '../config';

const GetAllLessonPlanner = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}lessonPlanners?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                lessonPlanners: response.data.lessonPlanners,
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

//get today's lesson planners with pagination
const GetTodayLessonPlanners = async (page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}lessonPlanners/today?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        
        if (response.status === 200) {
            return {
                status: 200,
                lessonPlanners: response.data.lessonPlanners,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalItems: response.data.totalItems
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
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}

const GetById = async (id) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'lessonPlanners/lpId/' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                lessonPlanner: response.data.lessonPlanner
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

const Add = async (batchId, trainerId, lessonTopic, lessonDate, lessonTime, lessonDuration, lessonDescription, link, remarks) => {
    try {
        const data = new FormData();
        data.append("batchId", batchId);
        data.append("trainerId", trainerId); 
        data.append("lessonTopic", lessonTopic);
        data.append("lessonDate", lessonDate);
        data.append("lessonTime", lessonTime);
        data.append("lessonDuration", lessonDuration);
        data.append("lessonDescription", lessonDescription);
        data.append("link", link);
        data.append("remarks", remarks);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'lessonPlanners/add/', data,
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
                lessonPlanner: response.data.lessonPlanner
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

//update lesson planner
const Update = async (id, batchId, trainerId, lessonTopic, lessonDate, lessonTime, lessonDuration, lessonDescription, link, remarks, status, screenshot1, screenshot2, screenshot3, screenshot4) => {
    try {
        const data = new FormData();
        data.append("batchId", batchId);
        data.append("trainerId", trainerId);
        data.append("lessonTopic", lessonTopic); 
        data.append("lessonDate", lessonDate);
        data.append("lessonTime", lessonTime);
        data.append("lessonDuration", lessonDuration);
        data.append("lessonDescription", lessonDescription);
        data.append("link", link);
        data.append("remarks", remarks);
        data.append("status", status);

        // Append screenshots only if provided
        if (screenshot1) data.append("screenshot1", screenshot1);
        if (screenshot2) data.append("screenshot2", screenshot2);
        if (screenshot3) data.append("screenshot3", screenshot3);
        if (screenshot4) data.append("screenshot4", screenshot4);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'lessonPlanners/update/' + id, data,
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
                lessonPlanner: response.data.lessonPlanner
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


//get lesson planners by batch id with paginaiton
const GetByBatchId = async (batchId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}lessonPlanners/batchId/${batchId}?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            return {
                status: 200,
                lessonPlanners: response.data.lessonPlanners,
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

export { Add, Update, GetById, GetAllLessonPlanner, GetByBatchId, GetTodayLessonPlanners };
