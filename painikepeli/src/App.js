import React from 'react';
import {withFirebase} from "./Firebase";
import AppRouter from './AppRouter'
require('firebase/auth')

class App extends React.Component {
    render() {
        return (
            <AppWithRouter/>
        );
    }
}
const AppWithRouter = withFirebase(AppRouter);

export default App;
