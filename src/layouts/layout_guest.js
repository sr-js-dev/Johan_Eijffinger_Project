import React, {Component} from 'react'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Dashboard from '../pages/Dashboard/dashboard_manage';
import Order from '../pages/Order/order_manage';
import Orderdetail from '../pages/Order/order_detail';
import Placemanage from '../pages/Placeorder/place_manage';
import Paymentmanage from '../pages/Makepayment/payment_manage';
import Invoices from '../pages/Invoice/invoice_manage';
import { Switch,Router, Route } from 'react-router-dom';
import history from '../history';

window.localStorage.setItem('AWT', true);
class Layout extends Component {
  
    render () {
      return (
          <Row style={{height:"100%"}}>
            <Sidebar/>
            <Col style={{paddingLeft:0, paddingRight:0}}>
            <Header/>
                <Router history={history}>
                  <Switch>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/orders" component={Order}/>
                    <Route path="/order-detail" component={Orderdetail}/>
                    <Route path="/place-order" component={Placemanage}/>
                    <Route path="/make-payment" component={Paymentmanage}/>
                    <Route path="/invoices" component={Invoices}/>
                  </Switch>
                </Router>
            </Col>
          </Row>
      )
    };
  }
  export default Layout;
