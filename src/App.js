import "./styles/App.scss";

import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Content, Drawer, Header, Layout as LayoutMDL, Navigation} from "react-mdl";
import Layout from "./components/Layout";

class App extends Component {
  render() {
    return (
        <div className="App">
            <LayoutMDL fixedHeader>
                <Header title={<span><span style={{ color: '#ddd' }}>
                    <Link to="/" className="link--root">Genero</Link> /
                </span><strong> Front-end configurator</strong></span>}/>
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
