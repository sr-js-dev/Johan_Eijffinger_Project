import React, {Component} from 'react'
import { Route, Switch,Router } from 'react-router-dom';
import GuestLayout from './layout_guest'
import Login from '../pages/Signup/login.js'
import history from '../history';
// import './app.css'
import PrivateRoute from '../components/privateroute';
import Forgotpass from '../pages/Signup/forgotpassword.js'
import Resetpass from '../pages/Signup/resetpassword.js'

class App extends Component {
  render () {
    return (
      <Router history={history}>
         <Switch >
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={Forgotpass}/>
          <Route path="/reset-password" component={Resetpass} />
          <PrivateRoute path="/" component={GuestLayout} />
        </Switch>
      </Router>
     
    )
  };
}

export default App