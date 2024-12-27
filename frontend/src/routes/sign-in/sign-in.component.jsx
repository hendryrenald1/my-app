import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth, signInWithGooglePopup, createNeo4jUser ,signInWithGoogleRedirect } from '../../utils/firebase/firebase.utils';
import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
const SignIn = () => {

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                console.log(result);
            } catch (error) {
                console.error('Error fetching redirect result:', error);
            }
        };
    
        fetchRedirectResult();
    }, []); 

    const logGoogleUser = async () => {
        try {
           const {user }=  await signInWithGooglePopup();
              console.log(user);
            const userNoderef =  await createNeo4jUser(user);
            console.log(userNoderef);
        } catch (error) {
            console.log(error);
        }
    } 



    return(
        <div>
            <h1>Sign In</h1>
            <button onClick={logGoogleUser}>Sign In with Google</button>
            <button onClick={signInWithGoogleRedirect}>Sign In with Google Redirect</button>

            <SignUpForm/>
        </div>
    )
};

export default SignIn;
