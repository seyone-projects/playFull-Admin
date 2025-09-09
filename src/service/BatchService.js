import axios from 'axios';
import config from '../config';

const GetAll = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}batches?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                batchs: response.data.batchs,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
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

//want users by batch id with pagination
const GetUsersByBatchId = async (id, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}batches/${id}/users?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                users: response.data.users,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
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

const GetById = async (id) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'batches/bId/' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                batch: response.data.batch
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

//create a function to send the name and image to axios post to save the batch
const Add = async (trainerId, code, name, startDate, fee, certificate, description, image, courseId, trainerCost, trainerTds) => {
    try {
        const data = new FormData();
        data.append("trainerId", trainerId);
        data.append("code", code);
        data.append("name", name);
        data.append("startDate", startDate);
        data.append("fee", fee);
        data.append("certificate", certificate);
        data.append("description", description);
        data.append("image", image);
        data.append("courseId", courseId);
        data.append("trainerCost", trainerCost);
        data.append("trainerTds", trainerTds);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'batches/add/', data, {
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
                batch: response.data.batch
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

const Update = async (id, trainerId, code, name, startDate, fee, certificate, description, image, status, courseId, trainerCost, trainerTds) => {
    try {
        const data = new FormData();
        data.append("id", id);
        data.append("trainerId", trainerId);
        data.append("code", code);
        data.append("name", name);
        data.append("startDate", startDate);
        data.append("fee", fee);
        data.append("certificate", certificate);
        data.append("description", description);
        data.append("image", image);
        data.append("status", status);
        data.append("courseId", courseId);
        data.append("trainerCost", trainerCost);
        data.append("trainerTds", trainerTds);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'batches/update/' + id, data, {
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
                batch: response.data.batch
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

//update users by batch id
const UpdateUsers = async (id, userIds) => {
    try {
        const data = new FormData();

        const usersPayload = userIds.map(userId => ({
            userId: userId
        }));

        data.append("users", JSON.stringify(usersPayload));

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(`${config.apiUrl}batches/updateUsers/${id}`, data, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                batch: response.data.batch
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
};

//delete user by batch id
const DeleteUser = async (batchId, userId) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.delete(`${config.apiUrl}batches/deleteUser/${batchId}/${userId}`, {
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


export { Add, Update, GetById, GetAll, UpdateUsers, GetUsersByBatchId, DeleteUser };
