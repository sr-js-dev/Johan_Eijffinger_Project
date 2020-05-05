import React, {Component} from 'react'
import { Route, Switch,Router } from 'react-router-dom';
import GuestLayout from './layout_guest'
import Login from '../pages/Signup/login.js'
import history from '../history';
// import './app.css'
import PrivateRoute from '../components/privateroute';
import Forgotpass from '../pages/Signup/forgotpassword.js'
import Resetpass from '../pages/Signup/resetpassword.js'
import Userprofile from '../pages/User/userprofile';
import { LastLocationProvider } from 'react-router-last-location';

class App extends Component {
  render () {
    return (
      <Router history={history}>
        <LastLocationProvider>
          <Switch >
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={Forgotpass}/>
            <Route path="/reset-password" component={Resetpass} />
            <PrivateRoute path="/profile" component={Userprofile}/>
            <PrivateRoute path="/" component={GuestLayout} />
          </Switch>
        </LastLocationProvider>
      </Router>
     
    )
  };
}

export default App