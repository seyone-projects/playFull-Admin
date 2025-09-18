import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { Add } from '../../service/UserService';
import { CityGetAll } from '../../service/CityService';
import { GenderGetAll } from '../../service/GenderService';

export default function UserNew() {
    const {
        isLoading,
        setIsLoading,
        setAppError,
        setAppErrorMessage,
        setAppErrorTitle,
        setAppErrorMode
    } = useGlobalContext();

    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [cityId, setCityId] = useState('');
    const [genderId, setGenderId] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
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

    const [acceptedTerms, setAcceptedTerms] = useState(false);

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


    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    const saveUser = async (event) => {
        event.preventDefault();

        //role is required
        if (!role) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Please select a role");
            setAppErrorMode("error");
            return;
        }

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

        //password is required
        if (!password) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Please enter a password");
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

        if (role === "trainer") {
            if (!trainerPan) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please enter trainer PAN");
                setAppErrorMode("error");
                return;
            }
            if (!trainerAadhar) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please enter trainer Aadhar");
                setAppErrorMode("error");
                return;
            }           
            if (!trainerBankName) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please enter trainer bank name");
                setAppErrorMode("error");
                return;
            }
            if (!trainerBankAccountNumber) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please enter trainer bank account number");
                setAppErrorMode("error");
                return;
            }
            if (!trainerBankIfscCode) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please enter trainer bank IFSC code");
                setAppErrorMode("error");
                return;
            }
            if (!trainerBankBranch) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please enter trainer bank branch");
                setAppErrorMode("error");
                return;
            }
             if (!trainerPanImage) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please upload trainer PAN image");
                setAppErrorMode("error");
                return;
            }
            if (!trainerAadharImage) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please upload trainer Aadhar image");
                setAppErrorMode("error");
                return;
            }
            if (!educationProof) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("Please upload education proof");
                setAppErrorMode("error");
                return;
            }
            if (!acceptedTerms) {
                setAppError(true);
                setAppErrorTitle("Error");
                setAppErrorMessage("You must accept the Terms & Conditions");
                setAppErrorMode("error");
                return;
            }

        }

        setIsLoading(true);

        try {
            const response = await Add(cityId, genderId, name, email, mobile, whatsapp, password, image, role, joiningDate, parentMobile, parentEmail, parentWhatsapp, trainerPan, trainerAadhar, trainerPanImage, trainerAadharImage, trainerBankName, trainerBankAccountNumber, trainerBankIfscCode, trainerBankBranch, educationProof, experienceProof);
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

    return (
        <>
            <Helmet>
                <title>Member Manage | {config.appName} </title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        <h1>Add Member</h1>
                        <span>
                            <Link to="/"> Dashboard </Link> / <Link to="/user/student/list"> Student List </Link> /  <Link to="/user/trainer/list"> Trainer List </Link> / Member Manage
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <form onSubmit={saveUser} encType='multipart/form-data'>
                                        <div className='row'>
                                            <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Role</label>
                                                    <br />
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        value="trainer"
                                                        checked={role === 'trainer'}
                                                        onChange={() => setRole('trainer')}
                                                    /> Trainer &nbsp;&nbsp;
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        value="student"
                                                        checked={role === 'student'}
                                                        onChange={() => setRole('student')}
                                                    /> Student
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Name</label>
                                                    <input className='form-control' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">City</label>
                                                    <select className='form-control' value={cityId} onChange={(e) => setCityId(e.target.value)}>
                                                        <option value="">Select City</option>
                                                        {cities.map(city => (
                                                            <option key={city._id} value={city._id}>
                                                                {city.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Gender</label>
                                                    <br></br>
                                                    {genders.map((gender) => (
                                                        <span key={gender._id}>
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value={gender._id}
                                                                checked={genderId === gender._id}
                                                                onChange={() => setGenderId(gender._id)}
                                                            /> {gender.name} &nbsp;&nbsp;
                                                        </span>
                                                    ))}

                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Joining Date</label>
                                                    <input className='form-control' type='date' value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Image</label>
                                                    <input className='form-control' type='file' onChange={handleFileChange} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Password</label>
                                                    <input className='form-control' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        {role === 'student' ? 'Student Mobile' : 'Trainer Mobile'}
                                                    </label>
                                                    <input
                                                        className='form-control'
                                                        type='number'
                                                        value={mobile}
                                                        onChange={(e) => setMobile(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        {role === 'student' ? 'Student Email' : 'Trainer Email'}
                                                    </label>
                                                    <input
                                                        className='form-control'
                                                        type='email'
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        {role === 'student' ? 'Student WhatsApp' : 'Trainer WhatsApp'}
                                                    </label>
                                                    <input
                                                        className='form-control'
                                                        type='number'
                                                        value={whatsapp}
                                                        onChange={(e) => setWhatsapp(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {role === 'student' && (
                                                <>
                                                    <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Parent Mobile</label>
                                                            <input className='form-control' type='number' value={parentMobile} onChange={(e) => setParentMobile(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Parent Email</label>
                                                            <input className='form-control' type='email' value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Parent WhatsApp</label>
                                                            <input className='form-control' type='number' value={parentWhatsapp} onChange={(e) => setParentWhatsapp(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {role === 'trainer' && (
                                                <>
                                                    <div className='col-lg-4 col-md-6 col-sm-6 col-12'>

                                                        <div className="mb-3">
                                                            <label className="form-label">Trainer PAN</label>
                                                            <input className='form-control' type='text' value={trainerPan} onChange={(e) => setTrainerPan(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Trainer Aadhar</label>
                                                            <input className='form-control' type='text' value={trainerAadhar} onChange={(e) => setTrainerAadhar(e.target.value)} />
                                                        </div>
                                                    </div>                                                    
                                                    <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Trainer Bank Name</label>
                                                            <input className='form-control' type='text' value={trainerBankName} onChange={(e) => setTrainerBankName(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Trainer Bank Account Number</label>
                                                            <input className='form-control' type='text' value={trainerBankAccountNumber} onChange={(e) => setTrainerBankAccountNumber(e.target.value)} />

                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Trainer Bank IFSC Code</label>
                                                            <input className='form-control' type='text' value={trainerBankIfscCode} onChange={(e) => setTrainerBankIfscCode(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Trainer Bank Branch</label>
                                                            <input className='form-control' type='text' value={trainerBankBranch} onChange={(e) => setTrainerBankBranch(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Trainer PAN Image</label>
                                                            <input className='form-control' type='file' onChange={(e) => setTrainerPanImage(e.target.files[0])} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Trainer Aadhar Image</label>
                                                            <input className='form-control' type='file' onChange={(e) => setTrainerAadharImage(e.target.files[0])} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'> 
                                                        <div className="mb-3">
                                                            <label className="form-label">Education Proof</label>
                                                            <input className='form-control' type='file' onChange={(e) => setEducationProof(e.target.files[0])} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                                        <div className="mb-3">
                                                            <label className="form-label">Experience Proof</label>
                                                            <input className='form-control' type='file' onChange={(e) => setExperienceProof(e.target.files[0])} />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                                                        <div className="mb-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={acceptedTerms}
                                                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                            /> I accept the <a href="/terms" target="_blank">Terms & Conditions</a>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <div className='clearfix'></div>
                                            <div className='col-12 text-end'>
                                                <div className="mb-3">
                                                    <button type='reset' className='btn btn-danger btn-md'> <i className="ri-reset-right-line"></i> Reset </button>
                                                    &nbsp;&nbsp;
                                                    {user === null ?
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add Member </button>
                                                        :
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Update Member </button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
