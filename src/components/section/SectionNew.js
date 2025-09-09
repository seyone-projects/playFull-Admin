import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { axios } from 'axios';
import { Add, Update, GetById } from '../../service/SectionService';

export default function SectionNew() {
    const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

    const [section, setSection] = useState(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    //create a useState for managing status which can be active or deactive
    const [status, setStatus] = useState('active');
    //read id from useParams
    const { id } = useParams();

    const fetchSectionById = async () => {
        try {
            setIsLoading(true);
            var response = await GetById(id);
            if (response.status === 200) {
                setSection(response.section);
                setName(response.section.name);
                setImage(response.section.image);
                setStatus(response.section.status);
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
        if (id != null && id != undefined && id != "") {
            fetchSectionById();
        }
    }, []);


    const handleFileChange = (event) => {
        setImage(event.target.files[0]); // Set the selected file
        console.log(image);
    };
    //create a function to send the name and image to axios post to save the cateogry
    const saveSection = async (event) => {
        event.preventDefault();
        //check whether the name is filled and atleast have 3 chars
        if (name.length < 3) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Name must be at least 3 characters");
            setAppErrorMode("error");
            return;
        }

        setIsLoading(true);

        try {
            let response = null;

            if (id === undefined) {
                response = await Add(name, image);
            } else {
                response = await Update(id, name, image, status);
                console.log("update:", response);
            }

            if (response.status === 200) {
                setAppError(true);
                setAppErrorTitle("Action Response");
                setAppErrorMessage(response.message || (id === undefined ? "Section Successfully Added" : "Section Successfully Updated"));
                setAppErrorMode("success");
                window.location.href = "/section/list";
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
                <title>Section Manage | {config.appName} </title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        {id ?
                            <h1>Edit Section</h1>
                            :
                            <h1>Add Section</h1>
                        }
                        <span>
                            <Link to="/"> Dashboard </Link> / <Link to="/section/list"> Section List </Link> / Section Manage
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <form onSubmit={saveSection} encType='multipart/form-data'>
                                        <div className='row'>
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
                                                            src={`${config.imageBasePath}/sections/${section._id}.${section.image}`}
                                                            alt={section.name} className='img-fluid image-xs'
                                                            style={{ width: '100px', marginTop: '10px' }} />
                                                    )}
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
                                                    {section === null ?
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add Section </button>
                                                        :
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Update Section </button>
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