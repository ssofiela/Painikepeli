import React from 'react';
import {withFirebase} from "../Firebase";
import homePage from "../components/HomePage"
import {withRouter} from 'react-router-dom'



const Home = (props) => (
    <div>
        <HomePageFirebase state={props}/>
    </div>
);

const HomePageFirebase = withFirebase(withRouter(homePage));

export default Home;