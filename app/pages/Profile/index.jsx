import React from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import {fetchData} from "@datawheel/canon-core";
import {connect} from "react-redux";
import {Profile as CMSProfile, Section} from "@datawheel/canon-cms";
import libs from "@datawheel/canon-cms/src/utils/libs";

import Stat from "../../components/Stat";

import {Geomap} from "d3plus-react";
import SectionIcon from "../../components/SectionIcon";
import {Icon} from "@blueprintjs/core";
import Nav from "../../components/Nav";

import "./style.css";

class Profile extends React.Component {
  state = {
    scrolled: false
  };

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

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 5) {
      this.setState({scrolled: true});
    }
    else {
      this.setState({scrolled: false});
    }

  };



  render() {
    const {profile, t} = this.props;
    const {subtitle, sections, variables} = profile;
    const {scrolled} = this.state;
    return <div id="Profile" onScroll={this.handleScroll}>
      <Nav
        className={scrolled ? "background" : ""}
        title={scrolled ? variables.name : ""}
      />
      <div className="hero" style={{backgroundImage: `url(/images/${variables.id}.jpg), url(/images/background.jpg)`}}>
        <h1 className="profile-title">{variables.name}</h1>
        <div className="stats">
          {Array.from({length: 6}, (v, k) => k + 1).map(d => {
            if (variables[`stat${d}`]) {
              const stat = variables[`stat${d}`];
              return <Stat title={stat.title} value={stat.value} subtitle={stat.subtitle} />;
            }
            return null;
          }, [])}
        </div>
        <div className="section-icons">
          <SectionIcon />
          <SectionIcon />
          <SectionIcon />
          <SectionIcon />
        </div>
      </div>

      <div className="lead">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div className="lead-descriptions">
                <p>Lorem ipsum dolor sit amet consectetur adipiscing elit, etiam cubilia fames ultrices proin taciti montes, massa himenaeos class in sed dapibus. Primis sodales arcu aliquam accumsan ultrices bibendum in non dis, sed tempus facilisi quam class imperdiet morbi sollicitudin condimentum, varius potenti sociosqu cursus tellus nascetur eleifend euismod. Diam lectus hac auctor sem montes felis nunc ridiculus porta platea, inceptos tempor sociosqu venenatis libero odio placerat a mauris, dictumst per mollis erat integer aliquam proin eu nam.</p>
                <p>Suscipit habitasse pharetra tortor augue dignissim tempus nulla class, id himenaeos lectus dui iaculis felis dis, faucibus orci sed vivamus pretium neque leo. Rhoncus class ornare senectus auctor lectus risus habitasse, quam condimentum metus vulputate accumsan ut, pretium penatibus egestas erat nibh montes. Ultrices dis et sed leo ad, maecenas interdum ac suscipit, dui libero eros mus.</p>
              </div>
            </div>
            <div className="column is-1-4">
              <Geomap
                config={{
                  data: [],
                  topojson: "/topojson/Entities.json",
                  height: 200,
                  width: 300,
                  ocean: "transparent",
                  zoom: false,
                  shapeConfig: {
                    Path: {
                      fill: d => d.properties.ent_id === variables.id ? "#408f4e" : "#FFFFFF"
                    }
                  },
                  tiles: false
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {sections.map(topic =>
          <Section
            key={topic.slug}
            router={this.props.router}
            contents={topic}
          />
        )}
      </div>
    </div>;
  }
}


Profile.need = [
  fetchData("profile", "/api/profile/?slug1=<pslug>&id1=<pid>&locale=<i18n.locale>"),
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

