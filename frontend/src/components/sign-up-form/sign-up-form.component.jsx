
import { useState } from "react";
import FormInput from "../form-input/form-input.component";
import './sign-up-form.styles.scss';

import { createAuthUserWithEmailAndPassword, createNeo4jUser } from "../../utils/firebase/firebase.utils";
import Button from "../button/button.component";

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}




const SignUpForm = () => {

    const [formFields, setFormFields] = useState(defaultFormFields);

    const { displayName, email, password, confirmPassword } = formFields;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const  {user}  = await createAuthUserWithEmailAndPassword(email, password); 
        console.log(user)
        await createNeo4jUser(user, { displayName });
        //await createNeo4jUser(user, { displayName });
        setFormFields(defaultFormFields);
    }


    return (
        <div className='sign-up-container'>
            <h2>Don't have an account</h2>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleSubmit}>
               
                <FormInput  label='Display Name' type='text' name='displayName' onChange={handleChange} value={displayName} required />
                <FormInput  label='Email' type='email' name='email' onChange={handleChange} value={email} required />
                <FormInput label='Password' type='password' name='password' onChange={handleChange} value={password} required />
                <FormInput label='Confirm Password' type='password' name='confirmPassword' onChange={handleChange} value={confirmPassword} required />
                <Button type='submit'>Sign Up</Button>
            </form>
        </div>
    )
}

export default SignUpForm;
