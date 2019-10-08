import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import FrontCognition from './Front_Cognition.jsx';
import FrontProfile from './Front_Profile.jsx';
import NavSelf from './component/NavSelf/NavSelf.jsx';

class Front extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <Router
        basename={"/user"}>
        <div>
          <Route path="/cognition" render={(props)=> <FrontCognition {...props}/>}/>
          <Route path="/profile" render={(props)=> <FrontProfile {...props}/>}/>
          <div
            style={{
              position: 'fixed',
              left: "10vw",
              bottom: "2.4%" /*follow the position of Cosmic Corner*/
            }}>
            <NavSelf {...this.props}/>
          </div>
        </div>
      </Router>
    )
  }
}

export default connect()(Front);
