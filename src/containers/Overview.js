import {connect} from "react-redux";
import OrganizedLayout from "../components/OrganizedLayout";
import {changeOverview} from "../actions/Overview";

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
)(OrganizedLayout);

export default Overview;