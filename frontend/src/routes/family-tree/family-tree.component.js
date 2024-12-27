// File: src/components/FamilyTree.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from '../../utils/firebase/firebase.utils';

const FamilyTree = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
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

  // Add a family member
  const addFamilyMember = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/add-family-member",
        { name: "John Doe", dob: "1980-01-01", gender: "male", parents: [] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Family member added:", response.data);
    } catch (error) {
      console.error("Error adding family member:", error);
    }
  };

  // Fetch all descendants
  const getDescendants = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:4000/descendants/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFamilyMembers(response.data);
    } catch (error) {
      console.error("Error fetching descendants:", error);
    }
  };

  return (
    <div>
    <div> 
    
        <h2> Token found </h2>
        <label> {token}</label>
</div>
      <h1>Family Tree</h1>
      
      <button onClick={addFamilyMember}>Add Family Member</button>
      <button onClick={() => getDescendants('4:8d8d2214-5596-4500-a07b-321588b45b5a:2')}>Get Descendants</button>
      <ul>
        {familyMembers.map((member, index) => (
          <li key={index}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FamilyTree;
