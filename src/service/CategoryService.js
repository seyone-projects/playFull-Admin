import axios from 'axios';
import config from '../config';

const GetAll = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}categorys?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                categories: response.data.categories,
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
        const response = await axios.get(config.apiUrl + 'categorys/cId/' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                category: response.data.category
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

//create a function to send the name and image to axios post to save the category
const Add = async (sectionId, name, image) => {
    try {
        const data = new FormData();
        data.append("sectionId", sectionId);
        data.append("name", name);
        data.append("image", image);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'categorys/add/', data,
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
                category: response.data.category
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

const Update = async (id, sectionId, name, image, status) => {
    try {
        const data = new FormData();
        data.append("id", id);
        data.append("sectionId", sectionId);
        data.append("name", name);
        data.append("image", image);
        data.append("status", status);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'categorys/update/' + id, data,
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
                category: response.data.category
            };
        }
    } catch (error) {
        return {
            status: error.response.status,
            message: error.response.data.message
        };
    }
}

//get subsections by section id
const GetBySectionId = async (sectionId) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'categorys/sectionId/' + sectionId,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                categorys: response.data.categorys
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

export { Add, Update, GetById, GetAll, GetBySectionId };
