import React, { Component } from "react";
import { connect } from 'react-redux';
import $ from 'jquery';
import { createUltimatePagination } from "react-ultimate-pagination";
import { trls } from '../factories/translate';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});

function PAGE(props) {
  return (
    <div
      className={!props.isActive ? "pagination-botton " : "pagination-botton active "}
      onClick={props.onClick}
      disabled={props.isActive}
    >
      {props.value}
    </div>
  );
}
 
function Ellipsis(props) {
  return (
    <div
      className={!props.isActive ? "pagination-botton " : "pagination-botton active "}
      onClick={props.onClick}
      disabled={props.isActive}
      style={{border: 0}}
    >
      ...
    </div>
  )
}
 
function FirstPageLink(props) {
  return null;
}
 
function PreviousPageLink(props) {
  return (
    <div
      className="pagination-botton previous"
      onClick={props.onClick}
      disabled={props.isActive}
    >
      {trls('Previous')}
    </div>
  )
}
 
function NextPageLink(props) {
  return (
    <div
      className="pagination-botton next"
      onClick={props.onClick}
      disabled={props.isActive}
    >
      {trls('Next')}
    </div>
  )
}
 
function LastPageLink(props) {
  return null;
}
 
const PaginatedPage = createUltimatePagination({
  itemTypeToComponent: {
    PAGE: PAGE,
    ELLIPSIS: Ellipsis,
    FIRST_PAGE_LINK: FirstPageLink,
    PREVIOUS_PAGE_LINK: PreviousPageLink,
    NEXT_PAGE_LINK: NextPageLink,
    LAST_PAGE_LINK: LastPageLink
  }
});

class Pagination extends Component {
  _isMounted = false
	constructor(props) {
		super(props);
		this.state = {  
      page: 1,
      pageSize: 10
    };
    this.onPageChange = this.onPageChange.bind(this);
  }
  
  componentDidMount () {
    $(".pagination-botton.previous").addClass("hiden");
  }

  onPageChange = (page) => {
    const { recordNum } = this.props;
    const { pageSize } = this.state;
    if(page===1){
      $(".pagination-botton.previous").addClass("hiden");
    }else{
      $(".pagination-botton.previous").removeClass("hiden");
    }
    if(page===parseInt(recordNum/pageSize)){
      $(".pagination-botton.next").addClass("hiden");
    }else{
      $(".pagination-botton.next").removeClass("hiden");
    }
    this.setState({page: page},()=>{
      this.getData();
    })
  }

  getData = () => {
    const { page } = this.state;
    this.props.getPage(page)
  }

  render() {
    const { recordNum } = this.props;
    const { page } = this.state;
    let totalPage = recordNum;
    return (
      <div>
        <div className="pagination">
            <div style={{marginLeft: 'auto', display: 'flex'}}>
              <span className="pagination-info" style={{marginTop: 10, marginRight: 20}}>{trls("Show_page")} {page} of {totalPage}</span>
              <PaginatedPage
                totalPages={totalPage}
                currentPage={this.state.page>totalPage ? 1: this.state.page}
                onChange={page => this.onPageChange(page)}
              />
            </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Pagination);