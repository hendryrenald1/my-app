
import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';
import './authentication.styles.css';
const Authentication = () => {




    return (
        <div>
            <h1>Sign In - Auth Component</h1>
            <div className="authentication-container">
                <SignInForm  className="component"/>
                <SignUpForm  className="component"/>
            </div>

        </div>
    )
};

export default Authentication;
