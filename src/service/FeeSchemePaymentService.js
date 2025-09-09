import axios from 'axios';
import config from '../config';

const GetAllFeeSchemePayment = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}feeSchemePayments?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                feeSchemePayments: response.data.feeSchemePayments,
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
        const response = await axios.get(config.apiUrl + 'feeSchemePayments/fspId/' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                feeSchemePayment: response.data.feeSchemePayment
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

const Add = async (feeSchemeId, name, dueDate, amount, remarks) => {
    try {
        const data = new FormData();
        data.append("feeSchemeId", feeSchemeId);
        data.append("name", name);
        data.append("dueDate", dueDate);
        data.append("amount", amount);
        data.append("remarks", remarks);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'feeSchemePayments/add/', data,
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
                feeSchemePayment: response.data.feeSchemePayment
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
const Update = async (id, feeSchemeId, name, dueDate, amount, remarks, status) => {
    try {
        const data = new FormData();
        data.append("feeSchemeId", feeSchemeId);
        data.append("name", name);
        data.append("dueDate", dueDate);
        data.append("amount", amount);
        data.append("remarks", remarks);
        data.append("status", status);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'feeSchemePayments/update/' + id, data,
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
                feeSchemePayment: response.data.feeSchemePayment
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

//get lesson planners by feeScheme id
const GetByFeeSchemeId = async (feeSchemeId) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'feeSchemePayments/feeSchemeId/' + feeSchemeId,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

        if (response.status === 200) {
            return {
                status: 200,
                feeSchemePayments: response.data.feeSchemePayments,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalItems: response.data.totalItems,
                totalAmount: response.data.totalAmount
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

export { Add, Update, GetById, GetAllFeeSchemePayment, GetByFeeSchemeId };
