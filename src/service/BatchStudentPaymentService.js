import axios from 'axios';
import config from '../config';


const Add = async (batchStudentPaymentId, amount, lastDate, paymentReference, paymentDateTime) => {
    try {
        const data = new FormData();
        data.append("batchStudentPaymentId", batchStudentPaymentId);       
        data.append("amount", amount);
        data.append("lastDate", lastDate);
        data.append("paymentReference", paymentReference);
        data.append("paymentDateTime", paymentDateTime);
       

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'batchStudentPayments/add/', data,
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
                batchStudentPayment: response.data.batchStudentPayment
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


export { Add };
