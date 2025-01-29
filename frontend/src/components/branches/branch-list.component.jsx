// component/branch/branch-list.component.jsx
import React, { Fragment } from 'react';
import {useBranches} from '../../hooks/useBranches';
import MapComponent from '../map/map.component';
import './branch-list.styles.scss'
import { useNavigate } from 'react-router-dom'

const BranchList = () => {
    const navigate = useNavigate();
    const { branches, loading, error, page, setPage, totalPages } = useBranches();

    const goToNextPage = () => {
        if (page < totalPages) setPage((prevPage) => prevPage + 1);
    };

    const goToPreviousPage = () => {
        if (page > 1) setPage((prevPage) => prevPage - 1);
    };

    if (error) return <p>Error: {error}</p>;

    return (
        <Fragment>
        <div className='branch-container'>
          <div className='branch-list'>
            <table className='table-container'>
                <thead className='table-header'>
                    <tr className='table-row'>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address Line 1</th>
                        <th>Town</th>
                        <th>County</th>
                        <th>Postcode</th>
                        <th>Pastor ID</th>
                        <th>Pastor Name</th>
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {branches.map((branch) => (
                        <tr  key={branch.branch_id}>
                            <td onClick={() => navigate(`/home/branch/edit/${branch.branch_id}`)}>{branch.branch_id}</td>
                            <td>{branch.name}</td>
                            <td>{branch.address_line_1}</td>
                            <td>{branch.town}</td>
                            <td>{branch.county}</td>
                            <td>{branch.postcode}</td>
                            <td>{branch.pastor_id}</td>
                            <td>{branch.pastor_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            {loading && <p>Loading...</p>}
             <div className="buttons-container">
            {!loading && (
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={goToPreviousPage}
                        disabled={page === 1}
                        style={{ marginRight: '10px' }}
                    >
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={page === totalPages}
                        style={{ marginLeft: '10px' }}
                    >
                        Next
                    </button>
                </div>
                 
            )}
             </div>     
        </div>
        <div>
            {/* <MapComponent /> */}
        </div>
        </Fragment>
    );
};

export default BranchList;
