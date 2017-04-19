import "./styles/App.scss";

import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button, Content, Drawer, Header, Layout as LayoutMDL, Navigation, Switch} from "react-mdl";
import Layout from "./components/Layout";
import {store} from "./index";
import "whatwg-fetch";

const epurStore = (store) => {
    for (let i in store) {
        if (store.hasOwnProperty(i) && typeof(store[i]) === "object" && i !== 'type') {
            if (store[i].hasOwnProperty('value') && store[i].hasOwnProperty('default')) {
                if (store[i].value === '')
                    store[i].value = store[i].default
            }
            if (store[i].hasOwnProperty('value') && !store[i].hasOwnProperty('contain')) {
                store[i] = store[i].value
            }
            else if (store[i].hasOwnProperty('value') && store[i].hasOwnProperty('contain')) {
                store[i] = {'value': store[i].value, 'contain': epurStore(store[i].contain)}
            }
            else
                store[i] = epurStore(store[i]);
        }
        else {
            if (i !== 'value')
                delete store[i]
        }
    }
    return (store);
}

const sendStore = () => {
    fetch('/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(epurStore(JSON.parse(JSON.stringify(store.getState()))))
    }).then((res) => {
        return res
    })
        .catch((e) => {
            console.log('Error catched', e)
        });
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <LayoutMDL fixedHeader>
                    <Header title={<span><span style={{color: '#ddd'}}>
                    <Link to="/" className="link--root">Genero</Link> /
                    </span><strong> Front-end configurator</strong></span>}>
                        <Button raised accent ripple style={{marginRight: 10}}
                                onClick={() => sendStore()}>Create</Button>
                        <span>
                        <Switch ripple>Show preview</Switch>
                    </span>
                    </Header>
                    <Drawer title="Options">
                        <Navigation>
                            <Link to="/overview">Overview</Link>
                            <Link to="/header">Header</Link>
                            <Link to="/footer">Footer</Link>
                            <Link to="/fonts">Fonts</Link>
                            <Link to="/images">Images</Link>
                            <Link to="/icons">Icons</Link>
                            <Link to="/locales">Locales</Link>
                        </Navigation>
                    </Drawer>
                    <Content>
                        <Layout>
                            {this.props.children}
                        </Layout>
                    </Content>
                </LayoutMDL>
            </div>
        );
    }
}

export default App
