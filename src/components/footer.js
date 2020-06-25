import React, {Component} from 'react'
import * as authAction  from '../actions/authAction';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({
    blankdispatch: (blankFlag) =>
        dispatch(authAction.blankdispatch(blankFlag)),
});
class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render () {
      return (
        <div>
            <footer className="footer">
              <div className="footer-social-icon-desktop_div" stlye={{display: "flex"}}>
                  <a href="https://www.woontotaal.nl/" className="footer-social__icon" target="_blank" rel="noopener noreferrer">
                      <img src={require("../assets/images/woon.png")} className="footer-social__icon_image" alt="woon"/>
                  </a>
                  <a href="https://www.eijffinger.com/" className="footer-social__icon" target="_blank" rel="noopener noreferrer">
                      <img src={require("../assets/images/eijffinger.svg")} className="footer-social__icon_image" alt="woon"/>
                  </a>
                  <a href="https://www.facebook.com/Eijffinger/" className="footer-social__icon" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-facebook footer-social__icon_image"></i>
                  </a>
                  <a href="https://www.instagram.com/eijffinger" className="footer-social__icon" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram-square footer-social__icon_image"></i>
                  </a>
                  <a href="https://nl.pinterest.com/eijffinger/" className="footer-social__icon" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-pinterest footer-social__icon_image"></i>
                  </a>
                  <a href="https://www.youtube.com/channel/UCjxIhs-6AbLIo4D40IJ4a7g" className="footer-social__icon youtube-icon"  target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-youtube footer-social__icon_image"></i>
                  </a>
                </div>
            </footer>
        </div>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Footer);
