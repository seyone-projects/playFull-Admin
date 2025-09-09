import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById } from '../../service/BatchService';
import { Add, GetByBatchId } from '../../service/FeeSchemeService';
import axios from 'axios';

export default function BatchFeeSchemeList() {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const { id } = useParams();

  const [batchDetails, setBatchDetails] = useState({});
  const [feeSchemes, setFeeSchemes] = useState([]);

  // Form states
  const [name, setName] = useState(''); 
  const [remarks, setRemarks] = useState('');

    const fetchBatchDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetById(id);
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

const fetchFeeSchemes = async (page = 1) => {
  try {
    setIsLoading(true);
    var response = await GetByBatchId(id, page, itemsPerPage);
    setFeeSchemes(response?.feeSchemes || []); 
    setCurrentPage(response?.currentPage || 1);
    setTotalPages(response?.totalPages || 1);
    setTotalItems(response?.totalItems || 0);
  } catch (error) {
    setAppError(true);
    setAppErrorTitle("Error");
    setAppErrorMessage("Failed to load data");
    setAppErrorMode("error");
    setFeeSchemes([]);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchBatchDetails();
  }, []);

  React.useEffect(() => {
    fetchFeeSchemes(currentPage);
  }, []);

  const saveFeeScheme = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      let response = null;
      response = await Add(id, name, remarks);
      if (response.status === 200) {
        setAppError(true);
        setAppErrorTitle("Action Response");
        setAppErrorMessage(response.message || "Fee Scheme Successfully Added");
        setAppErrorMode("success");
        if (id) {
          window.location.href = `/batch-fee-scheme/manage/${id}`;
        } else {
          console.error("Invalid batch id");
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
  return (
    <>    

      <Helmet>
        <title>Fee Scheme Details | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Fee Scheme Details</h1>
            <span>
              <Link to="/"> Dashboard </Link> / <Link to={`/batch/list`}> Batch Fee Scheme List </Link>
              / Fee Scheme Details
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
                <div className='batch-details mt-2'>
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
                     <div className='col-lg-6 col-md-6 col-sm-12'>
                      Trainer Name : <strong>{batchDetails?.trainerId?.username || '-'}</strong>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-xs-12'>
                    <h5><b><FontAwesomeIcon icon="fa-solid fa-plus-circle" /> Add Fee Scheme </b></h5>
                    <div className='batch-details'>
                      <form onSubmit={saveFeeScheme} encType='multipart/form-data'>
                        <div className='row'>                         
                          <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input className='form-control' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                          </div> 
                          <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Remarks</label>
                              <input className='form-control' type='text' value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                            </div>
                          </div>
                          <div className='col-12 text-end'>
                            <div className="mb-3">
                              <button type='submit' className='btn btn-success-app btn-md'>
                                <i className="ri-check-fill"></i> Add Fee Scheme
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <br />
                <h5><b><FontAwesomeIcon icon="fa-solid fa-book" /> Fee Scheme List </b></h5>
                <div className='table-content'>
                  <div className="mobile-scroll">
                  <table className='table table-bordered table-condensed'>
                    <thead>
                      <tr>                      
                        <th>Name</th>
                        <th>Remarks</th>                        
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeSchemes.length === 0 ? (
                        <tr>
                          <td colSpan="8" className='text-center'>No records found</td>
                        </tr>
                      ) : (
                        feeSchemes.map((feeScheme) => (
                          <tr key={feeScheme._id}>                            
                            <td>{feeScheme.name}</td>  
                            <td>{feeScheme.remarks}</td>                           
                            <td>{feeScheme.status.charAt(0).toUpperCase() + feeScheme.status.slice(1)}</td>
                            <td>
                              <Link to={`/batch-fee-scheme/manage/edit/${feeScheme._id}/${id}`} className='btn btn-sm btn-primary me-2'>
                                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                              </Link>                            
                              <Link to={`/fee-scheme-payment/manage/${feeScheme._id}/${id}`} className='btn btn-sm btn-dark me-2'>
                                <FontAwesomeIcon icon="fa-solid fa-coins" /> Fee Scheme Payment
                              </Link>
                            </td>
                          </tr>
                        ))
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
                            onClick={() => fetchFeeSchemes(currentPage - 1)}
                          >
                            Previous
                          </button>
                        )}
                        Page {currentPage} of {totalPages}
                        {currentPage < totalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => fetchFeeSchemes(currentPage + 1)}
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
