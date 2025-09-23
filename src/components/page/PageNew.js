import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { axios } from 'axios';
import { Add, Update, GetById } from '../../service/PageService';

export default function PageNew() {
    const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

    const [page, setPage] = useState(null);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    //create a useState for managing status which can be active or deactive
    const [status, setStatus] = useState('active');

    //read id from useParams
    const { id } = useParams();

    const fetchPageById = async () => {
        try {
            setIsLoading(true);
            var response = await GetById(id);
            if (response.status === 200) {
                setPage(response.page);
                setTitle(response.page.title);
                setImage(response.page.image);
                setDescription(response.page.description);
                setStatus(response.page.status);
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
            fetchPageById();
        }
    }, []);


    const handleFileChange = (event) => {
        setImage(event.target.files[0]); // Set the selected file
        console.log(image);
    };
    //create a function to send the name and image to axios post to save the cateogry
    const savePage = async (event) => {
        event.preventDefault();
        //check whether the name is filled and atleast have 3 chars
        if (title.length < 3) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Title must be at least 3 characters");
            setAppErrorMode("error");
            return;
        }
        //check if the image is uploaded and it is png
        if (!image || image.length < 1) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Image is required");
            setAppErrorMode("error");
            return;
        }
        if (description.length < 3) {
            setAppError(true);
            setAppErrorTitle("Error");
            setAppErrorMessage("Description must be at least 3 characters");
            setAppErrorMode("error");
            return;
        }
        /*
        //check if the image is uploaded and it is png
        if (image.type !== "image/png") {
          setAppError(true);
          setAppErrorTitle("Error");
          setAppErrorMessage("Image must be png");
          setAppErrorMode("error");
          return;
        }
        */

        setIsLoading(true);
        try {
            let response = null;
            if (id === undefined) {
                response = await Add(title, image, description);
            } else {
                response = await Update(id, title, image, description, status);
                console.log("update:", response);
            }

            if (response.status === 200) {
                setAppError(true);
                setAppErrorTitle("Action Response");
                setAppErrorMessage(response.message || (id === undefined ? "Page Successfully Added" : "Page Successfully Updated"));
                setAppErrorMode("success");
                window.location.href = "/page/list";
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
                <title>Page Manage | {config.appName} </title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        {id ?
                            <h1>Edit Page</h1>
                            :
                            <h1>Add Page</h1>
                        }
                        <span>
                            <Link to="/"> Dashboard </Link> / <Link to="/page/list"> Page List </Link> / Page Manage
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <form onSubmit={savePage} encType='multipart/form-data'>
                                        <div className='row'>
                                            <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Title</label>
                                                    <input className='form-control' type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Image
                                                    </label>
                                                    <input className='form-control' type='file' onChange={handleFileChange} />
                                                    {id && typeof image === 'string' && (
                                                        <img
                                                            src={`${config.imageBasePath}/pages/${page._id}.${page.image}`}
                                                            alt={page.name} className='img-fluid image-xs'
                                                            style={{ width: '100px', marginTop: '10px' }} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className='col-lg-12 col-md-12 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Description</label>
                                                    <textarea
                                                        className='form-control'
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        rows={5} // You can adjust the number of rows as needed
                                                    />
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
                                                    {page === null ?
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add Page </button>
                                                        :
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Update Page </button>
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