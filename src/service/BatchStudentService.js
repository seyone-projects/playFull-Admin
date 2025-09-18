import axios from 'axios';
import config from '../config';


const Add = async (batchId, userIds, feeSchemeId) => {
  try {
    const data = new FormData();
    data.append("batchId", batchId);

    // Append each userId separately to FormData
    userIds.forEach((userId) => data.append("userIds[]", userId));
    
    // Append only if valid
    if (feeSchemeId && feeSchemeId !== "null" && feeSchemeId !== "undefined") {
      data.append("feeSchemeId", feeSchemeId);
    }

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

//get batchstudents by batchId with pagination
const GetByBatchId = async (batchId, page, limit) => {
  try {
    const token = localStorage.getItem("oojwt");
    const response = await axios.get(config.apiUrl + `batchStudents/batchId/${batchId}?page=${page}&limit=${limit}`, {      
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.status === 200) {
      return {
        status: 200,
        message: response.data.message,
        batchStudents: response.data.batchStudents,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalRecords: response.data.totalRecords
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

//delete student by batch id
const DeleteStudent = async (batchId, userId) => {
  try {
    const token = localStorage.getItem("oojwt");
    const response = await axios.delete(`${config.apiUrl}batchStudents/delete/${batchId}/${userId}`, {
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
      message: error.response?.data?.message || "Something went wrong"
    };
  }
}

export { Add, GetByBatchId, DeleteStudent };


