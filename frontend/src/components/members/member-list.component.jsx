import React, { useState } from 'react';

import './member-list.styles.scss';

const MemberList = ({ members }) => {

    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };
    
    const handleSortChange = (key) => {
        setSortKey(key);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(filter.toLowerCase())
    );
    
    const sortedMembers = filteredMembers.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    
    return (
        <div className='member-list-container'>
        <input
            type="text"
            placeholder="Filter by name"
            value={filter}
            onChange={handleFilterChange}
        />
        <table>
            <thead>
            <tr>
                <th onClick={() => handleSortChange('name')}>Name</th>
                <th onClick={() => handleSortChange('contactNo')}>Contact No</th>
                <th onClick={() => handleSortChange('email')}>Email</th>
                <th onClick={() => handleSortChange('branch')}>Branch</th>
                <th onClick={() => handleSortChange('joinedOn')}>Joined On</th>
                <th onClick={() => handleSortChange('baptism')}>Baptism</th>
            </tr>
            </thead>
            <tbody>
            {sortedMembers.map(member => (
                <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.contactNo}</td>
                <td>{member.email}</td>
                <td>{member.branch}</td>
                <td>{member.joinedOn}</td>
                <td>{member.baptism}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default MemberList;