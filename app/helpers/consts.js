const locale = ":lng";

module.exports = {
  SIDEBAR_NAV: [
    {
      title: "Explore.Title", url: `/${locale}/explore`, items: [
        {title: "Cities & Places", url: `/${locale}/explore?profile=geo`},
        {title: "Products", url: `/${locale}/explore?profile=product`},
        {title: "Industries", url: `/${locale}/explore?profile=industry`},
        {title: "Occupations", url: `/${locale}/explore?profile=occupation`},
        {title: "Universities", url: `/${locale}/explore?profile=institution`}
      ]
    },
    {title: "Coronavirus", url: `/${locale}/coronavirus`},
    {title: "ECI Explorer.Title", url: `/${locale}/eci/explore`},
    {title: "About.Background", url: `/${locale}/about`},
    // {title: "Viz Builder",        url: `/${locale}/vizbuilder`},
    // {title: "Data Cart",          url: `/${locale}/cart`},
    //{title: "Data sources",       url: `/${locale}/data`}
  ],
  FOOTER_NAV: [
    {
      title: "Explore.Title", items: [
        {title: "Profiles", url: `/${locale}/explore`},
        {title: "Coronavirus", url: `/${locale}/coronavirus`},
        {title: "ECI Explorer.Title", url: `/${locale}/eci/explore`}
        // {title: "Viz Builder",      url: `/${locale}/vizbuilder`},
        // {title: "Data Cart",        url: `/${locale}/cart`}
      ]
    },
    /*{title: "Data", items: [
      {title: "Data sources",     url: `/${locale}/data`},
      {title: "API",              url: `/${locale}/data#api`},
      {title: "Classifications",  url: `/${locale}/data#classifications`}
    ]},*/
    {
      title: "About.Title", items: [
        // {title: "Background",       url: `/${locale}/about`},
        {title: "About.In the press", url: `/${locale}/about/press`},
        {title: "About.Glossary", url: `/${locale}/about/glossary`},
        {title: "About.Terms of use", url: `/${locale}/about/legal`},
        {title: "About.Contact us", url: "mailto:datamexico@datawheel.us?subject=Contacto equipo DataMéxico"}
      ]
    }
  ],
  LOGOS: [
    {
      title: "Secrataría de Economía",
      url: "https://www.gob.mx/se/",
      src: "SE.png"
    },
    // {
    //   title: "Mexicans and Americans Thinking Together",
    //   url: "https://www.facebook.com/MexicansAndAmericansThinkingTogether",
    //   src: "matt-white.svg"
    // },
    {
      title: "Datawheel",
      url: "https://www.datawheel.us/",
      src: "datawheel-white.svg"
    }
  ],
  SOCIAL_MEDIA: [
    {
      title: "Twitter",
      url: "https://twitter.com/DataMexico_",
      src: "twitter.svg"
    },
    {
      title: "Facebook",
      url: "https://www.facebook.com/DataM%C3%A9xico-115429396917605/",
      src: "facebook.svg"
    },
    {
      title: "Instagram",
      url: "https://www.instagram.com/se.datamexico/",
      src: "instagram.svg"
    },
    {
      title: "YouTube",
      url: "https://www.youtube.com/channel/UCsNIaF3LijPsSiILPq_H6kw",
      src: "youtube.svg"
    }
  ],
  HOME_NAV: [
    {
      icon: "/icons/homepage/svg/explore-profiles-icon.svg",
      link: "explore",
      title: "Profiles",
      text: "Homepage.ProfileText"
    },
    {
      icon: "/icons/homepage/svg/coronavirus-icon.svg",
      link: "coronavirus",
      title: "Coronavirus",
      text: "Homepage.CoronavirusText"
    },
    {
      icon: "/icons/homepage/svg/complejidad-economica-icon.svg",
      link: "eci/explore",
      title: "Complexity",
      text: "Homepage.ComplexityText"
    }
  ]
};
