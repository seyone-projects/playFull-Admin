import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetUsersByBatchId, UpdateUsers, DeleteUser, GetById } from '../../service/BatchService';
import { GetUsersByRole } from '../../service/UserService';
import { GetByBatchId } from '../../service/FeeSchemeService';
import { Add, GetByBatchId as GetByBatchIdBatchStudent, DeleteStudent } from '../../service/BatchStudentService';


export default function BatchStudentList() {
  const {
    isLoading,
    setIsLoading,
    isAppError,
    setAppError,
    appErrorMessage,
    setAppErrorMessage,
    appErrorTitle,
    setAppErrorTitle,
    appErrorMode,
    setAppErrorMode,
    appUser,
  } = useGlobalContext();

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const { id } = useParams();

  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [feeSchemes, setFeeSchemes] = useState([]);
  const [feeSchemeId, setFeeSchemeId] = useState('');

  const [batchDetails, setBatchDetails] = useState({});

  const [batchStudents, setBatchStudents] = useState([]);

  const fetchBatchDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetById(id);
      console.log("Batch Details:", response);
      if (response?.batch) {
        setBatchDetails(response.batch);
      } else {
        setBatchDetails({});
      }
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to fetch batch details");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBatchStudentList = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await GetByBatchIdBatchStudent(id, page, itemsPerPage);
      setBatchStudents(response.batchStudents);
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

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await GetUsersByRole("student", 1, 9999);
      if (response?.users) {
        // Filter only active users
        const activeUsers = response.users.filter(user => user.status === "active");
        setAllUsers(activeUsers);
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to fetch users");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };

  // fetch feeScheme 
  const fetchFeeScheme = async () => {
    setIsLoading(true);
    try {
      const response = await GetByBatchId(id, 1, 1000);
      if (response && Array.isArray(response.feeSchemes)) {
        // Filter only active feeScheme
        const activeFeeSchemes = response.feeSchemes.filter(cat => cat.status === "active");
        setFeeSchemes(activeFeeSchemes);
      } else {
        setAppError(true);
        setAppErrorMessage('No FeeScheme Found.');
      }
    } catch (error) {
      setAppError(true);
      setAppErrorMessage('Error loading master data');
      setAppErrorMode('Error');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchBatchStudentList(currentPage);
  }, []);

  useEffect(() => {
    fetchAllUsers();
    fetchBatchDetails();
    fetchFeeScheme();
  }, []);


  const saveBatchStudent = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // First update users
      let response = await UpdateUsers(id, selectedUserIds);
      console.log("UpdateUsers response:", response);

      if (response.status === 200) {
        let addResponse;
        if (batchDetails?.fee > 0 && feeSchemes.length > 0 && feeSchemeId) {
          addResponse = await Add(id, selectedUserIds, feeSchemeId);
          setAppError(true);
          setAppErrorTitle("Action Response");
          setAppErrorMessage(
            addResponse.message || "Student(s) Successfully Added with Payments"
          );
          setAppErrorMode("success");
        } else {
          addResponse = await Add(id, selectedUserIds, null);
          setAppError(true);
          setAppErrorTitle("Action Response");
          setAppErrorMessage(
            addResponse.message || "Student(s) Successfully Added with Payments"
          );
          setAppErrorMode("success");
        }

        // refresh page after success
        window.location.href = "/batch-student/manage/" + id;
      } else {
        setAppError(true);
        setAppErrorTitle("Error");
        setAppErrorMessage(
          response.message || "Action failed. Please try again."
        );
        setAppErrorMode("error");
      }
    } catch (error) {
      console.log(error);
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Something went wrong. Please try again.");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to remove this student?");
    if (confirmed) {
      const result = await DeleteStudent(id, userId);
      if (result.status === 200) {
        setAppError(true);
        setAppErrorTitle("Success");
        setAppErrorMessage(result.message || "Student removed successfully");
        setAppErrorMode("success");
        window.location.href = "/batch-student/manage/" + id;
      } else {
        setAppError(true);
        setAppErrorTitle("Error");
        setAppErrorMessage(result.message || "Failed to delete student");
        setAppErrorMode("error");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Batch Student List | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Batch Student List</h1>
            <span>
              <Link to="/"> Dashboard </Link> / <Link to="/batch/list"> Batch List </Link> / Batch Student List
            </span>
          </div>

          <div className='page-content'>
            <div className="portal">
              <div className='portal-body'>
                <div className='batch-details'>
                  <div className='row'>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Category : <strong>{batchDetails?.courseId?.categoryId?.name || '-'}</strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Sub Category : <strong> {batchDetails?.courseId?.subCategoryIds
                        ?.map(sub => sub.name)
                        .join(", ")}</strong>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      Course : <strong>{batchDetails?.courseId?.name || '-'}</strong>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className='batch-details'>
                  <div className='row mb-3'>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Batch Code : <strong>{batchDetails?.code || '-'}</strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Start Date : <strong>
                        {batchDetails?.startDate
                          ? (() => {
                            const date = new Date(batchDetails.startDate);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()
                          : '-'}
                      </strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Fee : <strong>{batchDetails?.fee}</strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Certificate : <strong>
                        {batchDetails?.certificate === true
                          ? "Yes"
                          : batchDetails?.certificate === false
                            ? "No"
                            : "-"}
                      </strong>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      Batch Name : <strong>{batchDetails?.name || '-'}</strong>
                    </div>
                  </div>
                </div>
                <br></br>
                <form onSubmit={saveBatchStudent}>
                  <div className='row mb-4'>
                    <div className='col-lg-5 col-md-5 col-sm-12'>
                      <label className="form-label">Select Students</label>
                      <select
                        multiple
                        required
                        className="form-control"
                        value={selectedUserIds}
                        onChange={(e) =>
                          setSelectedUserIds([...e.target.selectedOptions].map(opt => opt.value))
                        }
                      >
                        {allUsers.map(user => (
                          <option key={user._id} value={user._id}>
                            {user.username} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    {batchDetails?.fee > 0 && (
                      <div className="form-group col-md-4">
                        <label>Fee Scheme</label>
                        <select
                          className="form-control"
                          required
                          value={feeSchemeId}
                          onChange={(e) => setFeeSchemeId(e.target.value)}
                        >
                          <option value="">-- Select Fee Scheme --</option>
                          {feeSchemes.map((scheme) => (
                            <option key={scheme._id} value={scheme._id}>
                              {scheme.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className='col-lg-2 col-md-2 col-sm-12 d-flex align-items-end'>
                      <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Add Student </button>
                    </div>
                  </div>
                </form>

                <div className='table-content'>
                  <div className="mobile-scroll">
                    <table className='table table-bordered table-condensed'>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Joining Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchStudents && batchStudents.length > 0 ? (
                          batchStudents.map((batchStudent) => (
                            <tr key={batchStudent.userId._id}>
                              <td>
                                <img
                                  src={`${config.imageBasePath}/users/${batchStudent.userId._id}.${batchStudent.userId.image || 'jpg'}`}
                                  alt={batchStudent.userId.username}
                                  className='img-fluid image-xs'
                                />
                              </td>
                              <td>{batchStudent.userId.username}</td>
                              <td>{batchStudent.userId.email}</td>
                              <td>{batchStudent.userId.mobile}</td>
                              <td>
                                {batchStudent.userId.joiningDate
                                  ? (() => {
                                    const date = new Date(batchStudent.userId.joiningDate);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    return `${day}-${month}-${year}`;
                                  })()
                                  : ''}
                              </td>
                              <td>{batchStudent.userId.status}</td>
                              <td> <button
                                className='btn btn-sm btn-danger'
                                onClick={() => handleDeleteUser(batchStudent.userId._id)}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-trash" /> Delete
                              </button>
                                {batchDetails?.fee > 0 && (
                                  <>
                                    &nbsp;&nbsp;
                                    <Link to={`/batch-student-fee/manage/${batchStudent.userId._id}/${id}/${batchStudent._id}`} className='btn btn-sm btn-success'>
                                      <FontAwesomeIcon icon="fa-solid fa-wallet" /> Fees
                                    </Link>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No students mapped in this batch.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalItems > 10 && (
                    <div className="pagination mt-3 d-flex justify-content-center">
                      <span className="align-self-center me-3">
                        {currentPage > 1 && (
                          <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => fetchBatchStudentList(currentPage - 1)}
                          >
                            Previous
                          </button>
                        )}
                        Page {currentPage} of {totalPages}
                        {currentPage < totalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => fetchBatchStudentList(currentPage + 1)}
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
  );
}