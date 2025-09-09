import axios from 'axios';
import config from '../config';


const Add = async (batchId, userIds, feeSchemeId) => {
  try {
    const data = new FormData();
    data.append("batchId", batchId);

    // Append each userId separately to FormData
    userIds.forEach((userId) => data.append("userIds[]", userId));

    data.append("feeSchemeId", feeSchemeId);

    const token = localStorage.getItem("oojwt");
    const response = await axios.post(config.apiUrl + 'batchStudents/add/', data, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200) {
      return {
        status: 200,
        message: response.data.message,
        batchStudents: response.data.batchStudents // backend now returns multiple students
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: error.response?.data?.message || "Something went wrong"
    };
  }
};



export { Add };
