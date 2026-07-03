import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetById } from '../../service/BatchService';
import { GetUserById } from '../../service/UserService';
import { Update, GetPaymentsByBatchStudentId} from '../../service/BatchStudentPaymentService';

export default function BatchStudentPaymentUpdate() {
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

  const { id, userId, batchStudentId, batchStudentPaymentId } = useParams();

  const [batchDetails, setBatchDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});

  //payment
  const [amount, setAmount] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const [paymentDateTime, setPaymentDateTime] = useState(today);

  const [paymentReference, setPaymentReference] = useState('');

  //fetch batchstudentpayments  
  const fetchBatchStudentPayments = async () => {
  try {
    setIsLoading(true);
    const response = await GetPaymentsByBatchStudentId(batchStudentId, 1, 1000);

    if (response?.payments && response.payments.length > 0) {
      // find the payment that matches the current batchStudentPaymentId
      const currentPayment = response.payments.find(
        (p) => p._id === batchStudentPaymentId
      );

      if (currentPayment) {
        setAmount(currentPayment.amount);       
      }
    }
  } catch (error) {
    setAppError(true);
    setAppErrorTitle("Error");
    setAppErrorMessage("Failed to fetch payment details");
    setAppErrorMode("error");
  } finally {
    setIsLoading(false);
  }
};


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

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await GetUserById(userId);
      if (response?.user) {
        setUserDetails(response.user);

      } else {
        setUserDetails({});
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


  useEffect(() => {
    fetchBatchDetails();
    fetchUserDetails();
    fetchBatchStudentPayments();
  }, []);


  //create a function to send the amount and image to axios post to save the cateogry
  const savePayment = async (event) => {
    event.preventDefault();

    //required payment reference
    if (!paymentReference) {
      setAppError(true);
      setAppErrorTitle("Payment Reference");
      setAppErrorMessage("Please enter payment reference");
      setAppErrorMode("warning");
      return;
    }

    setIsLoading(true);

    try {
      let response = null;
      response = await Update(batchStudentPaymentId, paymentReference, paymentDateTime);

      if (response.status === 200) {
        setAppError(true);
        setAppErrorTitle("Action Response");
        setAppErrorMessage(response.message || "Payment Successfully Updated");
        setAppErrorMode("success");
        if (userId && id) {
          window.location.href = `/batch-student-fee/manage/${userId}/${id}/${batchStudentId}`;
        } else {
          console.error("Invalid userId or batch id");
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
        <title>Fee Details | {config.appName}</title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Fee Details</h1>
            <span>
              <Link to="/"> Dashboard </Link> / <Link to={`/batch-student-fee/manage/${userId}/${id}/${batchStudentId}`}> Fees List </Link>
              / Fee Details
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
                <div className='batch-details'>
                  <div className='row mb-3'>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Joining Date : <strong>
                        {userDetails?.joiningDate
                          ? (() => {
                            const date = new Date(userDetails.joiningDate);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()
                          : '-'}
                      </strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Mobile : <strong>
                        {userDetails?.mobile}
                      </strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      Gender <strong>{userDetails?.genderId?.name || '-'}</strong>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'>
                      City : <strong>{userDetails?.cityId?.name || '-'}</strong>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      Student Name : <strong>{userDetails?.username || '-'}</strong>
                    </div>

                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      Email : <strong>{userDetails?.email}</strong>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className='row'>
                  <div className='col-lg-12 col-md-4 col-xs-12'>
                    <h5><b> <FontAwesomeIcon icon="fa-solid fa-pen" /> Update Payment</b></h5>
                    <div className='batch-details'>
                      <form onSubmit={savePayment} encType='multipart/form-data'>
                        <div className='row'>
                          <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Amount</label>
                              <input className='form-control' type='text' value={amount} onChange={(e) => setAmount(e.target.value)} disabled />
                            </div>
                          </div>
                          <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Payment Date</label>
                              <input className='form-control' type='date' value={paymentDateTime} onChange={(e) => setPaymentDateTime(e.target.value)} />
                            </div>
                          </div>

                          <div className='col-lg-4 col-md-4 col-sm-12 col-12'>
                            <div className="mb-3">
                              <label className="form-label">Payment Reference</label>
                              <input className='form-control' type='text' value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} />
                            </div>
                          </div>
                          <div className='clearfix'></div>
                          <div className='col-12 text-end'>
                            <div className="mb-3">
                              <button type='submit' className='btn btn-success-app btn-md'> <i className="ri-check-fill"></i> Update Payment </button>
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
      </div >
    </>
  );
}