import React, {Component} from 'react'
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
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
            itemDataList: []
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
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

    selectItemData = (ItemCode) => {
        const { itemData } = this.state;
        itemData.map((data, index)=>{
            if(data.ItemCode===ItemCode){
                if(data.checked){
                    data.checked = false;
                }else{
                    data.checked = true;
                }
            }else{
                data.checked = false;
            }
            return data;
        });
        let itemDataList = itemData.filter((item, key)=>item.checked===true);
        this.setState({itemData: itemData, itemDataList: itemDataList});
    }

    addOrderItem = () => {
        const { itemData } = this.state;      
        let itemDataList = itemData.filter((item, key)=>item.checked===true);
        this.props.onHide();
        this.props.onSetItemData(itemDataList)
        Common.hideSlideForm();
    }

    onHide = () => {
        this.props.onHide();
        Common.hideSlideForm();
    }

    render(){   
        const{ loading, itemData, itemDataList } = this.state;
        const { itemCode } = this.props;
        return (
            <div className = "slide-form__controls open" style={{height: "100%"}}>
                <div style={{marginBottom:30}}>
                    <i className="fas fa-times slide-close" style={{ fontSize: 20, cursor: 'pointer'}} onClick={()=>this.onHide()}></i>
                </div>
                <Form className="container place-order__search-item" onSubmit = { this.handleSubmit }>
                    <Col className="title add-product">{trls('Search_Item')}</Col>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="productcode" defaultValue={itemCode} placeholder={trls('Product_code')}/>
                            <label className="placeholder-label">{trls('Product_code')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="itemname" placeholder={trls('Item_Name')}/>
                            <label className="placeholder-label">{trls('Item_Name')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="collection" placeholder={trls('Collection')}/>
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
                                itemData.map((data,i) =>(
                                    <tr id={i} key={i} onClick={()=>this.selectItemData(data.ItemCode)} className={data.checked ? "item-search__tr-active" : "item-search__tr"} >
                                        <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>{data.ItemCode}</td>
                                        <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>{data.ItemName}</td>
                                        <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>{data.SalesUnit}</td>
                                        <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>{data.U_DBS_COLLECTION}</td>
                                        <td className={data.checked ? "item-search__tr-active" : "item-search__tr"}>
                                            {data.Image&&(
                                                <img src={ data.Image ? "data:image/png;base64," + data.Image : ''} className = "image__zoom" alt={data.ItemName}></img>
                                            ) 
                                            }
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
                {itemDataList.length>0 ? (
                    <Col className="place-order__search-itemtable">
                        <Button type="button" onClick={()=>this.addOrderItem()}>{trls('Add_to_order')}</Button>
                    </Col>
                ):
                    <Col className="place-order__search-itemtable">
                        <Button type="button" disabled onClick={()=>this.addOrderItem()}>{trls('Add_to_order')}</Button>
                    </Col>
                }
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Itemsearchform);