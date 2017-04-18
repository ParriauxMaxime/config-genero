import {Tooltip, Icon} from 'react-mdl';
import EditField from '../components/EditField';
import PropTypes from 'prop-types';
import React from 'react';

const Field = ({title, toolTip, onChange, data, model}) => (
    data.length === 0 ? null :
        <div className={"layout--field layout--"+title.toLowerCase()}>
            <div className="layout--field-title">
                <h2> {title} </h2>
                <Tooltip label={toolTip}
                         position="right">
                    <Icon name="information" />
                </Tooltip>
            </div>
            <hr/>
            <div className="layout--multi-fields">
                {data.map((elem, i) => (
                    <EditField onChange={onChange}
                               label={elem}
                               key={i}
                               value={model[elem].value}
                               default={model[elem].default}
                               type={model[elem].type}/>
                ))}
            </div>
        </div>
);

Field.propTypes = {
    title: PropTypes.string.isRequired,
    toolTip: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Field;
