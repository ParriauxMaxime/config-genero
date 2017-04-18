/**
 * Created by maxime on 11/04/17.
 */
import PropTypes from 'prop-types';
import React from 'react';
import Types from '../models/Types';
import Control from './Control';
import Field from './Field';

Array.prototype.clean = function(deleteValue = undefined) {
    for (var i = 0; i < this.length; i++) {
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

const ratio = (props) => selectType(props, Types.ratio);
const size = (props) => selectType(props, Types.size);
const color = (props) => selectType(props, Types.color);
const duration = (props) => selectType(props, Types.duration);
const boolean = (props) => selectType(props, Types.boolean);




const Layout = ({model, onChange}) => {
    const fields = [
        {
            data: ratio(model),
            toolTip: "Ratio is just a number, without unit",
            title: 'Ratio'
        },
        {
            data: size(model),
            toolTip: "Size could accept different units, like px, pc, cm, em, rem, vh, vw",
            title: 'Size'
        },
        {
            data: color(model),
            toolTip: "Color could accept different units, like rgb, rgba, hsl, hsla, #CCC",
            title: 'Color'
        },
        {
            data: duration(model),
            toolTip: "Duration is just a number of seconds",
            title: 'Duration'
        },
        {
            data: boolean(model),
            toolTip: "True or false",
            title: 'Activate'
        }

    ];
    return (
        <div className="layout">
            <div className="layout--config layout--padding">
                <div className="layout--fields">
                    {
                        fields.map((e, i) => (
                          <Field model={model}
                                 data={e.data}
                                 toolTip={e.toolTip}
                                 title={e.title}
                                 onChange={onChange}
                                 key={i}/>
                        ))
                    }
                </div>
            </div>
            <div className="layout--preview">
                <div className="black--cube">
                    preview
                </div>
            </div>
        </div>
        );
};
//                <Control/>

/*<div className="layout--preview">
    <div className="black--cube">
        preview
    </div>
</div>
*/

Layout.propTypes = {
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Layout;