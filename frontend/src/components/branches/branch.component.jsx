import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchById,useUpdateBranch } from '../../hooks/useBranches';
import { useMembers } from '../../hooks/useMembers';
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const Branch = () => {
   
 
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        address_line_1: '',
        town: '',
        county: '',
        postcode: '',
        pastor_id: '',
        pastor_name: '',
        relationship: '',
    });

    const { branch, loading, error } = useBranchById(id);
    const { updateBranch,updating, updateError, success  } = useUpdateBranch();

    const { members } = useMembers();
    console.log(members);

    useEffect(() => {

        if (id && branch) {
            setFormData({
                name: branch.name,
                address_line_1: branch.address_line_1,
                town: branch.town,
                county: branch.county,
                postcode: branch.postcode,
                pastor_id: branch.pastor_id,
                pastor_name: branch.pastor_name,
                relationship: branch.relationship
                
            });
        }
    }, [id, branch,members]);

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            // Call update branch API
          
            toast.info("The records are updating...", {
                position: "top-right",
                autoClose: 2000, // Closes after 2 seconds
              });

            updateBranch(id, formData)
                .then(response => {
                    // Handle successful update
                    toast.success("Success! Branch details updated.", {
                        position: "top-right",
                        autoClose: 3000,
                      });
                    console.log('Branch updated successfully', response);
                })
                .catch(error => {
                    // Handle update error
                    toast.error("Error updating branch details. Please try again.", {
                        position: "top-right",
                        autoClose: 4000,
                      });
                    console.error('Error updating branch', error);
                });
        } else {
            // Call add branch API
        }
    };

    if (error) return <p>Error: {error}</p>;



    return (
        <Fragment>
            {loading && <p>Loading...</p>}

            <div className='branch'>
            {!loading && (
            <form onSubmit={handleSubmit}>
                        <div>
                            <label>Branch Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Branch Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address_line_1}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Branch Town:</label>
                            <input
                                type="text"
                                name="town"
                                value={formData.town}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Branch County:</label>
                            <input
                                type="text"
                                name="county"
                                value={formData.county}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Branch Postcode:</label>
                            <input
                                type="text"
                                name="postcode"
                                value={formData.postcode}
                                onChange={handleChange}
                            />
                        </div>

                       {/* <div>
                            <label>Pastor ID:</label>
                            <input
                                type="text"
                                name="pastor_id"
                                value={formData.pastor_id}
                                onChange={handleChange}
                            />
                        </div>  */}

                        <div>
                            <label>Pastor Name</label>
                            <input
                                type="text"
                                name="pastor_name"
                                value={formData.pastor_name}
                                onChange={handleChange}
                            />
                        </div> 

                        <div>
                        <label>Pastor List</label>

                         <select
                            name="pastor_id"
                             value={formData.pastor_id}
                             onChange={handleChange}
                        >
                            {members && members.length > 0 ? (
                                members.map(member => (
                                    <option key={member.member_id} value={member.member_id}>
                                        {member.member_name}
                                    </option>
                                ))
                            ) : (
                                <option value="">No members available</option>
                            )}
                        </select> 
                        </div>
                        <button type="submit" disabled={updating}>{id ? 'Update Branch' : 'Add Branch'}</button>
                    </form>

            )}

                {!loading && (
                    <div className='branch-details'>
                        <h1>Branch Details : {id}</h1>
                        <p>Branch Name:  {branch.name} </p>
                        <p>Branch Address: </p>
                        <p>Branch Town: </p>
                        <p>Branch County: </p>
                        <p>Branch Postcode: </p>
                        <p>Branch Pastor ID : {formData.pastor_id}</p>
                        {members && members.length > 0 ? (
                                members.map(member => (
                                    <p key={member.member_id}>{member.member_name}</p>
                                )) 
                            ) : (
                                <p>No members available</p>
                            )}


                    </div>
                )}
                      </div>
                        {/* Add ToastContainer here */}
      <ToastContainer />
        </Fragment>
    );
}

export default Branch;