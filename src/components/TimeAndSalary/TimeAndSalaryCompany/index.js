import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import R from 'ramda';
import { compose, setStatic } from 'recompose';

import Select from 'common/form/Select';
import Loading from 'common/Loader';
import { P } from 'common/base';
import FanPageBlock from 'common/FanPageBlock';
import { withPermission } from 'common/permission-context';
import WorkingHourBlock from '../common/WorkingHourBlock';
import { queryCompany } from '../../../actions/timeAndSalaryCompany';
import { isFetching, isFetched } from '../../../constants/status';
import renderHelmet from './helmet';

import {
  pathSelector,
  paramsSelector,
  pathnameSelector,
} from 'common/routing/selectors';

import styles from '../views/view.module.css';

const pathnameMapping = {
  '/time-and-salary/company/:keyword/work-time-dashboard': {
    title: '工時排行榜',
    label: '一週平均總工時（高到低）',
    groupSortBy: 'week_work_time',
    order: 'descending',
  },
  '/time-and-salary/company/:keyword/sort/work-time-asc': {
    title: '工時排行榜（由低到高）',
    label: '一週平均總工時（低到高）',
    groupSortBy: 'week_work_time',
    order: 'ascending',
  },
  '/time-and-salary/company/:keyword/salary-dashboard': {
    title: '估算時薪排行榜',
    label: '估算時薪（高到低）',
    groupSortBy: 'estimated_hourly_wage',
    order: 'descending',
  },
  '/time-and-salary/company/:keyword/sort/salary-asc': {
    title: '估算時薪排行榜（由低到高）',
    label: '估算時薪（低到高）',
    groupSortBy: 'estimated_hourly_wage',
    order: 'ascending',
  },
};

const selectOptions = R.pipe(
  R.toPairs,
  R.map(([path, { label }]) => ({ value: path, label })),
);

const keywordSelector = R.compose(
  params => params.keyword,
  paramsSelector,
);

const pathParameterSelector = R.compose(
  path => pathnameMapping[path],
  pathSelector,
);

class TimeAndSalaryCompany extends Component {
  static propTypes = {
    data: ImmutablePropTypes.list,
    status: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
    }),
    queryCompany: PropTypes.func,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    canViewTimeAndSalary: PropTypes.bool.isRequired,
    fetchPermission: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { groupSortBy, order } = pathParameterSelector(this.props);
    const company = keywordSelector(this.props);
    this.props.queryCompany({ groupSortBy, order, company });
    this.props.fetchPermission();
  }

  componentDidUpdate(prevProps) {
    if (
      pathSelector(prevProps) !== pathSelector(this.props) ||
      keywordSelector(prevProps) !== keywordSelector(this.props)
    ) {
      const { groupSortBy, order } = pathParameterSelector(this.props);
      const company = keywordSelector(this.props);
      this.props.queryCompany({ groupSortBy, order, company });
      this.props.fetchPermission();
    }
  }

  render() {
    const { history, status, canViewTimeAndSalary } = this.props;
    const path = pathSelector(this.props);
    const pathname = pathnameSelector(this.props);
    const { title, groupSortBy } = pathParameterSelector(this.props);
    const company = keywordSelector(this.props);
    const raw = this.props.data.toJS();

    const substituteKeyword = R.invoker(2, 'replace')(
      /:keyword/,
      encodeURIComponent(company),
    );

    return (
      <section className={styles.searchResult}>
        {renderHelmet({ title, pathname, company })}
        <h2 className={styles.heading}>
          搜尋 “{company}” 的 {title}
        </h2>
        <div className={styles.result}>
          <div className={styles.sort}>
            <div className={styles.label}> 排序：</div>
            <div className={styles.select}>
              <Select
                options={selectOptions(pathnameMapping)}
                value={path}
                onChange={e => history.push(substituteKeyword(e.target.value))}
                hasNullOption={false}
              />
            </div>
          </div>
        </div>
        {isFetching(status) && <Loading size="s" />}
        {isFetched(status) &&
          raw.length === 0 && (
            <P size="l" bold className={styles.searchNoResult}>
              尚未有公司「
              {company}
              」的薪時資訊
            </P>
          )}
        {raw.map((o, i) => (
          <WorkingHourBlock
            key={o.company.id || i}
            data={o}
            groupSortBy={groupSortBy}
            isExpanded={i === 0 && raw.length === 1}
            hideContent={!canViewTimeAndSalary}
          />
        ))}
        <FanPageBlock className={styles.fanPageBlock} />
      </section>
    );
  }
}

const ssr = setStatic('fetchData', ({ store: { dispatch }, ...props }) => {
  const { groupSortBy, order } = pathParameterSelector(props);
  const company = keywordSelector(props);

  return dispatch(queryCompany({ groupSortBy, order, company }));
});

const hoc = compose(
  ssr,
  withPermission,
);

export default hoc(TimeAndSalaryCompany);
