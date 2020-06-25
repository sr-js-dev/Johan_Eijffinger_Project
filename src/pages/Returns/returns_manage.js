import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../factories/translate';
import { Row, Col, Button, Form } from 'react-bootstrap';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
import Axios from 'axios';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import "react-datepicker/dist/react-datepicker.css";
import 'datatables.net';
import history from '../../history';
import * as Common from '../../factories/common';
import Filtercomponent from '../../components/filtercomponent';
import Returnorders from './retunrorders_form';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Deliveriesmanage extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            loading: false,
            deliveriesData: [],
            originFilterData: [],
            filterColunm: [
                {"label": 'Return #', "value": "DocNum", "type": 'text', "show": true},
                {"label": 'ReturnDate', "value": "DocDate", "type": 'date', "show": true},
                {"label": 'Status', "value": "LineStatus", "type": 'text', "show": true},
                {"label": 'Product', "value": "Product", "type": 'text', "show": true},
                {"label": 'Collection', "value": "Collectie", "type": 'text', "show": true},
                {"label": 'Quantity', "value": "Quantity", "type": 'text', "show": true},
                {"label": 'Batch', "value": "BatchNumbers", "type": 'text', "show": true},
                {"label": 'Action', "value": "Action", "type": 'text', "show": true},
            ],
            showOrdersForm: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this.getDeliveriesData();
    }

    getDeliveriesData = (data) => {
        this._isMounted = true;
        this.setState({loading:true})
        let params = {};
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetReturnsData, params, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({loading:false});
                // if(result.data.value.length){
                    let deliveriesDataList = this.setDeliveriesData(result.data.value);
                    if(!data){
                        this.setState({deliveriesData: deliveriesDataList, originFilterData: deliveriesDataList});
                    }else{
                        this.setState({deliveriesData: data});
                    }
                    $('.fitler').on( 'keyup', function () {
                        table.search( this.value ).draw();
                    } );
                    $('#deliver-table').dataTable().fnDestroy();
                    var table = $('#deliver-table').DataTable(
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
                              "dom": 't<"bottom-datatable" lip>'
                          }
                      );
                }
            // }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        });
    }

    setDeliveriesData = (deliveriesData) => {
        let returnDeliveriesData = [];
        let documentLineData = [];
        deliveriesData.map((data, index)=>{
            data.DocumentLines.map((documentLine, key)=>{
                if(documentLine.TreeType==="iSalesTree"){
                    documentLineData = documentLine;
                    documentLineData.DocDate = data.DocDate;
                    documentLineData.CardName = data.CardName;
                    documentLineData.DocNum = data.DocNum;
                    returnDeliveriesData.push(documentLineData);
                }
                return documentLine;
            })
            return data;
        });
        return returnDeliveriesData;
    }

    showPlaceOrder = (docNumber) => {
        history.push({
            pathname: '/return-detail/'+docNumber,
            state: { id: docNumber, newSubmit:true }
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
            dataA=null;
        }
        this.getDeliveriesData(dataA);
    }

    changeFilter = () => {
        if(this.state.filterFlag){
            this.setState({filterFlag: false})
        }else{
            this.setState({filterFlag: true})
        }
    }
    // filter module
    getFileDownLoad = (data) => {
        this.setState({pageLodingFlag: true})
        this._isMounted = true;
        let params = {
            objectId: "returns",
            keyValue: data.DocNum
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetDownloadFile, params, headers)
        .then(result => {
            if(result.data.pdf){
                this.setState({pageLodingFlag: false})
                this.downloadWithName("data:application/octet-stream;charset=utf-16le;base64,"+result.data.pdf, data.ItemCode+'.pdf');
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        })
    }
    
    render(){   
        const {filterColunm, deliveriesData} = this.state;
        let filterData = [
            {"label": trls('Order'), "value": "DocNum", "type": 'text', "show": true},
            {"label": trls('Order_Date'), "value": "DocDate", "type": 'date', "show": true},
            {"label": trls('Product'), "value": "ItemDescription", "type": 'text', "show": true},
            {"label": trls('Collection'), "value": "ItemCode", "type": 'text', "show": true},
            {"label": trls('Quantity'), "value": "Quantity", "type": 'text', "show": true},
            {"label": trls('Batch'), "value": "BatchNumbers", "type": 'text', "show": true},
        ]
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <div id="google_translate_element"></div>
                    <h2 className="title">{trls("Returns")}</h2>
                </div>
                <div className="orders">
                    <Row>
                        <Col sm={6}>
                            <Button variant="primary" onClick={()=>this.setState({showOrdersForm: true})}><i className="fas fa-plus add-icon"></i>{trls('Add return')}</Button> 
                        </Col>
                        <Col sm={6} className="has-search">
                            <div style={{display: 'flex', float: 'right'}}>
                                <Button variant="light" onClick={()=>this.changeFilter()}><i className="fas fa-filter add-icon"></i>{trls('Filter')}</Button>
                                <div style={{marginLeft: 20}}>
                                    <span className="fa fa-search form-control-feedback"></span>
                                    <Form.Control className="form-control fitler" type="text" name="number"placeholder={trls("Quick_search")}/>
                                </div>
                            </div>
                        </Col>
                        {filterColunm.length&&(
                            <Filtercomponent
                                onHide={()=>this.setState({filterFlag: false})}
                                filterData={filterData}
                                onFilterData={(filterOption)=>this.filterOptionData(filterOption)}
                                showFlag={this.state.filterFlag}
                            />
                        )}
                    </Row>
                    <div className="table-responsive credit-history">
                        <table id="deliver-table" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                {filterColunm.map((item, key)=>(
                                    <th className={!item.show ? "filter-show__hide" : ''} key={key}>
                                       {item.label}
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
                        {deliveriesData && !this.state.loading &&(<tbody >
                            {
                                deliveriesData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td className={!this.showColumn(filterColunm[0].label) ? "filter-show__hide" : ''}><div id={data.id} className="action-div" onClick={()=>this.showPlaceOrder(data.DocNum)}>{data.DocNum}</div></td>
                                        <td className={!this.showColumn(filterColunm[1].label) ? "filter-show__hide" : ''}>{Common.formatDate(data.DocDate)}</td>
                                        <td className={!this.showColumn(filterColunm[2].label) ? "filter-show__hide" : ''}><div className={data.OpenAmount > 0 ? "order-open__state" : "order-Send__state"}>{data.OpenAmount > 0 ? "Open" : 'Send'}</div></td>
                                        <td className={!this.showColumn(filterColunm[3].label) ? "filter-show__hide" : ''}><img src={data.picture ? "data:image/png;base64,"+data.picture : ''} alt={data.picture ? i : ''} className = "image__zoom"></img> {data.ItemDescription}</td>
                                        <td className={!this.showColumn(filterColunm[4].label) ? "filter-show__hide" : ''}>{data.ItemCode}</td>
                                        <td className={!this.showColumn(filterColunm[5].label) ? "filter-show__hide" : ''}>{data.Quantity}</td>
                                        <td className={!this.showColumn(filterColunm[6].label) ? "filter-show__hide" : ''}>{data.BatchNumbers}</td>
                                        <td className={!this.showColumn(filterColunm[7].label) ? "filter-show__hide" : ''}>
                                            <Row style={{justifyContent: "space-around", width: 70}}>
                                                <i className="far fa-file-pdf add-icon" onClick={()=>this.getFileDownLoad(data)}><span className="action-title"></span></i>
                                                {/* <i className="fas fa-trash-alt add-icon"><span className="action-title"></span></i> */}
                                            </Row>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>)}
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
                    <Returnorders
                        show={this.state.showOrdersForm}
                        onHide={() => this.setState({showOrdersForm: false})}
                    /> 
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Deliveriesmanage);