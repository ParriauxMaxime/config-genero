import "./index.css";
import "react-mdl/extra/material.css";
import "react-mdl/extra/material.js";

import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {Redirect, Route, Router} from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import App from "./App";
import Overview from "./containers/Overview";
import Header from "./containers/Header";
import Layout from "./components/Layout";
import configurator from "./reducers/index";


const history = createBrowserHistory();
export const store = createStore(configurator);

store.subscribe(() => {
    console.log(store.getState());
});

render(
    <Provider store={store}>
        <Router history={history} >
            <div>
                <App>
                    <Route exact path="/">
                        <Redirect to="/overview"/>
                    </Route>
                    <Route path="/overview" component={Overview}/>
                    <Route path="/header" component={Header}/>
                    <Route path="/footer" component={Layout}/>
                    <Route path="/fonts" component={Layout}/>
                    <Route path="/images" component={Layout}/>
                    <Route path="/icons" component={Layout}/>
                    <Route path="/locales" component={Layout}/>
                </App>
            </div>
        </Router>
    </Provider>,
    document.querySelector('#app'));
