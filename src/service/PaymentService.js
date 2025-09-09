import axios from 'axios';
import config from '../config';

const GetAll = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}payments?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                payments: response.data.payments,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalItems: response.data.totalItems,
                totalFee: response.data.totalFee,
                totalPaidAmount: response.data.totalPaidAmount,
                balance: response.data.balance,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 401,
            message: error.response.data.message
        };

    }
}

//create a function to send the name and image to axios post to save the payment
const Add = async (paymodeId, userId, batchId, amount, paymentDateTime, paymentReference, reason) => {
    try {
        const data = new FormData();
        data.append("paymodeId", paymodeId);
        data.append("userId", userId);
        data.append("batchId", batchId);
        data.append("amount", amount);
        data.append("paymentDateTime", paymentDateTime);
        data.append("paymentReference", paymentReference);
        data.append("reason", reason);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'payments/add/', data,
            {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                payment: response.data.payment,                
            };            
        }
        console.log("totalpaid", response.totalPaidAmount);
        console.log("balance", response.balance);
        console.log("batchFee", response.batchFee);
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response.data.message
        };

    }
}

//get payment by user id and batch with pagination
const GetByUserAndBatch = async (userId, batchId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}payments/${userId}/${batchId}?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                payments: response.data.payments,
                totalPages: response.data.totalPages, 
                currentPage: response.data.currentPage,
                totalItems: response.data.totalItems,  
                totalFee : response.data.totalFee,
                totalPaidAmount : response.data.totalPaidAmount,
                balance : response.data.balance,                            
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 401,
            message: error.response.data.message
        };
    }
}


//delete payment
const Delete = async (id) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.delete(`${config.apiUrl}payments/delete/${id}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
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

//get payment by batch id with pagination
const GetByBatchId = async (batchId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}payments/${batchId}?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        if (response.status === 200) {
            return {
                status: 200,
                payments: response.data.payments,                
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

//search payments by from payment date, to payment date, userId
const GetSearchStudentPayments = async (fromDate, toDate, userId, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}payments/search/student/payment?fromDate=${fromDate}&toDate=${toDate}&userId=${userId}&page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        if (response.status === 200) {
            return {
                status: 200,
                payments: response.data.payments,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage, 
                totalItems: response.data.totalItems,
                totalFee: response.data.totalFee,
                totalPaidAmount: response.data.totalPaidAmount,
                balance: response.data.balance
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

export { Add, GetAll, GetByUserAndBatch, Delete, GetByBatchId, GetSearchStudentPayments};


