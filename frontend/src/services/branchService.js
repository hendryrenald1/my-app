/**
 * Fetches all branches from the server.
 *
 * This function makes an HTTP GET request to the server to retrieve all branches.
 * It includes an authorization token in the request headers for authentication.
 *
 * @async
 * @function fetchAllBranches
 * @returns {Promise<Object[]>} A promise that resolves to an array of branch objects.
 * @throws {Error} Throws an error if the request fails or the server responds with a status other than 200.
 */
import axios from "axios";
import { auth } from '../utils/firebase/firebase.utils';


export const fetchAllBranches = async (page=1, limit=10) => {

        try
            {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.get(`http://localhost:4000/branches?page=${page}&limit=${limit}`, {
             headers: { Authorization: `Bearer ${idToken}` },
        });

        if (response.status !== 200) {
            throw new Error("Failed to fetch branches. Server responded with status: " + response.status);
        }
        return  {
            branches: response.data.branches,
            totalCount: response.data.totalCount
        }
    } catch (error) {
        console.error("Error fetching branches:", error);
        throw new Error("Failed to fetch branches.");
    }   

};


/**
 * Fetches a branch by its ID from the server.
 *
 * This function makes an HTTP GET request to the server to retrieve a branch by its ID.
 * It includes an authorization token in the request headers for authentication.
 *
 * @async
 * @function fetchBranchById
 * @param {string} id - The ID of the branch to fetch.
 * @returns {Promise<Object>} A promise that resolves to a branch object.
 * @throws {Error} Throws an error if the request fails or the server responds with a status other than 200.
 */
export const fetchBranchById = async (id) => {
    try {
        const idToken = await auth.currentUser.getIdToken();
        console.log(idToken);
        const response = await axios.get(`http://localhost:4000/branches/${id}`, {
            headers: { Authorization: `Bearer ${idToken}` },
        });

        if (response.status !== 200) {
            throw new Error("Failed to fetch branch. Server responded with status: " + response.status);
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching branch:", error);
        throw new Error("Failed to fetch branch.");
    }
};

/**
 * Updates a branch by its ID on the server.
 *
 * This function makes an HTTP PUT request to the server to update a branch by its ID.
 * It includes an authorization token in the request headers for authentication.
 *
 * @async
 * @function updateBranchById
 * @param {string} id - The ID of the branch to update.
 * @param {Object} branchData - The branch data to update.
 * @returns {Promise<Object>} A promise that resolves to the updated branch object.
 * @throws {Error} Throws an error if the request fails or the server responds with a status other than 200.
 */
export const updateBranchById = async (id, branchData) => {
    try {
        const idToken = await auth.currentUser.getIdToken();
        console.log(idToken);
        const response = await axios.put(`http://localhost:4000/branches/${id}`, branchData, {
            headers: { Authorization: `Bearer ${idToken}` },
        });

        if (response.status !== 200) {
            throw new Error("Failed to update branch. Server responded with status: " + response.status);
        }
        return response.data;
    } catch (error) {
        console.error("Error updating branch:", error);
        throw new Error("Failed to update branch.");
    }
};