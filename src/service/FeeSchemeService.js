import axios from 'axios';
import config from '../config';

const GetAllFeeScheme = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}feeSchemes?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                feeSchemes: response.data.feeSchemes,
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
        const response = await axios.get(config.apiUrl + 'feeSchemes/fsId/' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                feeScheme: response.data.feeScheme
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

const Add = async (batchId, name, remarks) => {
    try {
        const data = new FormData();
        data.append("batchId", batchId);
        data.append("name", name);
        data.append("remarks", remarks);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'feeSchemes/add/', data,
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
                feeScheme: response.data.feeScheme
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
const Update = async (id, batchId, name, remarks, status) => {
    try {
        const data = new FormData();
        data.append("batchId", batchId);
        data.append("name", name);
        data.append("remarks", remarks);
        data.append("status", status);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'feeSchemes/update/' + id, data,
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
                feeScheme: response.data.feeScheme
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


//get fee schemes by batch id with pagination
const GetByBatchId = async (batchId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}feeSchemes/batchId/${batchId}?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            return {
                status: 200,
                feeSchemes: response.data.feeSchemes,
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages, 
                totalItems: response.data.totalItems,
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


export { Add, Update, GetById, GetAllFeeScheme, GetByBatchId };
