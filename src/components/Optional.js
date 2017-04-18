/**
 * Created by maxime on 13/04/17.
 */
import React from 'react';
import {Switch} from 'react-mdl'
import PropTypes from 'prop-types';
import InnerLayout from './InnerLayout';

const Optional = ({model, id, onChange }) => {
    return (
        <div className="field-optional">
            <Switch ripple
                    onChange={() => {onChange(id, !model.value)}}
                    checked={model.value}>
                {model.title}
            </Switch>
            {
                model.value ? <InnerLayout model={model.contain} onChange={onChange}/> : null
            }
        </div>
)};

Optional.propTypes = {
    model: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Optional;