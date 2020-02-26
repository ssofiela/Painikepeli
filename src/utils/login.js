import React from 'react';
import {withFirebase} from "../Firebase";
import SignInForm from "../pages/SignInForm.js"
import {withRouter} from 'react-router-dom'



export default function Register() {
    return (
        <div>
            <SignInFormFirebase/>
        </div>

    )

}

const SignInFormFirebase = withFirebase(withRouter(SignInForm));

