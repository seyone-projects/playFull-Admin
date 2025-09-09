import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetAllSection } from '../../service/SectionService';

export default function SectionList() {

  const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

  const [sections, setSections] = useState();
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchSectionList = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetAllSection(page, itemsPerPage, keyword);
      setSections(response.sections);
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
    fetchSectionList(currentPage);
  }, []);

  return (
    <>
      <Helmet>
        <title>Section List | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Section List</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Section List
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
                            <FontAwesomeIcon icon="fa-solid fa-search" onClick={() => fetchSectionList(1)} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="p-2">
                        <div className="input-group p-4">
                          <Link className="btn btn-success" to="/section/manage"> <FontAwesomeIcon icon="fa-solid fa-plus" ></FontAwesomeIcon> Add Section </Link>
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
                          <th>Name</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* iterate the sections and display in table */}
                        {sections && sections.map((section) => (
                          <tr key={section._id}>
                            <td>
                              {/* <img src={config.apiUrl + "uploads/sections/" + section._id + "." + section.image} alt={section.name} className='img-fluid image-xs' /> */}
                              <img
                                src={`${config.imageBasePath}/sections/${section._id}.${section.image}`}
                                alt={section.name} className='img-fluid image-xs'
                              />
                            </td>
                            <td>{section.name}</td>
                            <td>{section.status}</td>
                            <td>
                              <Link to={`/section/manage/${section._id}`} className='btn btn-sm btn-primary'>
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
                            onClick={() => fetchSectionList(currentPage - 1)}
                          >
                            Previous
                          </button>
                        )}

                        Page {currentPage} of {totalPages}

                        {currentPage < totalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => fetchSectionList(currentPage + 1)}
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
