//write a function to connect to rest api with axio in post method called UserLogin
import axios from 'axios';
import config from '../config';

const UserLogin = async (username, password) => {
    try {
        const data = new FormData();
        data.append("mobile", username);
        data.append("password", password);

        const response = await axios.post(config.apiUrl + 'users/login', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("response userlogin: ", response);
        if (response.status === 200) {

            localStorage.setItem("oojwt", response.data.token);
            const role = response.data?.user?.role;
            return {
                status: 200,
                message: response.data.message,
                role: role,
                user: response.data.user
            };

        }

    } catch (error) {
        console.error(error);
        return {
            status: 400,
            message: error.response.data.message
        };

    }
}

//create a function to hit rest api as post with axios with jwt from localstorage in the header
const LoggedUserDetail = async () => {
    try {
        const token = localStorage.getItem("oojwt");
        console.log("token: ", token);
        const response = await axios.get(config.apiUrl + 'users/user/?token=' + token, {}, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log("response userdetail by jwt: ", response);
        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                user: response.data.user
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

//get users by role
const GetUsersByRole = async (role, page, limit) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(
            `${config.apiUrl}users/role/${role}?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                users: response.data.users,
                currentPage: response.data.currentPage, 
                totalPages: response.data.totalPages,
                totalItems: response.data.totalItems, 
            };
        }
        
    } catch (error) {
        console.error(error);
        return {
            status: 400,
            message: error.response?.data?.message || "Something went wrong"
        };
    }
};


//get by id
const GetUserById = async (id) => {
    try {
        const token = localStorage.getItem("oojwt");
        const response = await axios.get(config.apiUrl + 'users/uId/' + id, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                user: response.data.user
            };
        }

    } catch (error) {
        console.error(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}

//add user 
const Add = async (cityId, genderId, username, email, mobile, whatsapp, password, image, role, joiningDate, parentMobile, parentEmail, parentWhatsapp, trainerPan, trainerAadhar, trainerPanImage, trainerAadharImage, trainerBankName, trainerBankAccountNumber, trainerBankIfscCode, trainerBankBranch, educationProof, experienceProof) => {
    try {
        const token = localStorage.getItem("oojwt");
        const formData = new FormData();
        formData.append("cityId", cityId);
        formData.append("genderId", genderId);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("whatsapp", whatsapp);
        formData.append("password", password);
        formData.append("image", image);
        formData.append("role", role);
        formData.append("joiningDate", joiningDate);
        formData.append("parentMobile", parentMobile);
        formData.append("parentEmail", parentEmail);
        formData.append("parentWhatsapp", parentWhatsapp);
        formData.append("trainerPan", trainerPan);
        formData.append("trainerAadhar", trainerAadhar);
        formData.append("trainerPanImage", trainerPanImage);
        formData.append("trainerAadharImage", trainerAadharImage);
        formData.append("trainerBankName", trainerBankName);
        formData.append("trainerBankAccountNumber", trainerBankAccountNumber);
        formData.append("trainerBankIfscCode", trainerBankIfscCode);
        formData.append("trainerBankBranch", trainerBankBranch);
        formData.append("educationProof", educationProof);
        formData.append("experienceProof", experienceProof);        

        const response = await axios.post(config.apiUrl + 'users/add', formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                user: response.data.user
            };
        }

    } catch (error) {
        console.error(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}


//update user 
const Update = async (id, cityId, genderId, username, email, mobile, whatsapp, image, joiningDate, address, landmark, pincode, status, parentMobile, parentEmail, parentWhatsapp) => {
    try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("cityId", cityId);
        formData.append("genderId", genderId);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("whatsapp", whatsapp);
        formData.append("image", image);
        formData.append("joiningDate", joiningDate);
        formData.append("address", address);
        formData.append("landmark", landmark);
        formData.append("pincode", pincode);
        formData.append("status", status);
        formData.append("parentMobile", parentMobile);
        formData.append("parentEmail", parentEmail);
        formData.append("parentWhatsapp", parentWhatsapp);

        console.log("Image in service : " + image);

        const token = localStorage.getItem("oojwt");
        const response = await axios.post(config.apiUrl + 'users/update/' + id, formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                user: response.data.user
            };
        }

    } catch (error) {
        console.error(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}

//update new password by id
const UpdateMemberPassword = async (id, newPassword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const formData = new FormData();
        formData.append("newPassword", newPassword);
        console.log("newPassword in service : " + newPassword);

        const response = await axios.post(config.apiUrl + 'users/update-member-password/' + id, formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                user: response.data.user
            };
        }

    } catch (error) {
        console.error(error);
        return {
            status: 400, 
            message: error.response.data.message
        };
    }
}

//update password by id with old password and new password
const UpdatePassword = async (id, oldPassword, newPassword) => {
    try {
        const token = localStorage.getItem("oojwt");
        const formData = new FormData();
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);

        const response = await axios.post(config.apiUrl + 'users/update-password/' + id, formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                user: response.data.user
            };
        }

    } catch (error) {
        console.error(error);
        return {
            status: 400,
            message: error.response.data.message
        };
    }
}


//Get redirect URL based on role
const GetRedirectUrl = async (mobile) => {
    try {
        const data = new FormData();
        data.append("mobile", mobile);

        const response = await axios.post(config.apiUrl + 'users/single-signin-redirect-url', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("response redirect url: ", response);
        if (response.status === 200) {
            return {
                status: 200,
                message: response.data.message,
                redirectUrl: response.data.redirectUrl,
                role: response.data.role
            };
        }

    } catch (error) {
        console.error(error);
        return {
            status: 400,
            message: error.response?.data?.message || "Error getting redirect URL"
        };
    }
}



export { UserLogin, LoggedUserDetail, GetUsersByRole, GetUserById, Add, Update, UpdateMemberPassword, UpdatePassword, GetRedirectUrl};