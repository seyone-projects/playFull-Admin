import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { axios } from 'axios';
import { Add, Update, GetById } from '../../service/BatchService';
import { GetAll } from '../../service/CourseService';
import { GetUsersByRole } from '../../service/UserService';

export default function BatchNew() {
    const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

    const [batch, setBatch] = useState(null);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [fee, setFee] = useState('');
    const [certificate, setCertificate] = useState('0'); // Default "No"
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState('active');

    // Trainer
    const [trainerId, setUserId] = useState('');
    const [trainers, setUsers] = useState([]);
    const [trainerCost, setTrainerCost] = useState('');
    const [trainerTds, setTrainerTds] = useState('');

    // Course
    const [courseId, setCourseId] = useState('');
    const [courses, setCourses] = useState([]);

    //read id from useParams
    const { id } = useParams();

    // fetch trainer 
    const FetchUser = async () => {
        setIsLoading(true);
        try {
            const response = await GetUsersByRole("trainer", 1, 9999);
            console.log(response);
            if (response && Array.isArray(response.users)) {
                // Filter only active categories
                const activeUsers = response.users.filter(cat => cat.status === "active");
                setUsers(activeUsers);
            } else {
                setAppError(true);
                setAppErrorMessage('No User Found.');
            }
        } catch (error) {
            setAppError(true);
            setAppErrorMessage('Error loading master data');
            setAppErrorMode('Error');
        } finally {
            setIsLoading(false);
        }
    };


    // fetch courses
    const FetchCourses = async () => {
        setIsLoading(true);
        try {
            const response = await GetAll(1, 9999, "");
            if (response && Array.isArray(response.courses)) {
                // Filter only active courses
                const activeCourses = response.courses.filter(course => course.status === "active");
                setCourses(activeCourses);
            } else {
                setAppError(true);
                setAppErrorMessage('No Courses Found.');
            }
        } catch (error) {
            setAppError(true);
            setAppErrorMessage('Error loading course data');
            setAppErrorMode('Error');
        } finally {
            setIsLoading(false);
        }
    };


    // fetch batch by id
    const fetchBatchById = async () => {
        try {
            setIsLoading(true);
            var response = await GetById(id);
            if (response.status === 200) {
                setBatch(response.batch);
                setName(response.batch.name);
                setCode(response.batch.code);
                setStartDate(response.batch.startDate.substring(0, 10));
                setFee(response.batch.fee);
                setCertificate(response.batch.certificate?.toString() || '0');
                setDescription(response.batch.description || '');
                setImage(response.batch.image);
                setStatus(response.batch.status);
                setUserId(response.batch.trainerId._id);
                setCourseId(response.batch.courseId._id);
                setTrainerCost(response.batch.trainerCost || '0');
                setTrainerTds(response.batch.trainerTds || '0');
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

    React.useEffect(() => {
        FetchUser(); // Call function to fetch categories when component mounts
    }, []);

    React.useEffect(() => {
        FetchCourses(); // Call function to fetch categories when component mounts
    }, []);

    React.useEffect(() => {
        if (id != null && id != undefined && id != "") {
            fetchBatchById();
        }
    }, []);


    const handleFileChange = (event) => {
        setImage(event.target.files[0]); // Set the selected file
        console.log(image);
    };
    //create a function to send the name and image to axios post to save the cateogry
    const saveBatch = async (event) => {
        event.preventDefault();

        if (!trainerId) {
            setAppError(true);
            setAppErrorMessage("Please select trainer.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        //check whether the name is filled and atleast have 3 chars
        if (name.length < 3) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Name must be at least 3 characters");
            setAppErrorMode("error");
            return;
        }

        //courseId is required
        if (!courseId) {
            setAppError(true);
            setAppErrorMessage("Please select course.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            let response = null;

            if (id === undefined) {
                response = await Add(trainerId, code, name, startDate, fee, certificate, description, image, courseId, trainerCost, trainerTds);
            } else {
                response = await Update(id, trainerId, code, name, startDate, fee, certificate, description, image, status, courseId, trainerCost, trainerTds);
                console.log("update:", response);
            }

            if (response.status === 200) {
                setAppError(true);
                setAppErrorTitle("Action Response");
                setAppErrorMessage(response.message || (id === undefined ? "Batch Successfully Added" : "Batch Successfully Updated"));
                setAppErrorMode("success");
                window.location.href = "/batch/list";
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

    return (
        <>
            <Helmet>
                <title>Batch Manage | {config.appName} </title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        {id ?
                            <h1>Edit Batch</h1>
                            :
                            <h1>Add Batch</h1>
                        }
                        <span>
                            <Link to="/"> Dashboard </Link> / <Link to="/batch/list"> Batch List </Link> / Batch Manage
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <form onSubmit={saveBatch} encType='multipart/form-data'>
                                        <div className='row'>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Course</label>
                                                    <select
                                                        className="form-control"
                                                        value={courseId} // Ensure this state is defined
                                                        onChange={(e) => setCourseId(e.target.value)} // Update correctly
                                                    >
                                                        <option value="">Select Course</option>
                                                        {courses.map(courseOption => (
                                                            <option key={courseOption._id} value={courseOption._id}>
                                                                {courseOption.categoryId.name}{" "}
                                                                {courseOption.subCategoryIds.map(sub => sub.name).join(", ")}{" "}
                                                                {courseOption.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Trainer</label>
                                                    <select
                                                        className="form-control"
                                                        value={trainerId} // Ensure this state is defined
                                                        onChange={(e) => setUserId(e.target.value)} // Update correctly
                                                    >
                                                        <option value="">Select Trainer</option>
                                                        {trainers.map(trainerOption => (
                                                            <option key={trainerOption._id} value={trainerOption._id}>
                                                                {trainerOption.username}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Code</label>
                                                    <input className='form-control' type='text' value={code} onChange={(e) => setCode(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Name</label>
                                                    <input className='form-control' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Image
                                                    </label>
                                                    <input className='form-control' type='file' onChange={handleFileChange} />
                                                    {id && typeof image === 'string' && (
                                                        <img
                                                            src={`${config.imageBasePath}/batches/${batch._id}.${batch.image}`}
                                                            alt={batch.name} className='img-fluid image-xs'
                                                            style={{ width: '100px', marginTop: '10px' }} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Start Date</label>
                                                    <input className='form-control' type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Fee</label>
                                                    <input className='form-control' type='number' value={fee} onChange={(e) => setFee(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Certificate</label>
                                                    <br />
                                                    <input
                                                        type="radio"
                                                        name="certificate"
                                                        value="true"
                                                        checked={certificate === 'true'}
                                                        onChange={() => setCertificate('true')}
                                                    /> Yes &nbsp;&nbsp;
                                                    <input
                                                        type="radio"
                                                        name="certificate"
                                                        value="false"
                                                        checked={certificate === 'false'}
                                                        onChange={() => setCertificate('false')}
                                                    /> No
                                                </div>
                                            </div>
                                            <div className='col-lg-12 col-md-6 col-sm-12 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Description</label>
                                                    <textarea
                                                        className='form-control'
                                                        rows="4"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Trainer Cost</label>
                                                    <input className='form-control' type='number' value={trainerCost} onChange={(e) => setTrainerCost(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Trainer TDS</label>
                                                    <input className='form-control' type='number' value={trainerTds} onChange={(e) => setTrainerTds(e.target.value)} />
                                                </div>
                                            </div>

                                            {id && (
                                                <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
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
                                                    {batch === null ?
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add Batch </button>
                                                        :
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Update Batch </button>
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
    )
}