import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import { Row, Col } from 'react-bootstrap';
// import SessionManager from '../../components/session_manage';
import Select from 'react-select';
// import API from '../../components/api'
// import Axios from 'axios';
// import * as Auth from '../../components/auth'
// import  { Link } from 'react-router-dom';
// import * as authAction  from '../../actions/authAction';
// import Slider from 'react-bootstrap-slider';
// import "bootstrap-slider/dist/css/bootstrap-slider.css"
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'datatables.net';
import history from '../../history';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Ordermanage extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        $('#example thead tr').clone(true).appendTo( '#example thead' );
        $('#example thead tr:eq(1) th').each( function (i) {
            $(this).html( '<input type="text" class="search-table-input" style="width: 100%" placeholder="Search" />' );
            $(this).addClass("sort-style");
            $( 'input', this ).on( 'keyup change', function () {
                if ( table.column(i).search() !== this.value ) {
                    table
                        .column(i)
                        .search( this.value )
                        .draw();
                }
            } );
        } );
        $('#example').dataTable().fnDestroy();
        var table = $('#example').DataTable(
            {
              "language": {
                  "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
                  "zeroRecords": "Nothing found - sorry",
                  "info": trls("Show_page")+" _PAGE_ of _PAGES_",
                  "infoEmpty": "No records available",
                  "infoFiltered": "(filtered from _MAX_ total records)",
                  "search": trls('Search'),
                  "paginate": {
                    "previous": trls('Previous'),
                    "next": trls('Next')
                  }
              },
                orderCellsTop: true,
                fixedHeader: true
            }
          );
    }

    showOrderDetail = (orderId) => {
        history.push({
            pathname: '/order-detail/'+orderId,
            state: { id: orderId, newSubmit:true }
          })
    }
    
    render(){   
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <div id="google_translate_element"></div>
                    <h2 className="title">{trls("Orders")}</h2>
                </div>
                <div className="orders">
                    <Row className="order_filter">
                        <Col md={2} style={{paddingLeft: 0, paddingTop: 10}}>
                            <Select
                                name="filter"
                                //options={}
                                className="select-order_view-filter"
                                onChange={val => this.setState({showMode: val.value})}
                                //defaultValue={}
                            />
                        </Col>
                        <Col lg={4} xl={3} style={{display: "flex", marginRight: 30, paddingLeft: 0, paddingTop: 10}}>
                            <span style={{marginTop:6}}>{trls('Order_Date')}</span>
                            <div style={{display: "flex", paddingLeft: 12}}>
                                <Select
                                    name="filter"
                                    //options={}
                                    className="select-invoice_credit-no"
                                    onChange={val => this.setState({showMode: val.value})}
                                    //defaultValue={}
                                />
                                <Select
                                    name="filter"
                                    //options={}
                                    className="select-invoice_credit-no"
                                    onChange={val => this.setState({showMode: val.value})}
                                    //defaultValue={}
                                />
                            </div>
                        </Col>
                        <Col lg={4} xl={3} style={{display: "flex", paddingLeft: 0, paddingTop: 10}}>
                            <span style={{marginTop:6}}>{trls('Shipping_Date')}</span>
                            <div style={{display: "flex"}}>
                                <DatePicker name="startdate" className="myDatePicker order-filter_date" dateFormat="dd-MM-yyyy" selected={new Date()} onChange={date =>this.setState({startdate:date})} />
                                <DatePicker name="startdate" className="myDatePicker order-filter_date" dateFormat="dd-MM-yyyy" selected={new Date()} onChange={date =>this.setState({startdate:date})} />
                            </div>
                        </Col>
                    </Row>
                    <div className="table-responsive">
                            <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls("CreditNotNo")}</th>
                                    <th>SO No.</th>
                                    <th>{trls("DateCreated")}</th>
                                    <th>{trls("Amount")}</th>
                                    <th>{trls("Balance")}</th>
                                    <th>{trls("Currency")}</th>
                                    <th>{trls("Applied_by")}</th>
                                    <th>{trls("Status")}</th>
                                    <th>{trls("Download")}</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <a href="/#">7002827</a>
                                </td>
                                <td>
                                    <a href="/#">5373732</a>
                                </td>
                                <td>22/04/18</td>
                                <td>10.00</td>
                                <td>0.00</td>
                                <td>EUR</td>
                                <td>James Cornfield</td>
                                <td>
                                    <div className="table-status">
                                        <img src={require("../../assets/images/icon-verified.svg")} alt="verified"/>
                                        <span>Applied</span>
                                    </div>
                                </td>
                                <td>
                                    <img src={require("../../assets/images/icon-pdf.svg")} alt="pdf"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a href="/#">7002827</a>
                                </td>
                                <td>
                                    <a href="/#">5373732</a>
                                </td>
                                <td>22/04/18</td>
                                <td>10.00</td>
                                <td>0.00</td>
                                <td>EUR</td>
                                <td>---</td>
                                <td>
                                    <div className="table-status">
                                        <img src={require("../../assets/images/icon-exclamation-red.svg")} alt="exclamation"/>
                                        <span>Not Applied</span>
                                    </div>
                                </td>
                                <td>
                                    <img src={require("../../assets/images/icon-pdf.svg")} alt="pdf"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a href="/#">7002827</a>
                                </td>
                                <td>
                                    <a href="/#">5373732</a>
                                </td>
                                <td>22/04/18</td>
                                <td>10.00</td>
                                <td>0.00</td>
                                <td>EUR</td>
                                <td>---</td>
                                <td>
                                    <div className="table-status">
                                        <img src={require("../../assets/images/icon-warning.svg")} alt="warning"/>
                                        <span>Part Applied</span>
                                    </div>
                                </td>
                                <td>
                                    <img src={require("../../assets/images/icon-pdf.svg")} alt="pdf"/>
                                </td>
                            </tr>
                                
                            </tbody>
                        </table>
                        { this.state.loading&& (
                        <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                            <BallBeat
                                color={'#222A42'}
                                loading={this.state.loading}
                            />
                        </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Ordermanage);