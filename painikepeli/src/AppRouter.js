import Register from '../src/pages/register.js';
import Login from '../src/pages/login.js';
import {
    Switch,
    Route,
    Redirect,
    withRouter, BrowserRouter as Router
} from 'react-router-dom';
import {withFirebase} from './Firebase';
import Home from './pages/home'
import ButtonAppBar from './components/TopBar'
import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 500,
    },
    root: {
        flexGrow: 1,
    },
}));


export default function AppRouter(props) {
    const classes = useStyles();

    const [userAuth, setAuth] = useState(false);
    const [indicator, setIndicator] = useState(false);

    // Check authentication
    useEffect(() => {
        setIndicator(true);
        props.firebase.auth.onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                setIndicator(false);
                setAuth(true);
            } else {
                // No user is signed in.
                setIndicator(false);
                setAuth(false);
            }
        });
    }, []);

    // If user is not authenticated, she/he can only log in/register
    const authCheck = () => {
        let value = [];
        if(!userAuth) {
           value.push(
                <Switch>
                    <Route key='home' exact path='/' component={Login}/>
                    <Route key='login' exact path='/login' component={Login}/>
                    <Route key='register' exact path='/register' component={Register}/>
                    <Redirect to="/" />
                </Switch>
               )
        } else {
            value.push(
                <Switch>
                    <Route key='home' exact path='/' component={HomePageNav}/>
                    <Route key='register' exact path='/register' component={Register}/>
                    <Route key='login' exact path='/login' component={Login}/>
                    <Redirect to="/" />
                </Switch>
            )
        }
        return value;
    };

    return (

        <Router>
            <TopBarWithRouter />
            {indicator ?
                <div className={classes.root}>
                        <Grid container justify="center"
                              alignItems="center">
                            <Grid item justify="center"
                                  alignItems="center">
                                    <CircularProgress/>
                            </Grid>
                        </Grid>
                </div>
                :
                authCheck()
            }
        </Router>
    );
}

const HomePageNav = withRouter(Home);
const TopBarWithRouter = withFirebase(withRouter(ButtonAppBar));

