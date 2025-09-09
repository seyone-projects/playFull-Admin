import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Add, Update, GetById } from '../../service/SubCategoryService';
import { GetAll } from '../../service/CategoryService';

export default function SubCategoryNew() {
    const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

    const [subCategory, setSubCategory] = useState(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState('active');
    const { id } = useParams();

    const [categoryId, setCategoryId] = useState('');
    const [categorys, setCategorys] = useState([]);

    const FetchCategory = async () => {
        setIsLoading(true);
        try {
            const response = await GetAll(1, 1000, "");
            if (response && Array.isArray(response.categories)) {
                const activeCategories = response.categories.filter(cat => cat.status === "active");
                setCategorys(activeCategories);
            } else {
                setAppError(true);
                setAppErrorMessage('No Category Found.');
            }
        } catch (error) {
            setAppError(true);
            setAppErrorMessage('Error loading master data');
            setAppErrorMode('Error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSubCategoryById = async () => {
        try {
            setIsLoading(true);
            var response = await GetById(id);
            if (response.status === 200) {
                setSubCategory(response.subCategory);
                setName(response.subCategory.name);
                setImage(response.subCategory.image);
                setStatus(response.subCategory.status);
                setCategoryId(response.subCategory.categoryId);
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
        FetchCategory();
    }, []);

    React.useEffect(() => {
        if (id != null && id != undefined && id != "") {
            fetchSubCategoryById();
        }
    }, []);

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
        console.log(image);
    };

    const saveSubCategory = async (event) => {
        event.preventDefault();

        if (!categoryId) {
            setAppError(true);
            setAppErrorMessage("Please select your Category.");
            setAppErrorTitle("Validation Error");
            setAppErrorMode("error");
            setIsLoading(false);
            return;
        }

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
                response = await Add(categoryId, name, image);
            } else {
                response = await Update(id, categoryId, name, image, status);
                console.log("update:", response);
            }

            if (response.status === 200) {
                setAppError(true);
                setAppErrorTitle("Action Response");
                setAppErrorMessage(response.message || (id === undefined ? "Sub Category Successfully Added" : "Sub Category Successfully Updated"));
                setAppErrorMode("success");
                window.location.href = "/sub-category/list";
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
                <title>Sub Category Manage | {config.appName} </title>
            </Helmet>
            <div className='container'>
                <div className='page'>
                    <div className='page-heading'>
                        {id ?
                            <h1>Edit Sub Category</h1>
                            :
                            <h1>Add Sub Category</h1>
                        }
                        <span>
                            <Link to="/"> Dashboard </Link> / <Link to="/sub-category/list"> Sub Category List </Link> / Sub Category Manage
                        </span>
                    </div>
                    <div className='page-content'>
                        <div className="portal">
                            <div className='portal-body'>
                                <div className='form'>
                                    <form onSubmit={saveSubCategory} encType='multipart/form-data'>
                                        <div className='row'>
                                            <div className='col-lg-4 col-md-6 col-sm-6 col-12'>
                                                <div className="mb-3">
                                                    <label className="form-label">Category</label>
                                                    <select
                                                        className="form-control"
                                                        value={categoryId}
                                                        onChange={(e) => setCategoryId(e.target.value)}
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categorys.map(categoryOption => (
                                                            <option key={categoryOption._id} value={categoryOption._id}>
                                                                {categoryOption.name}
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
                                                            src={`${config.imageBasePath}/subCategorys/${subCategory._id}.${subCategory.image}`}
                                                            alt={subCategory.name} className='img-fluid image-xs'
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
                                                    {subCategory === null ?
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add Sub Category </button>
                                                        :
                                                        <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Update Sub Category </button>
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
