import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetAll } from '../../service/CategoryService';

export default function CategoryList() {

  const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

  const [categorys, setCategorys] = useState();
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchCategoryList = async (page = 1) => {
    try {
      setIsLoading(true);
      var response = await GetAll(page, itemsPerPage, keyword);
      setCategorys(response.categories);
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
    fetchCategoryList(currentPage);
  }, []);

  return (
    <>
      <Helmet>
        <title>Category List | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Category List</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Category List
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
                            <FontAwesomeIcon icon="fa-solid fa-search" onClick={() => fetchCategoryList(1)} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="p-2">
                        <div className="input-group p-4">
                          <Link className="btn btn-success" to="/category/manage"> <FontAwesomeIcon icon="fa-solid fa-plus" ></FontAwesomeIcon> Add Category </Link>
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
                          <th>Section</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* iterate the categorys and display in table */}
                        {categorys && categorys.map((category) => (
                          <tr key={category._id}>
                            <td>
                              {/* <img src={config.apiUrl + "uploads/categorys/" + category._id + "." + category.image} alt={category.name} className='img-fluid image-xs' /> */}
                              <img
                                src={`${config.imageBasePath}/categorys/${category._id}.${category.image}`}
                                alt={category.name} className='img-fluid image-xs'
                              />
                            </td>
                            <td>{category.sectionId?.name || "N/A"}</td>
                            <td>{category.name}</td>
                            <td>{category.status}</td>
                            <td>
                              <Link to={`/category/manage/${category._id}`} className='btn btn-sm btn-primary'>
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
                            onClick={() => fetchCategoryList(currentPage - 1)}
                          >
                            Previous
                          </button>
                        )}

                        Page {currentPage} of {totalPages}

                        {currentPage < totalPages && (
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => fetchCategoryList(currentPage + 1)}
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
