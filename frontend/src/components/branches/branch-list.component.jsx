// component/branch/branch-list.component.jsx
import React, { Fragment } from 'react';
import useBranches from '../../hooks/useBranches';
import MapComponent from '../map/map.component';

const BranchList = () => {
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
        <div>
            <h2>Branch List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address Line 1</th>
                        <th>Town</th>
                        <th>County</th>
                        <th>Postcode</th>
                    </tr>
                </thead>
                <tbody>
                    {branches.map((branch) => (
                        <tr key={branch.id}>
                            <td>{branch.id}</td>
                            <td>{branch.name}</td>
                            <td>{branch.address_line_1}</td>
                            <td>{branch.town}</td>
                            <td>{branch.county}</td>
                            <td>{branch.postcode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {loading && <p>Loading...</p>}

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
        <div>
            <MapComponent />
        </div>
        </Fragment>
    );
};

export default BranchList;
