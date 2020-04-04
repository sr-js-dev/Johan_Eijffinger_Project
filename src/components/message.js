import React from 'react';
import FlashMassage from 'react-flash-message'

class ListErrors extends React.Component {
  
  render() {
    const {message, type} = this.props;
    if (message) {
      return (
          <FlashMassage duration={3000}>
            {type==="error" ? (
              <div className="alert alert-danger" style={{marginTop:10}}>
                <strong><i className="fas fa-exclamation-triangle"></i>{message}</strong>
              </div>
            ):(
              <div className="alert alert-success" style={{marginTop:10}}>
                <strong><i className="fas fa-exclamation-triangle"></i>{message}</strong>
              </div>
            )}
            
          </FlashMassage>
      );
    } else {
      return null;
    }
  }
}
export default ListErrors;

