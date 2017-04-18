/**
 * Created by maxime on 11/04/17.
 */
import PropTypes from "prop-types";
import React from "react";
import SplitPane from "react-split-pane";

const Layout = ({children}) => {
    const CenterSeparator = {
        borderLeft: '3px solid #595ACC',
        cursor: 'ew-resize'
    };

    const configSystem = {
        backgroundColor: '#EEE',
        minWidth: 400,
    };

    const preview = {
        minWidth: 400,
        width: '100%',
        backgroundColor: 'black',
        height: '100vh',
        display: 'flex',
        flexGrow: '1',
        flexWrap: 'wrap',
    };

    let innerPreview = {
        position: 'relative',
        backgroundColor: 'lightblue',
        color: 'white',
        width: '90%',
        height: '50vh',
        margin: 'auto'


    };

    return (
        <div className="layout">
            <SplitPane split="vertical"
                       minSize={400}
                       maxSize={1200}
                       defaultSize={800}
                       resizerStyle={CenterSeparator}
                       pane1Style={configSystem}>
                <div style={configSystem}>
                    {children}
                </div>
                <div style={preview} id="preview-block">
                    <div style={innerPreview}>
                        preview
                    </div>
                </div>
            </SplitPane>
        </div>
        );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;