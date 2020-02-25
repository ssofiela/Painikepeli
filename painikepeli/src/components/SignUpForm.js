import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link} from 'react-router-dom'
import {theme} from './utils/theme'


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


export default function Register(props) {
    const classes = useStyles();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);


    const handleEmail = (newEmail) => {
        setEmail(newEmail);
    };
    const handlePassword = (newPassword) => {
        setPassword(newPassword);
    };


    const checkEmail = () => {
        setEmailError(false);
        let re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        setEmailError(!re.test(email));
        return !re.test(email)
    };

    /*
    At least 8 characters
    Contains:
    1. Char
        1.1 Uppercase
        1.2 Lowercase
    2. Number
     */
    const checkPassword = () => {
        setPasswordError(false);
        if (
            password.length < 8 || !password.match('[0-9]+') || !password.match('[a-z]') || !password.match('[A-Z]')
        ) {
            setPasswordError(true);
            return true
        } else {
            return false
        }
    };


    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline/>
            <div onScroll={true} className={classes.paper}>
                <Typography component='h1' variant='h5'>
                    Luo käyttäjä
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='sähköposti'
                        name='email'
                        autoComplete='email'
                        autoFocus
                        onChange={(event) => handleEmail(event.target.value)}
                        error={emailError}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Salasana'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        onChange={(event) => handlePassword(event.target.value)}
                        error={passwordError}
                        helperText={passwordError ? 'Salasanan täytyy sisältää vähintään 8 merkkiä (pienikirjain, isokirjain ja numero)' : null}
                    />
                    <Button
                        fullWidth
                        variant='contained'
                        style={{backgroundColor: theme.palette.secondary.main}}
                        className={classes.submit}
                        onClick={() => {
                            const emailCorrectness = checkEmail();
                            const passwordCorrectness = checkPassword();
                            if (!emailCorrectness && !passwordCorrectness) {
                                props.firebase
                                    .doCreateUserWithEmailAndPassword(email, password)
                                    .then(() => {
                                        props.firebase.users().doc(props.firebase.getCurrentUser().uid).set({
                                            score: 20
                                        });
                                        setEmail('');
                                        setPassword('');
                                        props.history.push('/')
                                    });
                            }

                        }}
                    >
                        <div style={{color: theme.palette.primary.light}}>Rekisteröidy</div>
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to='/login'>
                                Vanha käyttäjä? Kirjaudu sisään
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

