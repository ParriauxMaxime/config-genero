/**
 * Created by maxime on 11/04/17.
 */
import React from "react";
import PropTypes from "prop-types";
import {Switch, Textfield} from "react-mdl";
import Optional from "./Optional";
import Types from "../models/Types";


Array.prototype.clean = function(deleteValue = undefined) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

const selectType = (model, type) => {
    const fields = Object.keys(model).map((e) => e);
    const tmp = fields.map((elem, i) => {
        if (model[elem].type.pattern === type.pattern)
            return (elem);
    });
    return tmp.clean();
};

const img = (props) => selectType(props, Types.img);
const position = (props) => selectType(props, Types.position);
const textDecoration = (props) => selectType(props, Types.textDecoration);

const EditField = (props) => {
    return (
        <div>
            {
                props.type.pattern  === Types.ratio.pattern ||
                props.type.pattern  === Types.size.pattern  ||
                props.type.pattern  === Types.string.pattern  ||
                props.type.pattern  === Types.color.pattern  ||
                props.type.pattern  === Types.duration.pattern  ?
                    <div className="edit-field--container">
                        <label>@{props.label.slice(4)}: </label>
                        <Textfield
                            onChange={(input) => {props.onChange(props.label, input.target.value);}}
                            label={props.default}
                            value={props.value}
                            className="edit-field--text-field"
                            pattern={props.type.pattern}
                            error={props.type.error}/>
                    </div>
                    : null
            }

            {
                props.type.pattern  === Types.boolean.pattern  ?
                    <Switch ripple
                            onChange={() => {props.onChange(props.label, !props.value)}}
                            checked={props.value === true}>
                        {props.label.slice(4)}
                    </Switch>
                    : null
            }

            {
                props.type.pattern  === Types.optional.pattern  ?
                    <Optional model={props} id={props.label} onChange={props.onChange} />
                    : null
            }

            {
                props.type.pattern === Types.img.pattern  ||
                props.type.pattern === Types.position.pattern  ||
                props.type.pattern === Types.textDecoration.pattern  ?
                    <p>@<strong>{props.label.slice(4)}</strong></p> : null
            }
        </div>
    );
};

EditField.propTypes = {
    value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool,
    ]),
    default: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool,
    ]),
    type: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    contain: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string
};

export default EditField;