import React from 'react';
import {withFirebase} from "./Firebase";
import appRouter from './AppRouter'

class App extends React.Component {
    render() {
        return (
            <AppWithRouter/>
        );
    }
}
const AppWithRouter = withFirebase(appRouter);

export default App;
