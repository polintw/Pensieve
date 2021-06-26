import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import store from './store.js';
import Action from './Action.jsx';


ReactDOM.hydrate(<Provider store={store}><Action /></Provider>, document.getElementById("root"));
