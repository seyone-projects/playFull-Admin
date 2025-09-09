import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { axios } from 'axios';
import { Add, Update, GetById } from '../../service/CategoryService';
import { GetAllSection } from '../../service/SectionService';

export default function CategoryNew() {
    const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

    const [category, setCategory] = useState(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    //create a useState for managing status which can be active or deactive
    const [status, setStatus] = useState('active');
    //read id from useParams
    const { id } = useParams();

    // section
    const [sectionId, setSectionId] = useState('');
    const [sections, setSections] = useState([]);

    // fetch section 
    const FetchSection = async () => {
        setIsLoading(true);
        try {
            const response = await GetAllSection(1, 1000, "");
            if (response && Array.isArray(response.sections)) {
                // Filter only active categories
                const activeCategories = response.sections.filter(cat => cat.status === "active");
                setSections(activeCategories);
            } else {
                setAppError(true);
                setAppErrorMessage('No Section Found.');
            }
        } catch (error) {
            setAppError(true);
            setAppErrorMessage('Error loading master data');
            setAppErrorMode('Error');
        } finally {
            setIsLoading(false);
        }
    };


    // fetch sub section
    const fetchCategoryById = async () => {
        try {
            setIsLoading(true);
            var response = await GetById(id);
            if (response.status === 200) {
                setCategory(response.category);
                setName(response.category.name);
                setImage(response.category.image);
                setStatus(response.category.status);
                setSectionId(response.category.sectionId); // Set the section ID here
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
        FetchSection(); // Call function to fetch categories when component mounts
    }, []);

    React.useEffect(() => {
        if (id != null && id != undefined && id != "") {
            fetchCategoryById();
        }
    }, []);


    const handleFileChange = (event) => {
        setImage(event.target.files[0]); // Set the selected file
        console.log(image);
    };
    //create a function to send the name and image to axios post to save the cateogry
    const saveCategory = async (event) => {
        event.preventDefault();

        if (!sectionId) {
            setAppError(true);
            setAppErrorMessage("Please select your Section.");
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


        setIsLoading(true);

        try {
            let response = null;

            if (id === undefined) {
                response = await Add(sectionId, name, image);
            } else {
                response = await Update(id, sectionId, name, image, status);
                console.log("update:", response);
            }

            if (response.status === 200) {
                setAppError(true);
                setAppErrorTitle("Action Response");
                setAppErrorMessage(response.message || (id === undefined ? "Category Successfully Added" : "Category Successfully Updated"));
                setAppErrorMode("success");
                window.location.href = "/category/list";
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
                <title>Category Manage | {config.appName} </title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        {id ?
                            <h1>Edit Category</h1>
                            :
                            <h1>Add Category</h1>
                        }
                        <span>
                            <Link to="/"> Dashboard </Link> / <Link to="/category/list"> Category List </Link> / Category Manage
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <form onSubmit={saveCategory} encType='multipart/form-data'>
                                        <div className='row'>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Section</label>
                                                    <select
                                                        className="form-control"
                                                        value={sectionId} // Ensure this state is defined
                                                        onChange={(e) => setSectionId(e.target.value)} // Update correctly
                                                    >
                                                        <option value="">Select Section</option>
                                                        {sections.map(sectionOption => (
                                                            <option key={sectionOption._id} value={sectionOption._id}>
                                                                {sectionOption.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Name</label>
                                                    <input className='form-control' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Image
                                                    </label>
                                                    <input className='form-control' type='file' onChange={handleFileChange} />
                                                    {id && typeof image === 'string' && (
                                                        <img
                                                            src={`${config.imageBasePath}/categorys/${category._id}.${category.image}`}
                                                            alt={category.name} className='img-fluid image-xs'
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
                                                    {category === null ?
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add Category </button>
                                                        :
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Update Category </button>
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