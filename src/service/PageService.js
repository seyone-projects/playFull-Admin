import axios from 'axios';
import config from '../config';

const GetAll = async (page, count, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
       const response = await axios.get(config.apiUrl + 'pages?page='+page+'&count='+count+'&keyword=' + keyword,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log(response.data);
        if( response.status === 200 ){
            return {
                status: 200,
                pages: response.data.pages
            };
        }
    } catch (error) {
        console.log(error);
        if( error.response.status === 401 ){
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
        const response = await axios.get(config.apiUrl + 'pages/pgId/' + id,
       {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log(response.data);
        if( response.status === 200 ){
            return {
                status: 200,
                page: response.data.page
            };
        }
    } catch (error) {
        console.log(error);
        if( error.response.status === 401 ){
            return {
                status: 401,
                message: error.response.data.message
            };
        }
    }
}

//create a function to send the name and image to axios post to save the page
const Add = async (title, image, description) => {
    try {
        const data = new FormData();
        data.append("title", title);
        data.append("image", image);
        data.append("description", description);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'pages/add/', data, 
        {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response.data);
        if( response.status === 200 ){
            return {
                status: 200,
                message: response.data.message,
                page: response.data.page
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

const Update = async (id, title, image, description, status) => {
    try {
        const data = new FormData();
        data.append("id", id);
        data.append("title", title);
        data.append("image", image);
        data.append("description", description);
        data.append("status", status);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'pages/update/' + id , data, 
        {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log(response.data);
        if( response.status === 200 ){
            return {
                status: 200,
                message: response.data.message,
                page: response.data.page
            };
        }
    } catch (error) {
        return {
            status: error.response.status,
            message: error.response.data.message
        };
    }
}

//delete
const Delete = async (id) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.delete(config.apiUrl + 'pages/delete/' + id , {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        
        if(response.status === 200) {
            return {
                status: 200,
                message: response.data.message
            };
        }
    } catch (error) {
        return {
            status: error.response.status,
            message: error.response.data.message
        };
    }
}

export {Add, Update, GetById, GetAll, Delete};    

