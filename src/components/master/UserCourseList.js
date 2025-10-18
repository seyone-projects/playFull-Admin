import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetUserById } from '../../service/UserService';
import { GetAll } from '../../service/CourseService';
import { Add, GetCoursesByUserId, DeleteByUserIdAndCourseId } from '../../service/UserCourseService';

export default function UserCourseMapping() {
  const {
    isLoading,
    setIsLoading,
    setAppError,
    setAppErrorMessage,
    setAppErrorTitle,
    setAppErrorMode,
  } = useGlobalContext();

  const { id } = useParams();

  const [userDetails, SetUserDetails] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [mappedCourses, setMappedCourses] = useState([]);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetUserById(id);
      SetUserDetails(response.user);
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to fetch user details");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  //  Fetch all active courses
  const fetchAllCourses = async () => {
    try {
      setIsLoading(true);
      const response = await GetAll(1, 9999, '');
      if (response?.courses) {
        const activeCourses = response.courses.filter(course => course.status === 'active');
        setAllCourses(activeCourses);
      } else {
        setAllCourses([]);
      }
    } catch (error) {
      setAppError(true);
      setAppErrorTitle('Error');
      setAppErrorMessage('Failed to fetch courses');
      setAppErrorMode('error');
    } finally {
      setIsLoading(false);
    }
  };

  //mapped courses
  const fetchMappedCourses = async () => {
    try {
      setIsLoading(true);
      const response = await GetCoursesByUserId(id);

      if (response?.success && Array.isArray(response.data)) {
        setMappedCourses(response.data); //response.data is the array of courses
      } else if (response?.data?.courses && Array.isArray(response.data.courses)) {
        setMappedCourses(response.data.courses); //fallback if nested
      } else {
        setMappedCourses([]); //always define as array
      }

    } catch (error) {
      setAppError(true);
      setAppErrorTitle('Error');
      setAppErrorMessage('Failed to fetch mapped courses');
      setAppErrorMode('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchAllCourses();
    fetchMappedCourses();
  }, []);

  //Add User-Course Mapping (fixed)
  const saveUserCourse = async (event) => {
    event.preventDefault();

    if (selectedCourseIds.length === 0) {
      setAppError(true);
      setAppErrorTitle("Validation Error");
      setAppErrorMessage("Please select at least one course to map.");
      setAppErrorMode("warning");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Add(id, selectedCourseIds);

      // backend returns 201 with success: true
      if (response?.status === 200 || response?.status === 201 || response?.success) {
        setAppError(true);
        setAppErrorTitle("Success");
        setAppErrorMessage(response.message || "Courses mapped successfully!");
        setAppErrorMode("success");
        setSelectedCourseIds([]);
        window.location.href = "/user/manage/course/" + id;
      } else {
        setAppError(true);
        setAppErrorTitle("Error");
        setAppErrorMessage(response.message || "Failed to map courses.");
        setAppErrorMode("error");
      }
    } catch (error) {
      console.error(error);
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Something went wrong while mapping courses.");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };


  // Delete mapped course with confirmation
  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course mapping?");
    if (!confirmDelete) return; // user cancelled

    try {
      setIsLoading(true);
      const response = await DeleteByUserIdAndCourseId(id, courseId);

      if (response?.success || response?.status === 200) {
        setAppError(true);
        setAppErrorTitle("Success");
        setAppErrorMessage(response.message || "Course mapping deleted successfully!");
        setAppErrorMode("success");
        fetchMappedCourses(); // refresh the mapped courses
        window.location.href = "/user/manage/course/" + id;
      } else {
        setAppError(true);
        setAppErrorTitle("Error");
        setAppErrorMessage(response.message || "Failed to delete course mapping.");
        setAppErrorMode("error");
      }
    } catch (error) {
      console.error(error);
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Something went wrong while deleting course mapping.");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Trainer Course Mapping | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Trainer Course Mapping</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Trainer Course Mapping
            </span>
          </div>

          <div className='page-content'>
            <div className="portal">
              <div className='portal-body'>
                <div className='batch-details'>
                  <div className='row'>
                    <div className='col-lg-4 col-md-3 col-sm-12'>
                      Trainer Name : <strong>{userDetails?.username || '-'}</strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Mobile : <strong>{userDetails?.mobile || '-'}</strong>
                    </div>
                    <div className='col-lg-5 col-md-6 col-sm-12'>
                      Email : <strong>{userDetails?.email || '-'}</strong>
                    </div>
                  </div>
                </div>

                <br />

                <form onSubmit={saveUserCourse}>
                  <div className='row mb-4'>
                    <div className='col-lg-5 col-md-5 col-sm-12'>
                      <label className="form-label">Select Courses</label>
                      <select
                        multiple
                        required
                        className="form-control"
                        value={selectedCourseIds}
                        onChange={(e) =>
                          setSelectedCourseIds([...e.target.selectedOptions].map(opt => opt.value))
                        }
                      >
                        {allCourses.map(course => (
                          <option key={course._id} value={course._id}>
                            {course.name} ({course.categoryId?.name})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='col-lg-2 col-md-2 col-sm-12 d-flex align-items-end'>
                      <button type='submit' className='btn btn-success-app btn-md'>
                        <i className="ri-check-fill"></i> Map Courses
                      </button>
                    </div>
                  </div>
                </form>

                <div className='table-content'>
                  <div className="mobile-scroll">
                    <table className='table table-bordered table-condensed'>
                      <thead>
                        <tr>
                          <th>Courses</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(mappedCourses) && mappedCourses.length > 0 ? (
                          mappedCourses.map((course) => (
                            <tr key={course._id}>
                              <td>{course.name || '-'}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteCourse(course._id)}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-trash" /> Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center text-muted">
                              No users mapped to courses.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
