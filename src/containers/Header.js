/**
 * Created by maxime on 12/04/17.
 */
import { connect } from 'react-redux'
import InnerLayout from '../components/InnerLayout';
import { changeHeader } from '../actions/Header';

const mapStateToProps = (state) => {
    return {
        model: state.HeaderReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (id, val) => {
            dispatch(changeHeader(id, val));
        }
    }

};

const Header = connect(
    mapStateToProps,
    mapDispatchToProps
)(InnerLayout);

export default Header;