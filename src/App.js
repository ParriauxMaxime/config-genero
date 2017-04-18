import './styles/App.scss'

import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';

class App extends Component {
  render() {
    return (
        <div className="App">
            <Layout fixedHeader>
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
                    {this.props.children}
                </Content>
            </Layout>
        </div>
    );
  }
}

export default App
