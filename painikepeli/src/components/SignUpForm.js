import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom'


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    formControl: {
        margin: theme.spacing(3),
    }
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
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if ( !re.test(email) ) {
            setEmailError(true)
        }
    };

    const checkPassword = () => {
        setPasswordError(false);
        /*
        Password:
            At least 6
            Numerals
        */
        if (
            password.length < 8 || !password.match("[0-9]+")
        ) {
            setPasswordError(true)
        }
    };


    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
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
                        helperText={passwordError ? "Salasanan täytyy sisältää 8 merkkiä ja ainakin yksi numero" : null}
                    />
                    <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        className={classes.submit}
                        onClick={ async () => {
                            checkEmail();
                            checkPassword();
                            if (!emailError && !passwordError){
                                props.firebase
                                    .doCreateUserWithEmailAndPassword(email, password)
                                    .then( () => {
                                        console.log("peops", props)
                                        props.firebase.users().doc(props.firebase.getCurrentUser().uid).set({
                                            score: 20
                                        });
                                            setEmail("");
                                            setPassword("");
                                            props.history.push("/")
                                    });
                            }

                        }}
                    >
                        Rekisteröidy
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

