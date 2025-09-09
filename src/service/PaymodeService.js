import axios from 'axios';
import config from '../config';

const GetAllPaymode = async (page, count, keyword) => {
    try {
        const token = localStorage.getItem("oojwt");
       const response = await axios.get(config.apiUrl + 'paymodes?page='+page+'&count='+count+'&keyword=' + keyword,
         {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log(response.data);
        if( response.status === 200 ){
            return {
                status: 200,
                paymodes: response.data.paymodes
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



export { GetAllPaymode };
