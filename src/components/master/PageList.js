import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../../config';
//import globalcontext
import { useGlobalContext } from '../../GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetAll, Delete } from '../../service/PageService';

export default function PageList() {

  const { isLoading, setIsLoading, isAppError, setAppError, appErrorMessage, setAppErrorMessage, appErrorTitle, setAppErrorTitle, appErrorMode, setAppErrorMode, appUser } = useGlobalContext();

  const [pages, setPages] = useState();
  const [keyword, setKeyword] = useState('');

  //delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this page?");
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const result = await Delete(id);
      if (result.status === 200) {       
        setAppErrorMessage("Page deleted successfully!");
        window.location.href = "/page/list";
      } else {
        setAppErrorMessage("Failed to delete:"  + result.message);
      }
    } catch (error) {
      setAppErrorMessage("An error occurred while deleting the page.");
    } finally {
      setIsLoading(false);
    }
  };


  const fetchPageList = async () => {
    try {
      setIsLoading(true);
      var response = await GetAll(0, 0, keyword);
      setPages(response.pages);
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
    fetchPageList();
  }, []);



  return (
    <>
      <Helmet>
        <title>Page List | {config.appName} </title>
      </Helmet>
      <div className='container'>
        <div className='page'>
          <div className='page-heading'>
            <h1>Page List</h1>
            <span>
              <Link to="/"> Dashboard </Link> / Page List
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
                            <FontAwesomeIcon icon="fa-solid fa-search" onClick={fetchPageList} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-6 col-12'>
                      <div className="p-2">
                        <div className="input-group p-4">
                          <Link className="btn btn-success" to="/page/manage"> <FontAwesomeIcon icon="fa-solid fa-plus" ></FontAwesomeIcon> Add Page </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div className='table-content'>
                  <table className='table table-bordered table-condensed'>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* iterate the pages and display in table */}
                      {pages && pages.map((page) => (
                        <tr key={page._id}>
                          <td>
                            {/* <img src={config.apiUrl + "uploads/pages/" + page._id + "." + page.image} alt={page.name} className='img-fluid image-xs' /> */}
                            <img
                              src={`${config.imageBasePath}/pages/${page._id}.${page.image}`}
                              alt={page.name} className='img-fluid image-xs'
                            />
                          </td>
                          <td>{page.title}</td>
                          <td>{page.status}</td>
                          <td>
                            <Link to={`/page/manage/${page._id}`} className='btn btn-sm btn-primary'>
                              <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                            </Link>
                            &nbsp;&nbsp;
                            <button onClick={() => handleDelete(page._id)} className='btn btn-sm btn-danger'>
                              <FontAwesomeIcon icon="fa-solid fa-trash-alt" />
                            </button>
                          </td>
                        </tr>
                      ))}
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
