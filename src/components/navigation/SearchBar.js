import React from 'react'

function SearchBar() {
  return (
    <>
        <div className='search-bar'>
            <form className='search-form d-flex align-items-center' method='GET' action='#'>
                <input type='text' name='query' placeholder='Search here' title='Enter search keyword' />
                <button type='submit' title='Search'>
                    <i className='bi bi-search'></i>
                </button>
            </form>
        </div>
    </>
  )
}

export default SearchBar