/**
 * Created by maxime on 11/04/17.
 */
import React from "react";
import {Button} from "react-mdl";

const Control = () => {
    return (
        <div>
            <Button raised colored ripple>
                <i className="material-icons">arrow_backward</i>Prev
            </Button>
            <Button raised colored ripple>
                Next <i className="material-icons">arrow_forward</i>
            </Button>
        </div>
    );
};

export default Control;