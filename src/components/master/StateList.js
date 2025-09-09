import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetAllState } from '../../service/StateService';

export default function StateList() {

  const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

  const [states, setStates] = useState();
  const [keyword, setKeyword] = useState('');

  const fetchStateList = async () => {
    try {
      setIsLoading(true);
      var response = await GetAllState(0, 0, keyword);
      setStates(response.states);
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
    fetchStateList();
  }, []);

  return (
    <>
      <Helmet>
        <title>State List | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>State List</h1>
            <span>
              <Link to="/"> Dashboard </Link> / State List
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
                            <FontAwesomeIcon icon="fa-solid fa-search" onClick={fetchStateList} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div className='table-content'>
                  <table className='table table-bordered table-condensed'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price per kg</th>
                        <th>No. of Expected Delivery Days </th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* iterate the states and display in table
                      {states && states.map((state) => (
                        <tr key={state._id}>                          
                          <td>{state.name}</td>
                          <td>100</td>
                          <td>20</td>
                          <td>{state.status}</td>
                          <td>
                            <Link to='#' className='btn btn-sm btn-primary'>
                              <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                         */}

                      <tr>
                        <td>Tamil Nadu</td>
                        <td>100</td>
                        <td>2</td>
                        <td>Active</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Kerala</td>
                        <td>105</td>
                        <td>3</td>
                        <td>Active</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Karnataka</td>
                        <td>110</td>
                        <td>4</td>
                        <td>Inactive</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Andhra Pradesh</td>
                        <td>102</td>
                        <td>3</td>
                        <td>Active</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Telangana</td>
                        <td>108</td>
                        <td>5</td>
                        <td>Active</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Maharashtra</td>
                        <td>115</td>
                        <td>4</td>
                        <td>Inactive</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Gujarat</td>
                        <td>98</td>
                        <td>3</td>
                        <td>Active</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Rajasthan</td>
                        <td>120</td>
                        <td>6</td>
                        <td>Inactive</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Punjab</td>
                        <td>113</td>
                        <td>4</td>
                        <td>Active</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>West Bengal</td>
                        <td>99</td>
                        <td>5</td>
                        <td>Active</td>
                        <td>
                          <Link to="" className='btn btn-sm btn-primary'>
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
