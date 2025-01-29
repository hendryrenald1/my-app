import { useState, useEffect } from 'react';
import { fetchAllMembers } from '../services/memberService';



const useMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const loadMembers = async () => {
        try {
            const data = await fetchAllMembers();
            setMembers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };
        loadMembers();
    }, []);
    
    return { members, loading, error };
    };

export { useMembers };