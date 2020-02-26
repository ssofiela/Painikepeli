import React from 'react';
import {withFirebase} from "../Firebase";
import SignUpForm from "../pages/SignUpForm.js"
import {withRouter} from "react-router-dom"



export default function Register() {
    return (
        <div>
            <SignUpFormFirebase/>
        </div>

    )

}

const SignUpFormFirebase = withFirebase(withRouter(SignUpForm));