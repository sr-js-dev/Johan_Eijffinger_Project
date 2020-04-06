import React, {Component} from 'react'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Dashboard from '../pages/Dashboard/dashboard_manage';
import User from '../pages/User/user_register';
import Order from '../pages/Order/order_manage';
import Deliveries from '../pages/Deliveries/deliveries_manage';
import Salesinvoices from '../pages/Salesinvoices/salesinvoices_manage';
import Returns from '../pages/Returns/returns_manage';
// import Orderdetail from '../pages/Order/order_detail';
// import Placemanage from '../pages/Placeorder/place_manage';
// import Paymentmanage from '../pages/Makepayment/payment_manage';
// import Invoices from '../pages/Invoice/invoice_manage';
import { Switch,Router, Route } from 'react-router-dom';
import history from '../history';

window.localStorage.setItem('AWT', true);
class Layout extends Component {
  
    render () {
      return (
          <Row style={{height:"100%"}}>
            <Sidebar/>
            <Col style={{paddingLeft:0, paddingRight:0, width: "75%"}}>
            <Header/>
                <Router history={history}>
                  <Switch>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/user" component={User}/>
                    <Route path="/orders" component={Order}/>
                    <Route path="/deliveries" component={Deliveries}/>
                    <Route path="/salesinvoices" component={Salesinvoices}/>
                    <Route path="/returns" component={Returns}/>
                    {/* <Route path="/order-detail" component={Orderdetail}/>
                    <Route path="/place-order" component={Placemanage}/>
                    <Route path="/make-payment" component={Paymentmanage}/>
                    <Route path="/invoices" component={Invoices}/> */}
                  </Switch>
                </Router>
            </Col>
            <div className="fade-display"></div>
          </Row>
      )
    };
  }
  export default Layout;
