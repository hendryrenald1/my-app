/**
 * Fetches all Members from the server.
 *
 * This function makes an HTTP GET request to the server to retrieve all branches.
 * It includes an authorization token in the request headers for authentication.
 *
 * @async
 * @function fetchAllMembers
 * @returns {Promise<Object[]>} A promise that resolves to an array of branch objects.
 * @throws {Error} Throws an error if the request fails or the server responds with a status other than 200.
 */
import axios from "axios";
import { auth } from '../utils/firebase/firebase.utils';


export const fetchAllMembers = async () => {

        try
            {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.get(`http://localhost:4000/members`, {
             headers: { Authorization: `Bearer ${idToken}` },
        });

        if (response.status !== 200) {
            throw new Error("Failed to fetch members. Server responded with status: " + response.status);
        }
        return  response.data;  
    } catch (error) {
        console.error("Error fetching members:", error);
        throw new Error("Failed to fetch members.");
    }   

};
