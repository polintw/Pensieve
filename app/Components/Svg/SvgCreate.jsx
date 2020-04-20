import React from 'react';

class Response extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 298.25 215.01"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        preserveAspectRatio="none">
        <defs>
          <style>{".cls-1-createRes,.cls-4-createRes{fill:none;}.cls-1-createRes{stroke:#e8e8e8;stroke-width:2.25px;}.cls-1-createRes,.cls-4-createRes,.cls-5-createRes{stroke-miterlimit:10;}.cls-2-createRes{fill:#8c8c8c;}.cls-3-createRes,.cls-6-createRes{fill:#e8e8e8;}.cls-4-createRes,.cls-5-createRes{stroke:#000;stroke-linecap:round;stroke-width:1.75px;}.cls-6-createRes{font-size:42px;font-family:GillSansNova-BookItalic, Gill Sans Nova;font-style:italic;letter-spacing:0.06em;}.cls-7-createRes{letter-spacing:0.07em;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_4" data-name="圖層 4">
            <path className="cls-1-createRes" d="M102.13,196.13H8.63a7.5,7.5,0,0,1-7.5-7.5V8.62a7.49,7.49,0,0,1,7.5-7.49h281a7.5,7.5,0,0,1,7.5,7.5v180a7.5,7.5,0,0,1-7.5,7.5"/>
            <polygon className="cls-2-createRes" points="53 148.96 53 37.15 44.34 37.15 44.13 37.54 44.13 156.95 273.1 156.95 273.53 156.96 273.53 148.96 53 148.96"/>
            <path className="cls-3-createRes" d="M52.93,6H285.13a6,6,0,0,1,6,6v137.4a0,0,0,0,1,0,0H52.93a0,0,0,0,1,0,0V6A0,0,0,0,1,52.93,6Z"/>
            <line className="cls-4-createRes" x1="196.12" y1="69.63" x2="233.13" y2="69.63"/>
            <line className="cls-4-createRes" x1="214.62" y1="88.13" x2="214.63" y2="51.12"/>
            <rect className="cls-5-createRes" x="213.63" y="68.63" width="2" height="2" rx="0.51"/>
            <text className="cls-6-createRes" transform="translate(119.55 205.14)">r<tspan className="cls-7-createRes" x="14.78" y="0">esponse</tspan></text>
          </g>
        </g>
      </svg>
    )
  }
}

//the class DialogueOnpic do not be used in any component,
//just a previous version preserved in case the new one was abort
class DialogueOnpic extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 298.25 197.25"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        preserveAspectRatio= {this.props.stretch? "none": 'unset'}>
        <defs>
          <style>{".cls-1-create,.cls-4-create{fill:none;stroke-miterlimit:10;}.cls-1-create{stroke:#454545;stroke-width:2.25px;}.cls-2-create{fill:#8c8c8c;}.cls-3-create{fill:#fff;}.cls-4-create,.cls-5-create{stroke:#000;}.cls-4-create{stroke-linecap:round;stroke-width:1.75px;}.cls-5-create{stroke-linejoin:round;}"}</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_4" data-name="圖層 4">
            <rect className="cls-1-create" x="1.13" y="1.13" width="296" height="195" rx="7.5"/>
            <polygon className="cls-2-create" points="53.75 157.86 53.75 45.45 45.34 45.45 45.13 45.84 45.13 164.78 267.7 164.78 268.13 164.79 268.13 157.86 53.75 157.86"/>
            <path className="cls-3-create" d="M53.13,9h231a6,6,0,0,1,6,6V158a0,0,0,0,1,0,0h-237a0,0,0,0,1,0,0V9A0,0,0,0,1,53.13,9Z"/>
            <line className="cls-4-create" x1="199.12" y1="64.63" x2="236.13" y2="64.63"/>
            <line className="cls-4-create" x1="217.62" y1="83.13" x2="217.63" y2="46.12"/>
            <rect className="cls-5-create" x="216.62" y="63.63" width="2" height="2" rx="0.51"/>
          </g>
        </g>
      </svg>
    )
  }
}

class Default extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 393 364"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        preserveAspectRatio= {this.props.stretch? "none": 'xMidYMid'}>
        <defs>
          <style>{
              ".cls-1-createD{fill:none;stroke-miterlimit:10;stroke-width:7px;stroke-dasharray:41 13;"+ (!!this.props.black? "stroke:#111111;": "stroke:#777777;") + "}.cls-2-createD{fill:#ff9a5e;}"
            }</style>
        </defs>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <rect className="cls-1-createD" x="1.5" y="1.5" width="390" height="361" rx="7.5"/>
            <rect className="cls-2-createD" x="95" y="91.34" width="9" height="200" rx="4"/>
          </g>
        </g>
      </svg>
    )
  }
}

export default class SvgCreate extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  render(){
    return(
      <div
        style={{
          width: '100%',
          height: '100%'
        }}>
        {
          this.props.place ? (
            <Response
              {...this.props}/>
          ):(
            <Default
              {...this.props}/>
          )
        }
      </div>
    )
  }
}
