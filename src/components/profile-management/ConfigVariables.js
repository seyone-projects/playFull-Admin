import React from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';

export default function ConfigVariables() {
  return (
    <>
      <Helmet>
        <title>Configuration Variables | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>System Config Variables</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Config Variables
            </span>
          </div>
          <div className='page-content'>
            <div className="portal">
              <div className='portal-body'>
                <div className='form'>
                  <div className='row'>
                    <div className='col-12'>
                      <div className='mb-3'>
                        <h4>System Updation</h4>
                      </div>
                    </div>
                    <div className='col-12'>
                      <div className="mb-3">
                        <label for="firstname" className="form-label">App Name</label>
                        <input type="text" className="form-control" autoComplete='off' id="firstname" placeholder="" />
                        <div className="form-text">Infomration about this variable must be given here.</div>
                      </div>
                    </div>
                    <div className='clearfix'></div>
                    <div className='col-12 text-end'>
                      <div className="mb-3">
                        <button type='reset' className='btn btn-danger btn-md'> <i class="ri-reset-right-line"></i> Reset </button>
                        &nbsp;&nbsp;
                        <button type='submit' className='btn btn-success-app btn-md'> <i class="ri-check-fill"></i> Update </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}