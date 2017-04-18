import { connect } from 'react-redux'
import Layout from '../components/Layout';
import { changeOverview } from '../actions/Overview';

const mapStateToProps = (state) => {
    return {
        model: state.OverviewReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (id, val) => {
            dispatch(changeOverview(id, val));
        }
    }

};

const Overview = connect(
    mapStateToProps,
    mapDispatchToProps
)(Layout);

export default Overview;