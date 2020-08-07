import React, {Component} from 'react'
import { Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as authAction  from '../../actions/authAction';
import SessionManager from '../../factories/session_manage';
import API from '../../factories/api'
import Axios from 'axios';
import { trls } from '../../factories/translate';
import * as Common from '../../factories/common';
import { BallBeat } from 'react-pure-loaders';
import history from '../../history';


const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
    removeState: () =>
        dispatch(authAction.blankdispatch()),
});

class Itemsearchform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            itemData: [],
            loading: false,
            selectedItem: {},
            itemCode: props.itemCode? props.itemCode: '',
            selectedIndex: -1
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    handleSubmit = (event) => {
        this._isMounted = true;
        this.setState({loading: true});
        var headers = SessionManager.shared().getAuthorizationHeader();
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            itemName: data.itemname,
            collection: data.collection,
            itemCode: data.productcode
        }     
        Axios.post(API.PostItems, params, headers)
        .then(result => {
            console.log("RESULT", result.data.value)
            if(this._isMounted){
                this.setState({itemData: result.data.value, loading: false})
            }
        })
        .catch(err => {
            if(err.response.status===401){
                history.push('/login')
            }
        })
    }
    selectRow = (index) => {
        const { itemData } = this.state;
        this.setState({selectedIndex: index})
        this.props.onSetItemData(itemData[index]);
        this.setState({itemData: itemData, selectedItem: itemData[index]});
    }
    addOrderItem = () => {
        this.props.onHide();
        // this.props.onSetItemData(itemDataList)
        // this.props.addOrder();
    }
    changeItemCode = (e) => {
        console.log("dddd")
        this.setState({itemCode: e.target.value});
        // this.props.onSetItemCodeFlag();
    }

    render(){   
        const{ loading, itemData, selectedItem, selectedIndex } = this.state;
        console.log("Selected", selectedIndex)
        const { noItemMsg } = this.props;
        return (
            <div className = "slide-form__controls open" style={{height: "100%"}}>
                <div style={{marginBottom:30}}>
                    <i className="fas fa-times slide-close" style={{ fontSize: 20, cursor: 'pointer'}} onClick={()=>this.props.onHide()}></i>
                </div>
                <Form className="container place-order__search-item" onSubmit = { this.handleSubmit }>
                    <Col className="title add-product">{trls('Search_Item')}</Col>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            {noItemMsg?(
                                <Form.Control type="text" required name="productcode" value="" placeholder={trls('Product_code')} onChange={(e)=>this.changeItemCode(e)}/>
                            ):(
                                <Form.Control type="text" required name="productcode" value={this.state.itemCode} placeholder={trls('Product_code')} onChange={(e)=>this.changeItemCode(e)}/>
                            )}
                            
                            <label className="placeholder-label">{trls('Product_code')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="itemname" placeholder={trls('Item_Name')} defaultValue="" />
                            <label className="placeholder-label">{trls('Item_Name')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="collection" placeholder={trls('Collection')} defaultValue="" />
                            <label className="placeholder-label">{trls('Collection')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group >
                        <Col>
                            {!loading ? (
                                <Button type="submit" style={{width:"100px", float: "right"}}><i className="fas fa-search add-icon"></i>{trls('Search')}</Button>
                            ) : 
                                <Button type="submit" style={{width:"100px", float: "right"}}><Spinner animation="border" variant="info" className="search-spinner"/>{trls('Search')}</Button>
                            }
                        </Col>
                    </Form.Group>
                </Form>
                <div className="table-responsive place-order__search-itemtable">
                    <table id="example" className="place-and-orders__table table prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls("ItemCode")}</th>
                                <th>{trls("Item_Name")}</th>
                                <th>{trls("Unit")}</th>
                                <th>{trls("Collection")}</th>
                                <th>{trls("Image")}</th>
                            </tr>
                        </thead>
                        {itemData && !loading &&(<tbody >
                            {
                                itemData.map((data,index) =>(
                                    <tr id={index} key={index} onClick={() => this.selectRow(index)} className={selectedIndex === index? "item-search__tr-active" : "item-search__tr"} >
                                        <td>{data.ItemCode}</td>
                                        <td>{data.ItemName}</td>
                                        <td>{data.SalesUnit}</td>
                                        <td>{data.U_DBS_COLLECTION}</td>
                                        <td>
                                            {data.Image&&(
                                                <img src={ data.Image ? "data:image/png;base64," + data.Image : ''} className = "image__zoom" alt={data.ItemName}></img>
                                            ) 
                                            }
                                        </td>
                                        {/* <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>{data.ItemCode}</td>
                                        <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>{data.ItemName}</td>
                                        <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>{data.SalesUnit}</td>
                                        <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>{data.U_DBS_COLLECTION}</td>
                                        <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>
                                            {data.Image&&(
                                                <img src={ data.Image ? "data:image/png;base64," + data.Image : ''} className = "image__zoom" alt={data.ItemName}></img>
                                            ) 
                                            }
                                        </td> */}
                                    </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
                    {noItemMsg&&(
                        <Alert variant="secondary">
                            <p>{noItemMsg}</p>
                        </Alert>
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
                    <Col className="place-order__search-itemtable">
                        <Button type="button" disabled={!Object.keys(selectedItem).length || noItemMsg} onClick={()=>this.addOrderItem()}>{trls('Add_to_order')}</Button>
                    </Col>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Itemsearchform);