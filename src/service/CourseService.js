import axios from 'axios';
import config from '../config';

const GetAll = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}courses/admin/all?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                courses: response.data.courses,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalItems: response.data.totalItems,
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

const GetById = async (id) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'courses/cId/' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                course: response.data.course
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

//create a function to send the name and image to axios post to save the course
const Add = async (categoryId, subCategoryIds, name, image, description) => {
    try {
        const data = new FormData();
        data.append("categoryId", categoryId);

        // Append each subCategoryId separately
        subCategoryIds.forEach(id => {
            data.append("subCategoryIds", id);
        });
        
        data.append("name", name);
        data.append("image", image);
        data.append("description", description);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'courses/add/', data,
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
                course: response.data.course
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

const Update = async (id, categoryId, subCategoryIds, name, image, status, description) => {
    try {
        const data = new FormData();
        data.append("id", id);
        data.append("categoryId", categoryId);
        // Append each subCategoryId individually
        subCategoryIds.forEach(id => {
            data.append("subCategoryIds", id);
        });
        data.append("name", name);
        data.append("image", image);
        data.append("status", status);
        data.append("description", description);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'courses/update/' + id, data,
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
                course: response.data.course
            };
        }
    } catch (error) {
        return {
            status: error.response.status,
            message: error.response.data.message
        };
    }
}

//get subsections by category id
const GetByCategoryId = async (categoryId) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'courses/categoryId/' + categoryId,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                courses: response.data.courses
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

const TogglePublish = async (id) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.put(`${config.apiUrl}courses/publish/${id}`, {},
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                course: response.data.course
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: error.response?.status || 500,
            message: error.response?.data?.message || "Error publishing course"
        };
    }
}

export { Add, Update, GetById, GetAll, GetByCategoryId, TogglePublish };
