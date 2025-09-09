import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById } from '../../service/BatchService';
import { Update, GetById as GetFeeShemeById } from '../../service/FeeSchemeService';
import axios from 'axios';

export default function BatchFeeSchemeEdit() {
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
  const { id, batchId } = useParams();

  const [batchDetails, setBatchDetails] = useState({});
  const [feeScheme, setFeeScheme] = useState([]);

  // Form states
  const [name, setName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');

  const fetchBatchDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetById(batchId);
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

  const fetchFeeSchemeById = async () => {
    try {
      setIsLoading(true);
      var response = await GetFeeShemeById(id);
      if (response.status === 200) {
        setFeeScheme(response.feeScheme);
        setName(response.feeScheme.name);
        setRemarks(response.feeScheme.remarks);        
        setStatus(response.feeScheme.status);
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


  useEffect(() => {
    fetchBatchDetails();
  }, []);

  React.useEffect(() => {
    fetchFeeSchemeById();
  }, []);

  const saveFeeScheme = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      let response = null;
      response = await Update(id, batchId, name, remarks, status);
      if (response.status === 200) {
        setAppError(true);
        setAppErrorTitle("Action Response");
        setAppErrorMessage(response.message || "Fee Scheme Successfully Added");
        setAppErrorMode("success");
        if (id) {
          window.location.href = `/batch-fee-scheme/manage/${batchId}`;
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
        <title>Edit Fee Scheme | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Edit Fee Scheme</h1>
            <span>
              <Link to="/"> Dashboard </Link> / <Link to={`/batch-fee-scheme/manage/${batchId}`}> Batch Fee Scheme List </Link>
              / Edit Fee Scheme
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
                          <div className='col-12 text-end'>
                            <div className="mb-3">
                              <button type='submit' className='btn btn-success-app btn-md'>
                                <i className="ri-check-fill"></i> Update Fee Scheme
                              </button>
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
        </div>
      </div>
    </>
  );
}
