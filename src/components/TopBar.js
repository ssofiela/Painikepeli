import React, {useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {theme} from '../utils/theme'

export default function ButtonAppBar(props) {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        props.firebase.auth.onAuthStateChanged(function (user) {
            setAuth(user)
        })
    }, []);

    return (
        <div>
            <AppBar position='static' style={{backgroundColor: theme.palette.secondary.main}}>
                <Toolbar>
                    <Grid item xs={2}>
                        <Button onClick={() => {
                            props.firebase.doSignOut().then(() => {
                                props.history.push('/login')
                            });
                        }
                        }>
                            {auth &&
                            <div style={{color: theme.palette.primary.light}}>Kirjaudu ulos</div>
                            }
                        </Button>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
}