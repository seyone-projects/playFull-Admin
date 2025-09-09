import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById } from '../../service/BatchService';
import { GetById as GetByFeeSchemesId } from '../../service/FeeSchemeService';
import { Add, GetByFeeSchemeId } from '../../service/FeeSchemePaymentService';
import axios from 'axios';

export default function FeeSchemePaymentList() {
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
  const [totalAmount, setTotalAmount] = useState(0);
  const itemsPerPage = 10;
  const { id, batchId } = useParams();

  const [batchDetails, setBatchDetails] = useState({});
  const [feeSchemePayments, setFeeSchemePayments] = useState([]);

  const [feeScheme, setFeeScheme] = useState({});

  // Form states
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState(0);
  const [remarks, setRemarks] = useState('');

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

  //fetch fee scheme by id
  const fetchFeeSchemeDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetByFeeSchemesId(id);
      setFeeScheme(response.feeScheme);
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to fetch fee scheme details");
      setAppErrorMode("error");
    } finally {
      setIsLoading(false);
    }
  };


  const fetchFeeSchemePayments = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetByFeeSchemeId(id, page, itemsPerPage);
      setFeeSchemePayments(response?.feeSchemePayments || []);
      setCurrentPage(response?.currentPage || 1);
      setTotalPages(response?.totalPages || 1);
      setTotalItems(response.totalItems || 0);
      setTotalAmount(response.totalAmount || 0);
    } catch (error) {
      setAppError(true);
      setAppErrorTitle("Error");
      setAppErrorMessage("Failed to load data");
      setAppErrorMode("error");
      setFeeSchemePayments([]);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchBatchDetails();
  }, []);

  useEffect(() => {
    fetchFeeSchemeDetails();
  }, []);

  React.useEffect(() => {
    fetchFeeSchemePayments(currentPage);
  }, []);


  const saveFeeSchemePayment = async (event) => {
    event.preventDefault();

    // Check if total + new amount exceeds batch fee
    if (Number(totalAmount) + Number(amount) > Number(batchDetails.fee)) {
      setAppError(true);
      setAppErrorTitle("Validation Error");
      setAppErrorMessage("Fee scheme payment total cannot exceed batch fee");
      setAppErrorMode("error");
      return;
    }

    setIsLoading(true);

    try {
      let response = null;
      response = await Add(id, name, dueDate, amount, remarks);
      if (response.status === 200) {
        setAppError(true);
        setAppErrorTitle("Action Response");
        setAppErrorMessage(response.message || "Fee Scheme Payment Successfully Added");
        setAppErrorMode("success");
        if (id) {
          window.location.href = `/fee-scheme-payment/manage/${id}/${batchId}`;
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
        <title>Fee Scheme Payment Details | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Fee Scheme Payment Details</h1>
            <span>
              <Link to="/"> Dashboard </Link> / <Link to={`/batch/list`}> FeeScheme Fee Scheme Payment List </Link>
              / Fee Scheme Payment Details
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
                <div className='batch-details mt-2'>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      Fee Scheme : <strong>{feeScheme.name || '-'}</strong>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      Remarks : <strong> {feeScheme.remarks || '-'} </strong>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className='row'>
                  <div className='col-lg-12 col-md-12 col-xs-12'>
                    <h5><b><FontAwesomeIcon icon="fa-solid fa-plus-circle" /> Add Fee Scheme Payment </b></h5>
                    <div className='batch-details'>
                      <form onSubmit={saveFeeSchemePayment} encType='multipart/form-data'>
                        <div className='row'>
                          <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input className='form-control' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                          </div>
                          <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Due Date</label>
                              <input className='form-control' type='date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                            </div>
                          </div>
                          <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Amount</label>
                              <input className='form-control' type='number' value={amount} onChange={(e) => setAmount(e.target.value)} />
                            </div>
                          </div>
                          <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Remarks</label>
                              <input className='form-control' type='text' value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                            </div>
                          </div>
                          <div className='col-12 text-end'>
                            <div className="mb-3">
                              <button type='submit' className='btn btn-success-app btn-md'>
                                <i className="ri-check-fill"></i> Add Fee Scheme Payment
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <br />
                <h5><b><FontAwesomeIcon icon="fa-solid fa-book" /> Fee Scheme Payment List </b></h5>
                <div className='table-content'>
                  <div className="mobile-scroll">
                    <table className='table table-bordered table-condensed'>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Due Date</th>
                          <th>Amount</th>
                          <th>Remarks</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeSchemePayments.length === 0 ? (
                          <tr>
                            <td colSpan="8" className='text-center'>No records found</td>
                          </tr>
                        ) : (
                          feeSchemePayments.map((feeSchemePayment) => (
                            <tr key={feeSchemePayment._id}>
                              <td>{feeSchemePayment.name}</td>
                              <td>
                                {new Date(feeSchemePayment.dueDate)
                                  .toLocaleDateString("en-GB")
                                  .replace(/\//g, "-")}
                              </td>
                              <td>{feeSchemePayment.amount}</td>
                              <td>{feeSchemePayment.remarks}</td>
                              <td>{feeSchemePayment.status.charAt(0).toUpperCase() + feeSchemePayment.status.slice(1)}</td>
                              <td>
                                <Link to={`/fee-scheme-payment/manage/edit/${feeSchemePayment._id}/${batchId}/${id}`} className='btn btn-sm btn-primary me-2'>
                                  <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <div className='row'>
                      <div className='col-md-3'>
                        <div className='card shadow-sm border-start border-4 border-primary'>
                          <div className='card-body d-flex justify-content-between align-items-center'>
                            <div>
                              <h6 className='text-muted mb-1'>Total Amount</h6>
                              <h5 className='text-primary mb-0'>{totalAmount}</h5>
                            </div>
                            <div className='icon bg-primary text-white rounded-circle d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px' }}>
                              <FontAwesomeIcon icon="fa-solid fa-user" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {totalItems > 10 && (
                    <div className="pagination mt-3 d-flex justify-content-center">
                      <span className="align-self-center me-3">
                        {currentPage > 1 && (
                          <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => fetchFeeSchemePayments(currentPage - 1)}
                          >
                            Previous
                          </button>
                        )}
                        Page {currentPage} of {totalPages}
                        {currentPage < totalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => fetchFeeSchemePayments(currentPage + 1)}
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
