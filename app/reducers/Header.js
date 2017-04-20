/**
 * Created by maxime on 12/04/17.
 */
import {Header as model} from "../models/Header";

Object.flatten = function(data) {
    let result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            let l = cur.length;
            for(let i=0; i<l; i++)
                recurse(cur[i], prop + "[" + i + "]");
            if (l === 0)
                result[prop] = [];
        } else {
            let isEmpty;
            for (let p in cur) {
                isEmpty = false;
                if (cur.hasOwnProperty(p))
                    recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
};

Object.unflatten = function(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    let regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (let p in data) {
        let cur = resultholder,
            prop = "",
            m;
        if (data.hasOwnProperty(p)) {
            while (m = regex.exec(p)) {
                cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
                prop = m[2] || m[1];
            }
            cur[prop] = data[p];
        }
    }
    return resultholder[""] || resultholder;
};

const setNestedKey = (data, key, value) => {
    const tmp = Object.flatten(data);
    let modified = {};
    for (let i in tmp) {
        if (tmp.hasOwnProperty(i) && i.includes(key + '.value')) {
            modified = Object.assign({}, ...tmp, { [i]: value });
            return (Object.assign({}, ...Object.unflatten(modified)));
        }
    }
    return data;
};

export const Header = (state = model, action) => {
    switch (action.type) {
        case 'CHANGE_HEADER':
            return setNestedKey(state, action.id, action.value);
        default:
            return state;
    }
};
