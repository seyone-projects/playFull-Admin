import axios from 'axios';
import config from '../config';

const GetAllSection = async (page, limit, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(`${config.apiUrl}sections?page=${page}&limit=${limit}&keyword=${keyword}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                sections: response.data.sections,
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
        const response = await axios.get(config.apiUrl + 'sections/sId/' + id,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        console.log(response.data);
        if (response.status === 200) {
            return {
                status: 200,
                section: response.data.section
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

//create a function to send the name and image to axios post to save the section
const Add = async (name, image) => {
    try {
        const data = new FormData();
        data.append("name", name);
        data.append("image", image);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'sections/add/', data,
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
                section: response.data.section
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

const Update = async (id, name, image, status) => {
    try {
        const data = new FormData();
        data.append("id", id);
        data.append("name", name);
        data.append("image", image);
        data.append("status", status);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'sections/update/' + id, data, {
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
                section: response.data.section
            };
        }
    } catch (error) {
        return {
            status: error.response.status,
            message: error.response.data.message
        };
    }
}

export { Add, Update, GetById, GetAllSection };
