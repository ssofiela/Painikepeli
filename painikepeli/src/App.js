import React from 'react';
import {withFirebase} from "./Firebase";
import AppRouter from './AppRouter'
import {theme} from './components/utils/theme'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
require('firebase/auth')


class App extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>

                <AppWithRouter/>
            </ThemeProvider>
        );
    }
}
const AppWithRouter = withFirebase(AppRouter);

export default App;
