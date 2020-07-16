import {Component} from "react";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";
import {connect} from "react-redux";

class HelmetWrapper extends Component {

  render() {
    const {t, info, lang, baseUrl, path } = this.props;

    const defaults = {
      title: info && info.title ? info.title: t("share.title"),
      desc: info && info.desc ? info.desc : t("share.description"),
      img: info && info.img ? info.img : `${baseUrl}/images/share/share-${lang}.jpg`,
      url: `${baseUrl}${path}`,
      locale: lang
    }

    return (
      <Helmet title={defaults.title}>

        <title>{defaults.title}</title>

        <meta name="title" content={defaults.title} />
        <meta name="description" content={defaults.desc} />

        <meta name="twitter:title" content={defaults.title} />
        <meta name="twitter:description" content={defaults.desc} />
        <meta name="twitter:image" content={defaults.img} />

        <meta property="og:title" content={defaults.title} />
        <meta property="og:description" content={defaults.desc} />
        <meta property="og:locale" content={defaults.locale} />
        <meta property="og:url" content={defaults.url} />
        <meta property="og:image" content={defaults.img} />

      </Helmet>
    );
  }
}

export default withNamespaces()(
  connect(state => {
    return {
      baseUrl: state.env.CANON_API,
      lang: state.i18n.locale === 'en'?'en':'es',
      path: state.location.pathname
    }
  })(HelmetWrapper)
);

