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
        console.log(idToken);
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