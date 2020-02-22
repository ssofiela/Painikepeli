import React from 'react';
import Button from '@material-ui/core/Button';

const homePage = props => {

    return (
        <div>
            <h1>moimoi hei</h1>
            <Button variant="outlined" size="large" color="primary" onClick={() => {
                {console.log("counter", props)}
                props.firebase.clickCounter().doc("globalCounter").update("counter", props.firebase.firestore.FieldValue.increment(10))
            }}>
                Click
            </Button>
        </div>

    );
}

export default homePage;
