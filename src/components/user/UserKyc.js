import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Update, GetUserById } from '../../service/UserService';
import { CityGetAll } from '../../service/CityService';
import { GenderGetAll } from '../../service/GenderService';

export default function UserKyc() {
    const {
        isLoading,
        setIsLoading,
        setAppError,
        setAppErrorMessage,
        setAppErrorTitle,
        setAppErrorMode
    } = useGlobalContext();

    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [cityId, setCityId] = useState('');
    const [genderId, setGenderId] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [role, setRole] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [status, setStatus] = useState('active');
    const [address, setAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [pincode, setPincode] = useState('');
    const [parentMobile, setParentMobile] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [parentWhatsapp, setParentWhatsapp] = useState('');
    const [trainerPan, setTrainerPan] = useState('');
    const [trainerAadhar, setTrainerAadhar] = useState('');
    const [trainerPanImage, setTrainerPanImage] = useState('');
    const [trainerAadharImage, setTrainerAadharImage] = useState('');
    const [trainerBankName, setTrainerBankName] = useState('');
    const [trainerBankAccountNumber, setTrainerBankAccountNumber] = useState('');
    const [trainerBankIfscCode, setTrainerBankIfscCode] = useState('');
    const [trainerBankBranch, setTrainerBankBranch] = useState('');
    const [educationProof, setEducationProof] = useState(null);
    const [experienceProof, setExperienceProof] = useState(null);

    const [cities, setCities] = useState([]);
    const [genders, setGenders] = useState([]);

    // fetch city 
    const FetchCity = async () => {
        setIsLoading(true);
        try {
            const response = await CityGetAll(1, 1000, "");
            if (response && Array.isArray(response.citys)) {
                // Filter only active categories
                const activeCities = response.citys.filter(cat => cat.status === "active");
                setCities(activeCities);
            } else {
                setAppError(true);
                setAppErrorMessage('No City Found.');
            }
        } catch (error) {
            setAppError(true);
            setAppErrorMessage('Error loading master data');
            setAppErrorMode('Error');
        } finally {
            setIsLoading(false);
        }
    };


    // Fetch gender data from API
    const FetchGender = async () => {
        setIsLoading(true);
        try {
            const response = await GenderGetAll(1, 1000, "");
            if (response && Array.isArray(response.genders)) {
                // Filter only active genders
                const activeGenders = response.genders.filter(gender => gender.status === "active");
                setGenders(activeGenders);
            } else {
                setAppError(true);
                setAppErrorMessage('No Genders Found.');
            }
        } catch (error) {
            setAppError(true);
            setAppErrorMessage('Error loading gender data');
            setAppErrorMode('Error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserById = async () => {
        try {
            setIsLoading(true);
            var response = await GetUserById(id);
            if (response.status === 200) {
                setUser(response.user);
                setName(response.user.username);
                setMobile(response.user.mobile);
                setGenderId(response.user.genderId._id);
                setCityId(response.user.cityId._id);
                setEmail(response.user.email);
                setWhatsapp(response.user.whatsapp);
                setRole(response.user.role);
                setJoiningDate(response.user.joiningDate.substring(0, 10));
                setAddress(response.user.address);
                setLandmark(response.user.landmark);
                setPincode(response.user.pincode);
                setImage(response.user.image);
                setStatus(response.user.status);
                setParentMobile(response.user.parentMobile);
                setParentEmail(response.user.parentEmail);
                setParentWhatsapp(response.user.parentWhatsapp);
                setTrainerPan(response.user.trainerPan);
                setTrainerAadhar(response.user.trainerAadhar);
                setTrainerPanImage(response.user.trainerPanImage);
                setTrainerAadharImage(response.user.trainerAadharImage);
                setTrainerBankName(response.user.trainerBankName);
                setTrainerBankAccountNumber(response.user.trainerBankAccountNumber);
                setTrainerBankIfscCode(response.user.trainerBankIfscCode);
                setTrainerBankBranch(response.user.trainerBankBranch);
                setEducationProof(response.user.educationProof);
                setExperienceProof(response.user.experienceProof);
            }
        } catch (error) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Failed to load data");
            setAppErrorMode("error");
        } finally {
            setIsLoading(false);
        }
    };


    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    const saveUser = async (event) => {
        event.preventDefault();

        if (name.length < 3) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Name must be at least 3 characters");
            setAppErrorMode("error");
            return;
        }

        //mobile is required
        if (!mobile) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Please enter a mobile number");
            setAppErrorMode("error");
            return;
        }

        //genderid is required
        if (!genderId) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Please select a gender");
            setAppErrorMode("error");
            return;
        }

        //email is required
        if (!email) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Please enter an email");
            setAppErrorMode("error");
            return;
        }

        //whatsapp is required
        if (!whatsapp) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Please enter a whatsapp number");
            setAppErrorMode("error");
            return;
        }

        //cityid is required
        if (!cityId) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Please select a city");
            setAppErrorMode("error");
            return;
        }

        //joining date is required
        if (!joiningDate) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Please select a joining date");
            setAppErrorMode("error");
            return;
        }

        //parent mobile is required
        if (role === "student") {
            if (!parentMobile) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please enter parent mobile number");
                setAppErrorMode("error");
                return;
            }
        }

        setIsLoading(true);

        try {
            const response = await Update(id, cityId, genderId, name, email, mobile, whatsapp, image, joiningDate, address, landmark, pincode, status, parentMobile, parentEmail, parentWhatsapp);
            if (response.status === 200) {
                setAppError(true);
                setAppErrorTitle("Action Response");
                setAppErrorMessage(response.message || "User Successfully Added");
                setAppErrorMode("success");
                if (role === "student") {
                    window.location.href = "/user/student/list";
                } else if (role === "trainer") {
                    window.location.href = "/user/trainer/list";
                }
            } else {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage(response.message || "Action failed. Please try again.");
                setAppErrorMode("error");
            }
        } catch (error) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Something went wrong. Please try again.");
            setAppErrorMode("error");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        FetchCity(); // Call function to fetch categories when component mounts
    }, []);

    React.useEffect(() => {
        FetchGender(); // Call function to fetch categories when component mounts
    }, []);

    React.useEffect(() => {
        if (id) {
            fetchUserById();
        }
    }, [id]);

    return (
        <>
            <Helmet>
                <title>Member Manage | {config.appName} </title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        {role === "student" ? (
                            <h1>Edit Student</h1>
                        ) : (
                            <h1>KYC Documents</h1>
                        )}
                        <span>
                            <Link to="/">Dashboard</Link> /{" "}
                            {role === "student" ? (
                                <Link to="/user/student/list">Student List</Link>
                            ) : (
                                <Link to="/user/trainer/list">Trainer List</Link>
                            )}{" "}
                            / Edit Profile
                        </span>

                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <div className='col-12'>
                                        <div className='mb-3'>
                                            {role === "student" ? (
                                                <h5>Student Name : {name} [  Mobile : {mobile} ] </h5>
                                            ) : (
                                                <h5>Trainer Name : {name}  [  Mobile : {mobile} ] </h5>
                                            )}
                                        </div>
                                    </div>
                                    <h4><FontAwesomeIcon icon="fas fa-id-card" /> KYC Details</h4>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">PAN Number</label>
                                                <input className='form-control' type='text' value={trainerPan} readOnly />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">Aadhar Number</label>
                                                <input className='form-control' type='text' value={trainerAadhar} readOnly />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">PAN Image</label><br></br>
                                                {trainerPanImage && (
                                                    <img
                                                        src={`${config.imageBasePath}/pan/${user._id}.${trainerPanImage}`}
                                                        alt="PAN"
                                                        className='img-fluid image-xs'
                                                        style={{ width: '100%', marginTop: '10px', height: '300px' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">Aadhar Image</label>
                                                <br></br>
                                                {trainerAadharImage && (
                                                    <img
                                                        src={`${config.imageBasePath}/aadhar/${user._id}.${trainerAadharImage}`}
                                                        alt="Aadhar"
                                                        className='img-fluid image-xs'
                                                        style={{ width: '100%', marginTop: '10px', height: '300px' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <hr></hr>
                                         <h4><FontAwesomeIcon icon="fas fa-university" /> Bank Details</h4>
                                        <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">Bank Name</label>
                                                <input className='form-control' type='text' value={trainerBankName} readOnly />
                                            </div>
                                        </div>
                                        <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">Bank Account Number</label>
                                                <input className='form-control' type='text' value={trainerBankAccountNumber} readOnly />
                                            </div>
                                        </div>
                                        <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">IFSC Code</label>
                                                <input className='form-control' type='text' value={trainerBankIfscCode} readOnly />
                                            </div>
                                        </div>
                                        <div className='col-lg-3 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">Bank Branch</label>
                                                <input className='form-control' type='text' value={trainerBankBranch} readOnly />
                                            </div>
                                        </div>
                                        <hr></hr>
                                         <h4><FontAwesomeIcon icon="fas fa-graduation-cap" /> Education Details</h4>
                                         <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">Education Proof</label><br></br>
                                                {educationProof && (
                                                    <img
                                                        src={`${config.imageBasePath}/education/${user._id}.${educationProof}`}
                                                        alt="Education"
                                                        className='img-fluid image-xs'
                                                        style={{ width: '100%', marginTop: '10px', height: '300px' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        {experienceProof && (
                                        <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                            <div className="mb-3">
                                                <label className="form-label">Experience Proof</label>
                                                <br></br>
                                                {experienceProof && (
                                                    <img
                                                        src={`${config.imageBasePath}/experience/${user._id}.${experienceProof}`}
                                                        alt="Experience"
                                                        className='img-fluid image-xs'
                                                        style={{ width: '100%', marginTop: '10px', height: '300px' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
