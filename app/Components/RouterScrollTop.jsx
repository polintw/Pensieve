/*
Reference: https://reactrouter.com/web/guides/scroll-restoration
*/
import React from 'react';
import { withRouter } from "react-router-dom";

class ScrollToTop extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (
      (this.props.location.pathname !== prevProps.location.pathname) &&
      // and not move under any path change related to '/unit' 
      !prevProps.location.pathname.includes('/unit') &&
      !this.props.location.pathname.includes('/unit')
    ) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
