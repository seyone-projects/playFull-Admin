import axios from 'axios';
import config from '../config';

const CityGetAll = async () => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'citys/', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if( response.status === 200 ){
            return {
                status: 200,
                citys: response.data.citys
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

export {CityGetAll};