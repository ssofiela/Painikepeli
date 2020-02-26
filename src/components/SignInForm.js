import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState(false)

    const handleEmail = (newEmail) => {
        setEmail(newEmail);
    };
    const handlePassword = (newPassword) => {
        setPassword(newPassword);
    };


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h4">
                    Kirjaudu
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Sähköposti"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(event) => handleEmail(event.target.value)}
                        error={error}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Salasana"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(event) => handlePassword(event.target.value)}
                        error={error}
                        helperText={error ? "Sähköposti ja salasana eivät täsmää" : null}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        style={{backgroundColor: theme.palette.secondary.main}} //#f1fcff
                        className={classes.submit}
                        onClick={() => {
                            setError(false);
                            props.firebase
                                .doSignInWithEmailAndPassword(email, password)
                                .then(() => {
                                    setEmail("");
                                    setPassword("");
                                    props.history.push("/")
                                })
                                .catch((error) => {
                                    console.error(error);
                                    setError(true)
                                })
                        }}
                    >
                        <div style={{color: theme.palette.primary.light}}>Kirjaudu</div>
                    </Button>
                    <Link to="/register">{"Uusi käyttäjä? Luo tili"}</Link>
                </form>
            </div>
        </Container>
    );
}

