import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetAll, TogglePublish } from '../../service/CourseService';

export default function CourseList() {

  const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

  const [courses, setCourses] = useState();
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchCourseList = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetAll(page, itemsPerPage, keyword);
      setCourses(response.courses);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
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
    fetchCourseList(currentPage);
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      setIsLoading(true);
      const res = await TogglePublish(id);
      if (res.status === 200) {
        // Refresh the list after successful toggle
        fetchCourseList(currentPage);
      } else {
        setAppError(true);
        setAppErrorTitle("Error");
        setAppErrorMessage(res.message || "Failed to update publish status");
        setAppErrorMode("error");
      }
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to update publish status");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Course List | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Course List</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Course List
            </span>
          </div>
          <div className='page-content'>
            <div className="portal">
              <div className='portal-body'>
                <form>
                  <div className='row'>
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Keyword</label>
                        <div className="input-group mb-3">
                          <input type="text" className="form-control" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                          <button className="btn btn-outline-secondary" type="button" id="button-addon1">
                            <FontAwesomeIcon icon="fa-solid fa-search" onClick={() => fetchCourseList(1)} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-sm-6 col-12'>
                      <div className="p-2">
                        <div className="input-group p-4">
                          <Link className="btn btn-success" to="/course/manage"> <FontAwesomeIcon icon="fa-solid fa-plus" ></FontAwesomeIcon> Add Course </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div className='table-content'>
                  <div className="mobile-scroll">
                  <table className='table table-bordered table-condensed'>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Sub Categories</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Publish</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* iterate the subCourses and display in table */}
                      {courses && courses.map((course) => (
                        <tr key={course._id}>
                          <td>
                            <img
                              src={`${config.imageBasePath}/courses/${course._id}.${course.image}`}
                              alt={course.name} className='img-fluid image-xs'
                            />
                          </td>
                          <td>{course.categoryId?.name || "N/A"}</td>
                          <td>
                            {Array.isArray(course.subCategoryIds) && course.subCategoryIds.length > 0
                              ? course.subCategoryIds.map((sub, index) => (
                                <span key={sub._id}>
                                  {sub.name}{index < course.subCategoryIds.length - 1 ? ', ' : ''}
                                </span>
                              ))
                              : "N/A"}
                          </td>

                          <td>{course.name}</td>
                          <td>{course.status}</td>
                          <td>
                            <button
                              className={`btn btn-sm ${course.isPublished ? 'btn-success' : 'btn-secondary'}`}
                              onClick={() => handleTogglePublish(course._id)}
                            >
                              {course.isPublished ? 'Published' : 'Unpublished'}
                            </button>
                          </td>
                          <td>
                            <Link to={`/course/manage/${course._id}`} className='btn btn-sm btn-primary'>
                              <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                  {totalItems > 10 && (
                    <div className="pagination mt-3 d-flex justify-content-center">
                      <span className="align-self-center me-3">
                        {currentPage > 1 && (
                          <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => fetchCourseList(currentPage - 1)}
                          >
                            Previous
                          </button>
                        )}

                        Page {currentPage} of {totalPages}

                        {currentPage < totalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => fetchCourseList(currentPage + 1)}
                          >
                            Next
                          </button>
                        )}
                      </span>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
