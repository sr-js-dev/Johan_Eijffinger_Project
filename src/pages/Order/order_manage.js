import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
// import { Row, Col } from 'react-bootstrap';
// import SessionManager from '../../components/session_manage';
// import Select from 'react-select';
// import API from '../../components/api'
// import Axios from 'axios';
// import * as Auth from '../../components/auth'
// import  { Link } from 'react-router-dom';
// import * as authAction  from '../../actions/authAction';
// import Slider from 'react-bootstrap-slider';
// import "bootstrap-slider/dist/css/bootstrap-slider.css"
// import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
// import DatePicker from "react-datepicker";
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
        // $('#example').dataTable().fnDestroy();
        // var table = $('#example').DataTable(
        //     {
        //       "language": {
        //           "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
        //           "zeroRecords": "Nothing found - sorry",
        //           "info": trls("Show_page")+" _PAGE_ of _PAGES_",
        //           "infoEmpty": "No records available",
        //           "infoFiltered": "(filtered from _MAX_ total records)",
        //           "search": trls('Search'),
        //           "paginate": {
        //             "previous": trls('Previous'),
        //             "next": trls('Next')
        //           }
        //       },
        //         orderCellsTop: true,
        //         fixedHeader: true,
        //         "searching": false,
        //         "dom": 't<"bottom-datatable" lip>'
        //     }
        //   );
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
                    <div className="table-responsive">
                        <table id="example" className=" table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls("Product")}</th>
                                    <th>{trls("Collection")}</th>
                                    <th>{trls("Quantity")}</th>
                                    <th>{trls("Your_order_reference")}</th>
                                    <th>{trls("Batch")}</th>
                                    <th>{trls("Price")}</th>
                                    <th>{trls("Invoice")}</th>
                                    <th>{trls("InvoiceDate")}</th>
                                    <th>{trls("OrderNumber")}</th>
                                    <th>{trls("Download")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div style={{cursor: "pointer", color:'#004388', fontSize:"14px", fontWeight:'bold'}} onClick={()=>this.showOrderDetail(72827193)}>301629</div>
                                    </td>
                                    <td>WALLPOWER WANTED</td>
                                    <td>1.00</td>
                                    <td></td>
                                    <td>19394</td>
                                    <td>132.77</td>
                                    <td style={{textDecoration: 'underline'}}>VF1238474</td>
                                    <td>03/10/19</td>
                                    <td>VK222558</td>
                                    <td>
                                        <img src={require("../../assets/images/icon-pdf.svg")} alt="pdf"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{cursor: "pointer", color:'#004388', fontSize:"14px", fontWeight:'bold'}} onClick={()=>this.showOrderDetail(72827193)}>301633</div>
                                    </td>
                                    <td>WALLPOWER WANTED</td>
                                    <td>1.00</td>
                                    <td></td>
                                    <td>19366</td>
                                    <td>112.12</td>
                                    <td style={{textDecoration: 'underline'}}>VF1236607</td>
                                    <td>19/09/19</td>
                                    <td>VK221161</td>
                                    <td>
                                        <img src={require("../../assets/images/icon-pdf.svg")} alt="pdf"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{cursor: "pointer", color:'#004388', fontSize:"14px", fontWeight:'bold'}} onClick={()=>this.showOrderDetail(72827193)}>310012</div>
                                    </td>
                                    <td>BISOU DE MME PITOU</td>
                                    <td>1.00</td>
                                    <td></td>
                                    <td>10</td>
                                    <td>22.93</td>
                                    <td style={{textDecoration: 'underline'}}>VF1233104</td>
                                    <td>15/08/19</td>
                                    <td>VK219784</td>
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