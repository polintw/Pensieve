import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';

class MapUnit extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.refLeafletMarker = React.createRef();
    this._handleClick_popupMainImg = this._handleClick_popupMainImg.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    const coordvalidation = ()=>{
      if (!('longitude' in this.props.coordinates) || !('latitude' in this.props.coordinates)) return false;
      if (!this.props.coordinates.longitude || !this.props.coordinates.latitude) return false;
      return true;
    };
    const coordinates = coordvalidation() ? [this.props.coordinates.latitude, this.props.coordinates.longitude] : [25.065487903860344, 121.56676227783937];

    return(
      <div
        className={classnames(styles.comMap)}>
        <MapContainer center={coordinates} zoom={15}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            ref={this.refLeafletMarker}
            position={coordinates}>
            <Popup>
              <img
                className={classnames(styles.popupMain)}
                src={this.props.popupImgSrc}
                onClick={this._handleClick_popupMainImg}/>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    )
  }

  _handleClick_popupMainImg(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._handleClick_popupMainImg();
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MapUnit));
