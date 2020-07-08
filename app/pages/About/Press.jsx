import React, {Component} from 'react'
import PropTypes from "prop-types";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Press extends Component {
  render() {
    const {t} = this.props;
    const news = [
      {
        title: "The great explorer of the truth, the master-builder of human happiness.",
        text: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.",
        img: "cesar.jpg"
      },
      {
        title: "The great explorer of the truth, the master-builder of human happiness.",
        text: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided.",
        img: "cesar.jpg"
      }
    ]
    return (
      <div className="about-press">
        <h3>{t("AboutSite.press")}</h3>
        {news.map((d, i) => (
          <div className="press-news" key={i}>
            <img src={`/images/press/${d.img}`} alt="img" className="news-picture" />
            <h4>{d.title}</h4>
            <p>{d.text}</p>
          </div>
        ))}
      </div>
    )
  }
}

Press.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(hot(Press));
