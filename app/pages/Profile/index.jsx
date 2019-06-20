import React from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import {fetchData} from "@datawheel/canon-core";
import {connect} from "react-redux";
import {Profile as CMSProfile, Topic} from "@datawheel/canon-cms";
import libs from "@datawheel/canon-cms/src/utils/libs";


class Profile extends React.Component {
  getChildContext() {
    const {formatters, locale, profile, router} = this.props;
    const {variables} = profile;

    return {
      formatters: formatters.reduce((acc, d) => {
        const f = Function("n", "libs", "formatters", d.logic);
        const fName = d.name.replace(/^\w/g, chr => chr.toLowerCase());
        acc[fName] = n => f(n, libs, acc);
        return acc;
      }, {}),
      router,
      variables,
      locale
    };
  }


  render() {
    const {title, subtitle, topics, variables} = this.props.profile;
    return <div id="Profile">
      {topics.map(topic =>
        <Topic
          key={topic.slug}
          router={this.props.router}
          contents={topic}
        />
      )}
    </div>;
  }
}


Profile.need = [
  fetchData("profile", "/api/profile/?slug=<pslug>&id=<pid>&locale=<i18n.locale>"),
  fetchData("formatters", "/api/formatters")
];

Profile.childContextTypes = {
  formatters: PropTypes.object,
  locale: PropTypes.string,
  router: PropTypes.object,
  variables: PropTypes.object
};


export default withNamespaces()(
  connect(state => ({
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    profile: state.data.profile
  }))(Profile)
);

