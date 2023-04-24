import {createStore} from 'redux';
import postreducer from './postSlice';
import counterReducer from './counterSlice';
import MypostReducer from './myPost';
import adsReducer from './adsSlicer';
import subRedcuer from './subSlicer';

import {combineReducers} from 'redux';

const allReducers = combineReducers({
  counter: counterReducer,
  post: postreducer,
  mypost: MypostReducer,
  ads: adsReducer,
  sub: subRedcuer,
});

const enhancer =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(); // Redux DevTools, a must

const store = createStore(allReducers, enhancer);

export default store;
