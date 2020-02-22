import React from 'react';
import Register from '../src/pages/register.js';
import Login from '../src/pages/login.js';
import {
    Switch,
    Route,
    withRouter, BrowserRouter as Router
} from 'react-router-dom';
import {withFirebase} from './Firebase';
import Home from './pages/home'
import ButtonAppBar from './components/TopBar'

export default function appRouter(props) {
    return (
        <Router>
            <TopBarWithRouter />
                {console.log("auth", props.auth, props.auth === undefined)}
                {console.log("da", props.firebase.getCurrentUser())}
            {/* {props.firebase.getCurrentUser() === null ?
                (
                    <Switch>
                        <Route key='home' exact path='/' component={Login}/>
                        <Route key='login' exact path='/login' component={Login}/>
                        <Route key='register' exact path='/register' component={Register}/>
                    </Switch>
                )
                :
                (*/}
                    <Switch>
                        <Route key='home' exact path='/' component={HomePageNav}/>
                        <Route key='register' exact path='/register' component={Register}/>
                        <Route key='login' exact path='/login' component={Login}/>
                    </Switch>



        </Router>
    );
}

const HomePageNav = withRouter(Home);
const TopBarWithRouter = withFirebase(withRouter(ButtonAppBar));

