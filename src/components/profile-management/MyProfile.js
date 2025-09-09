import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
import { Update, GetUserById } from '../../service/UserService';
import { CityGetAll } from '../../service/CityService';
import { GenderGetAll } from '../../service/GenderService';

export default function UserNew() {
    const {
        isLoading,
        setIsLoading,
        setAppError,
        setAppErrorMessage,
        setAppErrorTitle,
        setAppErrorMode,
        appUser,
    } = useGlobalContext();

    const id = appUser?._id
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

        setIsLoading(true);

        try {
            const response = await Update(id, cityId, genderId, name, email, mobile, whatsapp, image, joiningDate, address, landmark, pincode, status);
            if (response.status === 200) {
                setAppError(true);
                setAppErrorTitle("Action Response");
                setAppErrorMessage(response.message || "User Successfully Added");
                setAppErrorMode("success");
                if (role === "admin") {
                    window.location.href = "/myprofile";
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
                <title>My Profile Manage | {config.appName} </title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        {role === "admin" ? (
                            <h1>My Profile</h1>
                        ) : (
                            <h1>{role === "student" ? "Student Profile" : "Trainer Profile"}</h1>
                        )}
                        <span>
                            <Link to="/">Dashboard </Link>
                            / Update Profile
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <form onSubmit={saveUser} encType='multipart/form-data'>
                                        <div className='row'>
                                            <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Name</label>
                                                    <input className='form-control' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Mobile</label>
                                                    <input className='form-control' type='number' value={mobile} onChange={(e) => setMobile(e.target.value)} />
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
                                                                checked={genderId.toString() === gender._id.toString()}
                                                                onChange={() => setGenderId(gender._id)}
                                                            /> {gender.name} &nbsp;&nbsp;
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Email</label>
                                                    <input className='form-control' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">WhatsApp</label>
                                                    <input className='form-control' type='number' value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">City</label>
                                                    <select
                                                        className="form-control"
                                                        value={cityId.toString()}
                                                        onChange={(e) => setCityId(e.target.value)}
                                                    >
                                                        <option value="">Select City</option>
                                                        {cities.map(cityOption => (
                                                            <option key={cityOption._id} value={cityOption._id.toString()}>
                                                                {cityOption.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Joining Date</label>
                                                    <input className='form-control' type='date' value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-7 col-md-7 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Image</label>
                                                    <input className='form-control' type='file' onChange={handleFileChange} />
                                                </div>
                                            </div>
                                            <div className='col-lg-1 col-md-1 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    {id && typeof image === 'string' && (
                                                        <img
                                                            src={`${config.imageBasePath}/users/${user._id}.${user.image}`}
                                                            alt={user.name} className='img-fluid image-xs'
                                                            style={{ width: '100px', marginTop: '10px' }} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className='col-lg-8 col-md-8 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Address</label>
                                                    <input className='form-control' type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Landmark</label>
                                                    <input className='form-control' type='text' value={landmark} onChange={(e) => setLandmark(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Pincode</label>
                                                    <input className='form-control' type='number' value={pincode} onChange={(e) => setPincode(e.target.value)} />
                                                </div>
                                            </div>
                                            {id && (
                                                <div className='col-lg-3 col-md-3 col-sm-6 col-12 d-none'>
                                                    <div className="mb-3">
                                                        <label className="form-label">Status</label>
                                                        <br></br>
                                                        <input type='radio' name='status' value="active" onChange={(e) => setStatus(e.target.value)} checked={status === 'active'} /> Active &nbsp;&nbsp;
                                                        <input type='radio' name='status' value="inactive" onChange={(e) => setStatus(e.target.value)} checked={status === 'inactive'} /> Deactive
                                                    </div>
                                                </div>
                                            )}
                                            <div className='clearfix'></div>
                                            <div className='col-12 text-end'>
                                                <div className="mb-3">
                                                    <button type='reset' className='btn btn-danger btn-md'> <i className="ri-reset-right-line"></i> Reset </button>
                                                    &nbsp;&nbsp;
                                                    {user === null ?
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add User </button>
                                                        :
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Update Profile </button>
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
