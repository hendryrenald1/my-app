
import { useEffect, useContext } from 'react';
import { getRedirectResult, onAuthStateChanged, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { auth, signInWithGooglePopup, createNeo4jUser, signInWithGoogleRedirect, signInUserWithEmailAndPassword } from '../../utils/firebase/firebase.utils';
import { useState } from "react";
import FormInput from "../form-input/form-input.component";
import './sign-in-form.styles.scss';

import Button from "../button/button.component";

import { UserContext } from '../context/user.context';

const defaultFormFields = {
    email: '',
    password: ''
}




const SignInForm = () => {

    const { setUser } = useContext(UserContext);

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchRedirectResult = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    console.log('User is signed in:', user);
                } else {
                    try {
                        await setPersistence(auth, browserSessionPersistence); // Ensures session is preserved
                        const result = await getRedirectResult(auth);
                        console.log('Redirect result:', result);
                    } catch (error) {
                        console.error('Error fetching redirect result:', error);
                    }
                        }
                    });
                };
        
                fetchRedirectResult();
            }, []);

            const logGoogleUser = async () => {
                try {
                    // const { user } = await signInWithGooglePopup();
                    const { user } = await signInWithGoogleRedirect();
                    
                    const userNoderef = await createNeo4jUser(user);
                    console.log(userNoderef);
                } catch (error) {
                    console.log(error);
                }
            }



            const [formFields, setFormFields] = useState(defaultFormFields);

            const { email, password } = formFields;

            const handleChange = (e) => {
                const { name, value } = e.target;
                setFormFields({ ...formFields, [name]: value });
            }

            const handleSubmit = async (e) => {
                e.preventDefault();
                try {
                    const {user } = await signInUserWithEmailAndPassword(email, password);
                    setUser(user);    
                    console.log('User signed in:', user);
                    setFormFields(defaultFormFields);
                } catch (error) {
                    console.error('Error signing in with email and password:', error);
                    alert('Invalid email or password. Please try again.');
                }
                setFormFields(defaultFormFields);
            }


            return (
                <form onSubmit={handleSubmit}>
                    <div className='sign-up-container'>
                        <h2>Already Have an account</h2>
                        <span>Sign In with your email and password</span>
                        <FormInput label='Email' type='email' name='email' onChange={handleChange} value={email} required />
                        <FormInput label='Password' type='password' name='password' onChange={handleChange} value={password} required />
                    </div>
                    <div className="buttons-container">
                        <Button type='submit'>Sign In</Button>
                        <Button buttonType='google' onClick={logGoogleUser}>Google SignIn</Button>
                    </div>
                </form>


            )
        }

        export default SignInForm;
