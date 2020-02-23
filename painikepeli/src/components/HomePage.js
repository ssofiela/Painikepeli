import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';



const HomePage = props => {
    const [ownPoints, setPoints] = useState(0);
    const [indicator, setIndicator] = useState(false)

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
                    setIndicator(false)
                    setPoints(points[i].data.score)
                }
            }
        };
        calculatePoints();
    }, []);

    const newScore = (points) => {
        props.firebase.users().doc(props.firebase.getCurrentUser().uid).update("score", props.firebase.firestore.FieldValue.increment(-1))

        let win = 0;
        if (points % 500 === 0){
            alert("Voitit 250 pistettä");
            win = 250
        } else if (points % 100 === 0){
            alert("voitit 40 pistettä");
            win = 40
        } else if (points % 10 === 0) {
            alert("Voitit 5 pistettä");
            win = 5
        }
        props.firebase.users().doc(props.firebase.getCurrentUser().uid).update("score", props.firebase.firestore.FieldValue.increment(win))
        setPoints(ownPoints + win -1);

    };

    return (
        <div>
            {indicator ?
                <CircularProgress/>
                :
                (
                    <div>
                        <h1>moimoi hei</h1>
                        <h2>Minun saldoni: </h2>
                        <div>{ownPoints}</div>
                        <Button variant="outlined" size="large" color="primary" disabled={ownPoints <= 0}
                                onClick={async () => {
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
                            Click
                        </Button>
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
        </div>

    );
}

export default HomePage;
