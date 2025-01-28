import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from '../../utils/firebase/firebase.utils';

const Branch = () => {
    const [token, setToken] = useState("");

    // Authenticate the user and get token
    useEffect(() => {
        const fetchToken = async () => {
            const user = auth.currentUser;
            console.log(user)
            if (user) {
                const idToken = await user.getIdToken();
                console.log(idToken);
                setToken(idToken);
            }
        };
        fetchToken();
        console.log(auth);
    }, []);


    // Fetch all branches
    const getBranches = async () => {
        try {
            const response = await axios.get("http://localhost:4000/branches", {
                headers: { Authorization: `Bearer ${token}` },
            });
           return response.data;
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };
}

export default Branch;
