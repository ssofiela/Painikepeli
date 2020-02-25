import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 600,
        height: 450

    },
    root: {
    },
}));

const HomePage = props => {
    const classes = useStyles();
    const [ownPoints, setPoints] = useState(0);
    const [indicator, setIndicator] = useState(false);
    const [disableButton, setDisabledButton] = useState(false);
    const [stepsToWin, setStepsToWin] = useState(10);
    const [win, setWin] = useState(0);
    const [mobile, setMobile] = useState(false)

    useEffect(() => {
        props.firebase.auth.onAuthStateChanged(function(user) {
            if(user) {
                setIndicator(true);
                const calculatePoints = async () => {
                    let points = await props.firebase
                        .users()
                        .get()
                        .then(querySnapshot => {
                            return querySnapshot.docs.map(item => {return {id:item.id, data: item.data()}})
                        });
                    const ownId = props.firebase.getCurrentUser().uid;
                    for (let i = 0; i < points.length; i++){
                        if (points[i].id === ownId) {
                            setIndicator(false);
                            setPoints(points[i].data.score)
                        }
                    }
                };
                calculatePoints();
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
            props.firebase.users().doc(props.firebase.getCurrentUser().uid).update("score", props.firebase.firestore.FieldValue.increment(win))
        }

        setWin(win);

        setDisabledButton(false);
        setPoints(ownPoints + win -1);

        // Check how many step(s) to the next win
        setStepsToWin(10 - (points % 10));



    };


    return (
        <div>
        <div className={classes.root} >
            <Paper className={classes.paper} style={{backgroundColor: '#f1fcff', borderRadius: '1%'}}>
                {!indicator &&
                <h3>Saldo: {ownPoints} €</h3>
                }
                <Grid container justify="center"
                      alignItems="center">
                    <Grid item justify="center"
                          alignItems="center">
                        {indicator ?
                            <CircularProgress/>
                            :
                            (
                                <div>
                                    {ownPoints === 0 && !disableButton ?
                                        (
                                            <Button variant="outlined" color="red"
                                                    style={{height: '250px', width: '250px', borderRadius: "50%"}} onClick={() => {
                                                props.firebase.users().doc(props.firebase.getCurrentUser().uid).update("score", props.firebase.firestore.FieldValue.increment(20))
                                                setPoints(20)
                                            }
                                            }>
                                                <h4 style={{color: 'red'}}>Aloita alusta</h4>
                                            </Button>
                                        )
                                            :
                                        (
                                            <Button variant="outlined" color="green" disabled={disableButton}
                                                    style={{height: '250px', width: '250px', borderRadius: "50%"}}
                                                    onClick={async () => {
                                                        setDisabledButton(true);
                                                        props.firebase.users().doc(props.firebase.getCurrentUser().uid).update("score", props.firebase.firestore.FieldValue.increment(-1))
                                                        setPoints(ownPoints - 1)
                                                        // Update global counter and get the count
                                                        await props.firebase.clickCounter().doc("globalCounter").update("counter", props.firebase.firestore.FieldValue.increment(1))
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
                                                    <CircularProgress/>
                                                    :
                                                    <h4 style={{color: 'green'}}>Osta arpa (1€)</h4>
                                                }
                                            </Button>
                                        )

                                    }

                                </div>
                            )
                        }
                    </Grid>
                </Grid>
                {!indicator && !disableButton ?
                <div>
                    <h5 style={{textAlign: 'left', position: 'absolute', fontFamily: 'Robato'}}>Seuraava voitto: {stepsToWin} päästä</h5>
                    <h4 style={{fontWeight: 'bold'}}>{win > 0 ? `Voitit ${win} €` : 'Ei voittoa'}</h4>
                </div>
                    : null
                }

            </Paper>
        </div>
        </div>

    );
}

export default HomePage;
