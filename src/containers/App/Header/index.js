import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { withFB } from 'common/facebook';
import Header from '../../../components/App/Header';
import { login, logout, getLoginStatus, getMe } from '../../../actions/auth';

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ login, logout, getLoginStatus, getMe }, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withFB(Header)),
);
