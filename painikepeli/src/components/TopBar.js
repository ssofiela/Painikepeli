import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    }
}));

export default function ButtonAppBar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{backgroundColor: '#e1f8fd'}}>
                <Toolbar>
                    <Grid item xs={2}>
                        <Button onClick={() => {
                            props.firebase.doSignOut().then(() => {
                                props.history.push('/login')
                            });}
                        }>
                            Kirjaudu ulos
                        </Button>
                    </Grid>
                </Toolbar>

            </AppBar>
        </div>
    );
}