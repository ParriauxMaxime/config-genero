/**
 * Created by maxime on 11/04/17.
 */
import PropTypes from 'prop-types';
import React from 'react';
import Types from '../models/Types';
import Optional from './Optional';
import EditField from './EditField';

const InnerLayout = ({model, onChange}) => {
    return (
        <div className="layout">
            <div className="layout--config layout--padding">
                <div className="layout--fields">
                    {
                        Object.keys(model).map((e, i) => (
                            <EditField value={model[e].value}
                                       type={model[e].type}
                                       label={e}
                                       contain={model[e].contain}
                                       title={model[e].title}
                                       default={model[e].default}
                                       onChange={onChange}
                                       key={i}/>
                        ))
                    }
                    <br/>
                </div>
            </div>
        </div>
    );
};

InnerLayout.propTypes = {
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default InnerLayout;