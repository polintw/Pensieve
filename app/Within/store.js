/*
  Plan is let store used by multiple components,
  so export in an independent file.
*/
import {
  createStore,
  applyMiddleware
} from "redux";
import thunk from 'redux-thunk';
import storeWithin from "../redux/reducers/within.js";

const store = createStore(storeWithin, applyMiddleware(thunk));

export default store;
