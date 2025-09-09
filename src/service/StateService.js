import axios from 'axios';
import config from '../config';

const GetAllState = async (page, count, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
       const response = await axios.get(config.apiUrl + 'states?page='+page+'&count='+count+'&keyword=' + keyword,
         {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log(response.data);
        if( response.status === 200 ){
            return {
                status: 200,
                states: response.data.states
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
        const response = await axios.get(config.apiUrl + 'states/sId/' + id,
       {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log(response.data);
        if( response.status === 200 ){
            return {
                status: 200,
                state: response.data.state
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

//create a function to send the name and image to axios post to save the state
const Add = async (name, image) => {
    try {
        const data = new FormData();
        data.append("name", name);
        data.append("image", image);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'states/add/', data, 
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
                state: response.data.state
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

const Update = async (id, name, image, status) => {
    try {
        const data = new FormData();
        data.append("id", id);
        data.append("name", name);
        data.append("image", image);
        data.append("status", status);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'states/update/' + id, data, {
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
                state: response.data.state
            };
        }
    } catch (error) {
        return {
            status: error.response.status,
            message: error.response.data.message
        };
    }
}

export {Add, Update, GetById, GetAllState};
