import Button from '@material-ui/core/Button';
import React, {useState, useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import {theme} from './utils/theme'


const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 600,
        height: 450,
        //backgroundColor: theme.palette.primary.basic,


    },
    mobilePaper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: '100%',
        height: window.innerHeight,
        backgroundColor: theme.palette.primary.basic
    },

}));

/*
 Gaming view.
 */
const HomePage = props => {
    const classes = useStyles();

    const [ownPoints, setPoints] = useState(0);
    const [indicator, setIndicator] = useState(false);
    const [disableButton, setDisabledButton] = useState(false);
    const [stepsToWin, setStepsToWin] = useState(10);
    const [win, setWin] = useState(0);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        props.firebase.auth.onAuthStateChanged(function (user) {
            if (user) {
                setWin(-1);
                setIndicator(true);
                const calculatePoints = async () => {
                    let points = await props.firebase
                        .users()
                        .get()
                        .then(querySnapshot => {
                            return querySnapshot.docs.map(item => {
                                return {id: item.id, data: item.data()}
                            })
                        });
                    const ownId = props.firebase.getCurrentUser().uid;
                    for (let i = 0; i < points.length; i++) {
                        if (points[i].id === ownId) {
                            setIndicator(false);
                            setPoints(points[i].data.score)
                        }
                    }
                };
                calculatePoints();

                // Check if mobile device
                setMobile(window.innerWidth <= 500);
            }
        })

    }, []);

    // Parameter: global counter
    // Function does:
    //  1. Check if get a win. If win -> increase user points and alert
    //  2. How many steps to the next win
    const newScore = (points) => {

        // Check wins
        let win = 0;
        if (points % 500 === 0) {
            win = 250
        } else if (points % 100 === 0) {
            win = 40
        } else if (points % 10 === 0) {
            win = 5
        }
        if (win > 0) {
            props.firebase.users().doc(props.firebase.getCurrentUser().uid).update('score', props.firebase.firestore.FieldValue.increment(win))
        }

        setWin(win);

        setDisabledButton(false);
        setPoints(ownPoints + win - 1);

        // Check how many step(s) to the next win
        setStepsToWin(10 - (points % 10));
    };


    return (
        <div style={{backgroundColor: theme.palette.primary.basic, height: '100%'}}>
            <Paper className={mobile ? classes.mobilePaper : classes.paper} elevation={20}>
                {!indicator && win >= 0 ?
                    <div style={{flexDirection: 'row', marginBottom: 50, marginTop: 20}}>
                        <Grid style={{justifyContent: 'flex-start', width: '50%', display: 'inline-block'}}>
                            <div style={{
                                color: theme.palette.secondary.main,
                                fontSize: 16,
                                display: "inline",
                                fontFamily: 'Robato',
                                textTransform: 'uppercase'
                            }}>Saldo:
                            </div>
                            <div style={{
                                color: theme.palette.secondary.main,
                                fontSize: 28,
                                display: "inline",
                                fontFamily: 'Robato'
                            }}>{ownPoints} €
                            </div>
                        </Grid>
                        <Grid style={{justifyContent: 'flex-end', display: 'inline-block', width: '50%'}}>

                            <div style={{textAlign: 'right', fontWeight: 'bold'}}>
                                {win > 0 ?
                                    <div style={{
                                        color: '#1b5e20',
                                        textTransform: 'uppercase',
                                        fontFamily: 'Robato',
                                        fontSize: 24
                                    }}>Voitit {win} €</div>
                                    :
                                    <div style={{
                                        color: '#b71c1c',
                                        textTransform: 'uppercase',
                                        fontFamily: 'Robato',
                                        fontSize: 24
                                    }}>Ei voittoa</div>
                                }
                            </div>
                            <p style={{
                                textAlign: 'right',
                                fontFamily: 'Robato',
                                color: theme.palette.secondary.main,
                                marginTop: 4
                            }}>Seuraava voitto {stepsToWin} päästä</p>
                        </Grid>
                    </div>
                    :
                    <div style={{
                        height: 68,
                        marginTop: 20,
                        marginBottom: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h2 style={{
                            fontFamily: 'Robato',
                            color: theme.palette.secondary.main,
                            textAlign: 'center',
                            marginBottom: 10
                        }}>Tervetuloa pelaamaan arpa peliä</h2>
                        <Grid style={{justifyContent: 'center', textAlign: 'center'}}>
                            <p style={{
                                color: theme.palette.secondary.main,
                                alignItems: 'center',
                                fontSize: 16,
                                display: "inline",
                                fontFamily: 'Robato',
                                textTransform: 'uppercase'
                            }}>Saldo:</p>
                            <p style={{
                                color: theme.palette.secondary.main,
                                alignItems: 'center',
                                fontSize: 28,
                                display: "inline",
                                fontFamily: 'Robato'
                            }}>{ownPoints} €</p>
                        </Grid>
                    </div>

                }
                <Grid container justify='center'
                      alignItems='center'>
                    <Grid item justify='center'
                          alignItems='center'>
                        {indicator ?
                            <CircularProgress color={theme.palette.secondary.main}/>
                            :
                            (
                                <div>
                                    {ownPoints === 0 && !disableButton ?
                                        (
                                            <Button variant='outlined'
                                                    style={{
                                                        height: '250px',
                                                        width: '250px',
                                                        borderRadius: '50%',
                                                        borderWidth: 4,
                                                        borderColor: '#b71c1c'
                                                    }} onClick={() => {
                                                props.firebase.users().doc(props.firebase.getCurrentUser().uid).update('score', props.firebase.firestore.FieldValue.increment(20))
                                                setPoints(20)
                                            }
                                            }>
                                                <h4 style={{color: '#e53935', fontSize: 22}}>Aloita alusta</h4>
                                            </Button>
                                        )
                                        :
                                        (
                                            <Button variant='outlined' disabled={disableButton}
                                                    style={{
                                                        height: '250px',
                                                        width: '250px',
                                                        borderRadius: '50%',
                                                        borderColor: '#1b5e20',
                                                        borderWidth: 4
                                                    }}
                                                    onClick={async () => {
                                                        setDisabledButton(true);
                                                        props.firebase.users().doc(props.firebase.getCurrentUser().uid).update('score', props.firebase.firestore.FieldValue.increment(-1))
                                                        setPoints(ownPoints - 1)
                                                        // Update global counter and get the count
                                                        await props.firebase.clickCounter().doc('globalCounter').update('counter', props.firebase.firestore.FieldValue.increment(1))
                                                        let points = await props.firebase
                                                            .clickCounter()
                                                            .get()
                                                            .then(querySnapshot => {
                                                                return querySnapshot.docs.map(item => {
                                                                    return {id: item.id, data: item.data()}
                                                                })
                                                            });

                                                        {
                                                            newScore(points[0].data.counter)
                                                        }
                                                    }}>
                                                {disableButton ?
                                                    <CircularProgress color={theme.palette.secondary.main}/>
                                                    :
                                                    <h4 style={{color: '#43a047', fontSize: 22}}>Osta arpa (1€)</h4>
                                                }
                                            </Button>
                                        )

                                    }

                                </div>
                            )
                        }
                    </Grid>
                </Grid>
            </Paper>
            <Paper style={{
                backgroundColor: theme.palette.primary.basic,
                height: window.innerHeight,
                borderColor: theme.palette.primary.basic,
                boxShadow: 'none'
            }}>
            </Paper>
        </div>

    );
};

export default HomePage;
