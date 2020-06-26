import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import API from '../../factories/api';
import SessionManager from '../../factories/session_manage';
import Axios from 'axios';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import "react-datepicker/dist/react-datepicker.css";
import 'datatables.net';
import history from '../../history';
import * as Common from '../../factories/common';
// import Filtercomponent from '../../components/filtercomponent';
import Pagination from '../../components/pagination_order';
import Pageloadspiiner from '../../components/page_load_spinner';
import * as Auth from '../../factories/auth';
import Sweetalert from 'sweetalert';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Returnordersform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            loading: false,
            ordersData: [],
            originFilterData: [],
            filterColunm: [
                {"label": '', "value": "", "type": 'text', "show": true},
                {"label": 'Order', "value": "DocNum", "type": 'text', "show": true},
                {"label": 'Order_Date', "value": "DocDate", "type": 'date', "show": true},
                {"label": 'Status', "value": "Status", "type": 'text', "show": true},
                {"label": 'Product', "value": "Product", "type": 'text', "show": true},
                {"label": 'ItemCode', "value": "ItemCode", "type": 'text', "show": true},
                {"label": 'Quantity', "value": "Quantity", "type": 'text', "show": true},
                {"label": 'Batch', "value": "BatchNumbers", "type": 'text', "show": true},
            ],
            pageLodingFlag: false,
            pages:[{"value":"all","label":"all"}, {"value":5,"label":5}, {"value":10,"label":10}, {"value":20,"label":20}, {"value":30,"label":30}, {"value":40,"label":40}],
            obj: this,
            recordNum: 0,
            filterDataFlag: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this.getRecordNum(null);
        this.getOrdersData(5, 1);
       
    }

    getRecordNum = () => {
        this._isMounted = true;
        var settings = {
            "url": API.GetOrdersData+"?top=5",
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            this.setState({recordNum: response['@odata.count']})
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    getOrdersData (pageSize, page, data, search) {
        this._isMounted = true;
        this.setState({loading: true});
        var settings = {
            "url": API.GetOrdersData+"?top="+pageSize+"&skip="+page,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+Auth.getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            if(this._isMounted){
                if(!data){
                    this.setState({ordersData: response.value, originFilterData: response.value});
                }else{
                    this.setState({ordersData: data});
                }
                this.setState({loading:false})
                $('#order-table').dataTable().fnDestroy();
                if(this.state.filterDataFlag){
                    $('#order-table').dataTable().fnDestroy();
                    $('#order-table').DataTable(
                        {
                            "language": {
                                "lengthMenu": trls("Show")+" _MENU_ "+trls("Result_on_page"),
                                "zeroRecords": "Nothing found - sorry",
                                "info": trls("Show_page")+" _PAGE_ "+trls('Results_of')+" _PAGES_",
                                "infoEmpty": "No records available",
                                "infoFiltered": "(filtered from _MAX_ total records)",
                                "search": trls('Search'),
                                "paginate": {
                                  "previous": trls('Previous'),
                                  "next": trls('Next')
                                }
                            },
                            "searching": false,
                            "dom": 't<"bottom-datatable" lip>',
                            "ordering": false
                        }
                    );
                }
            }
        });
    }

    showOrderDetail = (orderId) => {
        history.push({
            pathname: '/order-detail/'+orderId,
            state: { id: orderId, newSubmit:true }
          })
    }

    removeColumn = (value) => {
        let filterColunm = this.state.filterColunm;
        filterColunm = filterColunm.filter(function(item, key) {
            if(item.label===value){
            item.show = false;
            }
            return item;
        })
        this.setState({filterColunm: filterColunm})
    }

    showColumn = (value) => {
        let filterColum = this.state.filterColunm;
        filterColum = filterColum.filter((item, key)=>item.label===value);
        return filterColum[0].show;
    }

    // filter module
    filterOptionData = (filterOption) =>{
        let dataA = []
        dataA = Common.filterData(filterOption, this.state.originFilterData);
        if(!filterOption.length){
            this.setState({filterDataFlag: false});
            dataA=null;
        }else{
            this.setState({filterDataFlag: true});
        }
        this.getOrdersData(dataA);
    }

    changeFilter = () => {
        if(this.state.filterFlag){
            this.setState({filterFlag: false})
        }else{
            this.setState({filterFlag: true})
        }
    }

    changeOrderCheck = (value, id) => {
        let ordersData = this.state.ordersData;
        ordersData.map((item, index)=>{
            if(item.id__===id){
                item.checked=value;
            }
            return item;
        })
        this.setState({ordersData: ordersData});
    }

    orderReturn = () => {
        const { patternRowId } = this.props;
        Sweetalert({
            title: trls("Are you sure?"),
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.returnOrderLine(patternRowId);
            //     Sweetalert("Success!", {
            //     icon: "success",
            //   });
            } else {
            }
        });
    }

    returnOrderLine = () => {
        let ordersData = this.state.ordersData;
        ordersData = ordersData.filter(function(item, key) {
            return item.checked;
        })
        let orderLenght = ordersData.length;
        let documentLineArray = [];
        let lineArray = [];
        ordersData.map((data, index)=>{
            documentLineArray = [];
            lineArray = [];
            lineArray = {
                ItemCode: data.ItemCode,
                Quantity: data.Quantity,
                Price: data.Price
            }
            documentLineArray.push(lineArray);
            let params = {
                "requestData": {
                    "CardCode": data.CardCode,
                    "DocDate": Common.formatDate1(data.DocDate),
                    "DocDueDate": Common.formatDate1(data.DocDueDate),
                    "AddressExtension": {
                    },
                    "DocumentLines": documentLineArray
                },
                "parameters": {
                }
            }
            var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.ReturnOrder, params, headers)
            .then(result => {
                if(index===orderLenght-1){
                    Sweetalert("Success!", {
                        icon: "success",
                    });
                }
                            })
            .catch(err => {
                if(err.response.status===401){
                    history.push('/login')
                }
            })
            return data;
        })
    }

    render(){
        const {filterColunm, ordersData, pageLodingFlag} = this.state;
        console.log('222223232', ordersData);
        return (
            <Modal
                show={this.props.show}
                onHide={()=>this.props.onHide()}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Orders')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="order_div return-order_div">
                    <div className="orders">
                        <Row>
                            <Col sm={6} className="return-order-form_header">
                                <Button variant="primary" onClick = {()=>this.orderReturn()}><i className="fas fa-undo add-icon"></i>{trls('Return')}</Button> 
                            </Col>
                            {/* <Col sm={6} className="has-search">
                                <div style={{display: 'flex', float: 'right'}}>
                                    <Button variant="light" onClick={()=>this.changeFilter()}><i className="fas fa-filter add-icon"></i>{trls('Filter')}</Button>
                                    <div style={{marginLeft: 20}}>
                                        <span className="fa fa-search form-control-feedback"></span>
                                        <Form.Control className="form-control fitler" type="text" name="number"placeholder={trls("Quick_search")}/>
                                    </div>
                                </div>
                            </Col> */}
                            {/* {filterColunm.length&&(
                                <Filtercomponent
                                    onHide={()=>this.setState({filterFlag: false})}
                                    filterData={filterData}
                                    onFilterData={(filterOption)=>this.filterOptionData(filterOption)}
                                    showFlag={this.state.filterFlag}
                                />
                            )} */}
                        </Row>
                        <div className="table-responsive credit-history">
                            <table id="order-table" className="place-and-orders__table table return-order__table" width="100%">
                            <thead>
                                <tr>
                                    {filterColunm.map((item, key)=>(
                                        <th className={!item.show ? "filter-show__hide" : ''} key={key} style={item.value==="Action" ? {width: 25} : {}}>
                                            {trls(item.label) ? trls(item.label) : ''}
                                            {/* <Contextmenu
                                                triggerTitle = {item.label}
                                                addFilterColumn = {(value)=>this.addFilterColumn(value)}
                                                removeColumn = {(value)=>this.removeColumn(value)}
                                            /> */}
                                        </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            {ordersData && !this.state.loading &&(<tbody >
                                {
                                    ordersData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td><Form.Check type="checkbox" onChange={(evt)=>this.changeOrderCheck(evt.target.checked, data.id__)}/></td>
                                            <td className={!this.showColumn(filterColunm[0].label) ? "filter-show__hide" : ''}><div id={data.id} className="action-div" onClick={()=>this.showPlaceOrder(data.DocNum)}>{data.DocNum}</div></td>
                                            <td className={!this.showColumn(filterColunm[1].label) ? "filter-show__hide" : ''}>{Common.formatDate(data.DocDate)}</td>
                                            <td className={!this.showColumn(filterColunm[2].label) ? "filter-show__hide" : ''}><div className={data.OpenQty > 0 ? "order-open__state" : "order-Send__state"}>{data.OpenQty > 0 ? "Open" : 'Send'}</div></td>
                                            <td className={!this.showColumn(filterColunm[3].label) ? "filter-show__hide" : ''}><img src={data.picture ? "data:image/png;base64,"+data.picture : ''} alt={data.picture ? i : ''} className = "image__zoom"></img> {data.ItemName}</td>
                                            <td className={!this.showColumn(filterColunm[4].label) ? "filter-show__hide" : ''}>{data.ItemCode}</td>
                                            <td className={!this.showColumn(filterColunm[5].label) ? "filter-show__hide" : ''}>{data.Quantity}</td>
                                            <td className={!this.showColumn(filterColunm[6].label) ? "filter-show__hide" : ''}>{data.BatchNumbers}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>)}
                        </table>
                            {!this.state.filterDataFlag&&(
                                <Pagination
                                    recordNum={this.state.recordNum}
                                    getData={(pageSize, page)=>this.getOrdersData(pageSize, page)}
                                />
                            )}
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
                    <Pageloadspiiner loading = {pageLodingFlag}/>
                </div>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Returnordersform);