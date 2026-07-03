import axios from 'axios';
import config from '../config';

const Add = async (userId, courseIds) => {
  try {
    const data = new FormData();
    data.append("userId", userId);

    // ✅ Append each courseId to FormData array
    courseIds.forEach(courseId => data.append("courseIds[]", courseId));

    const token = localStorage.getItem("oojwt");

    const response = await axios.post(`${config.apiUrl}userCourses/add/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        success: true,
        message: response.data.message || "User enrolled in selected courses successfully",
        details: response.data.details || [],
      };
    } else {
      return {
        status: response.status,
        success: false,
        message: response.data.message || "Failed to map courses",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: error.response?.status || 400,
      success: false,
      message: error.response?.data?.message || "Something went wrong while mapping courses.",
    };
  }
};

//get coursed by user id
const GetCoursesByUserId = async (userId) => {
  try {
    const token = localStorage.getItem("oojwt");    
    const response = await axios.get(`${config.apiUrl}userCourses/userId/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      return {
        status: response.status,
        success: true,
        data: response.data,
        message: "Courses retrieved successfully"
      };
    } else {
      return {
        status: response.status,
        success: false,
        message: response.data.message || "Failed to get courses"
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: error.response?.status || 400,
      success: false,
      message: error.response?.data?.message || "Error retrieving courses"
    };
  }
};

// Delete user course by userId and courseId
const DeleteByUserIdAndCourseId = async (userId, courseId) => {
  try {
    const token = localStorage.getItem("oojwt");
    const response = await axios.delete(`${config.apiUrl}userCourses/delete/userId/${userId}/courseId/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      return {
        status: response.status,
        success: true,
        data: response.data,
        message: "User course mapping deleted successfully"
      };
    } else {
      return {
        status: response.status,
        success: false,
        message: response.data.message || "Failed to delete user course mapping"
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: error.response?.status || 400,
      success: false,
      message: error.response?.data?.message || "Error deleting user course mapping"
    };
  }
};

export { Add, GetCoursesByUserId, DeleteByUserIdAndCourseId};

