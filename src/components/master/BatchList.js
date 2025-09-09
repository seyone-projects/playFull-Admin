import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetAll } from '../../service/BatchService';

export default function BatchList() {

  const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

  const [batchs, setBatchs] = useState();
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchBatchList = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetAll(page, itemsPerPage, keyword);
      setBatchs(response.batchs);
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
    fetchBatchList(currentPage);
  }, []);

  return (
    <>
      <Helmet>
        <title>Batch List | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Batch List</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Batch List
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
                            <FontAwesomeIcon icon="fa-solid fa-search" onClick={() => fetchBatchList(1)} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="p-2">
                        <div className="input-group p-4">
                          <Link className="btn btn-success" to="/batch/manage"> <FontAwesomeIcon icon="fa-solid fa-plus" ></FontAwesomeIcon> Add Batch </Link>
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
                          <th>Trainer</th>
                          <th>Name</th>
                          <th>Code</th>
                          <th>Start Date</th>
                          <th>Fee (Rs.)</th>
                          <th>Certificate</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* iterate the batchs and display in table */}
                        {batchs && batchs.map((batch) => (
                          <tr key={batch._id}>
                            <td>
                              {/* <img src={config.apiUrl + "uploads/batchs/" + batch._id + "." + batch.image} alt={batch.name} className='img-fluid image-xs' /> */}
                              <img
                                src={`${config.imageBasePath}/batches/${batch._id}.${batch.image}`}
                                alt={batch.name} className='img-fluid image-xs'
                              />
                            </td>
                            <td>{batch.trainerId?.username || "N/A"}</td>
                            <td>{batch.name}</td>
                            <td>{batch.code}</td>
                            <td>
                              {batch.startDate
                                ? (() => {
                                  const date = new Date(batch.startDate);
                                  const day = String(date.getDate()).padStart(2, '0');
                                  const month = String(date.getMonth() + 1).padStart(2, '0');
                                  const year = date.getFullYear();
                                  return `${day}-${month}-${year}`;
                                })()
                                : ''}
                            </td>
                            <td>{batch.fee}</td>
                            <td>{batch.certificate ? 'Yes' : 'No'}</td>
                            <td>{batch.status}</td>
                            <td>
                              <Link to={`/batch/manage/${batch._id}`} className='btn btn-sm btn-primary'>
                                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                              </Link>&nbsp;
                              <Link to={`/batch-student/manage/${batch._id}`} className='btn btn-sm btn-warning'>
                                <FontAwesomeIcon icon="fa-solid fa-user-plus" /> Add Students
                              </Link>
                              <br></br>
                              <Link to={`/batch-lesson-planner/manage/${batch._id}`} className='btn btn-sm btn-success' style={{ marginTop: '5px' }}>
                                <FontAwesomeIcon icon="fa-solid fa-book" /> Lesson Planner
                              </Link>{batch?.fee > 0 && (
                                <><br></br>
                                  <Link to={`/batch/summary/manage/${batch.trainerId._id}/${batch._id}`} className='btn btn-sm btn-dark' style={{ marginTop: '5px' }}>
                                    <FontAwesomeIcon icon="fa-solid fa-coins" /> Fee Summary
                                  </Link>&nbsp;
                                  <Link to={`/batch-fee-scheme/manage/${batch._id}`} className='btn btn-sm btn-danger' style={{ marginTop: '5px' }}>
                                    <FontAwesomeIcon icon="fa-solid fa-wallet" /> Fee Scheme
                                  </Link>
                                   <Link to={`/batch/overview/manage/${batch._id}`} className='btn btn-sm btn-info' style={{ marginTop: '5px' }}>
                                    <FontAwesomeIcon icon="fa-solid fa-book" /> Batch Summary
                                  </Link>
                                </>
                              )}
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
                            onClick={() => fetchBatchList(currentPage - 1)}
                          >
                            Previous
                          </button>
                        )}

                        Page {currentPage} of {totalPages}

                        {currentPage < totalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => fetchBatchList(currentPage + 1)}
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
