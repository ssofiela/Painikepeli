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
        height: 500

    },
    root: {
    },
}));

const HomePage = props => {
    const classes = useStyles();
    const [ownPoints, setPoints] = useState(0);
    const [indicator, setIndicator] = useState(false);
    const [disableButton, setDisabledButton] = useState(false);

    useEffect(() => {
        setIndicator(true)
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
    }, []);

    // Parameter: global counter
    // Function does:
    //  1. decrease 1 point
    //  2. Check if get a win. If win -> increase user points
    //  3. How many steps to the next win
    const newScore = (points) => {
        let win = 0;
        if (points % 500 === 0 || points % 100 === 0 || points % 10 === 0) {
            const fiveHundred = points % 500 < 10 && points % 500 > 0;
            const oneHundred = points % 100 < 10 && points % 100 > 0;
            let nextWin = 0;
            if (fiveHundred || oneHundred) {
                if (points % 500 < points % 100) {
                    nextWin = points % 500
                } else {
                    nextWin = points % 100
                }
            } else {
                nextWin = 10
            }
            if (points % 500 === 0) {
                alert(`Voitit 250 pistettä\n Uusi voitto ${nextWin} painalluksen päästä`);
                win = 250
            } else if (points % 100 === 0) {
                alert(`Voitit 40 pistettä\n Uusi voitto ${nextWin} painalluksen päästä`);
                win = 40
            } else if (points % 10 === 0) {
                alert(`Voitit 5 pistettä\n Uusi voitto ${nextWin} painalluksen päästä`);
                win = 5
            }
            props.firebase.users().doc(props.firebase.getCurrentUser().uid).update("score", props.firebase.firestore.FieldValue.increment(win))

        }
        setDisabledButton(false);
        setPoints(ownPoints + win -1);

    };

    return (
        <div>
        <div className={classes.root} >
            <Paper className={classes.paper} >
                <Grid container justify="center"
                      alignItems="center">
                    <Grid item justify="center"
                          alignItems="center">
                        {indicator ?
                            <CircularProgress/>
                            :
                            (
                                <div>
                                    <div style={{flexDirection: 'column', display: 'flex'}}>
                                        <h1>Painkikepeli</h1>
                                        <div style={{flexDirection: 'row'}}>
                                            <div>Pisteeni: </div>
                                            <div>{ownPoints}</div>
                                        </div>
                                    </div>
                                    <Button variant="outlined" color="primary" style={{height: '250px', width: '250px'}} disabled={ownPoints <= 0 || disableButton}
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
                                            <div>Painike</div>
                                        }
                                    </Button>
                                    {/* Give a possibility to start again (get 20 points) */}
                                    {ownPoints === 0 &&
                                    <Button variant="outlined" size="large" color="primary" onClick={() => {
                                        props.firebase.users().doc(props.firebase.getCurrentUser().uid).update("score", props.firebase.firestore.FieldValue.increment(20))
                                        setPoints(20)
                                    }
                                    }>
                                        Aloita alusta
                                    </Button>
                                    }
                                </div>
                            )
                        }
                    </Grid>
                </Grid>
            </Paper>
        </div>
        </div>

    );
}

export default HomePage;
