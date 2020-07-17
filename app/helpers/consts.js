const locale = "es";

module.exports = {
  SIDEBAR_NAV: [
    {title: "Explore", url: `/${locale}/explore`, items: [
      {title: "Cities & Places",  url: `/${locale}/explore?profile=geo`},
      {title: "Products",         url: `/${locale}/explore?profile=product`},
      {title: "Industries",       url: `/${locale}/explore?profile=industry`},
      {title: "Occupations",      url: `/${locale}/explore?profile=occupation`},
      {title: "Universities",     url: `/${locale}/explore?profile=institution`}
    ]},
    // {title: "Viz Builder",        url: `/${locale}/vizbuilder`},
    // {title: "Data Cart",          url: `/${locale}/cart`},
    {title: "Coronavirus",        url: `/${locale}/coronavirus`},
    {title: "ECI Explorer.Title",       url: `/${locale}/eci/explore`},
    {title: "About DataMexico",   url: `/${locale}/about`},
    //{title: "Data sources",       url: `/${locale}/data`}
  ],
  FOOTER_NAV: [
    {title: "Explore", items: [
      {title: "Profiles",         url: `/${locale}/explore`},
      {title: "Coronavirus",        url: `/${locale}/coronavirus`},
      {title: "ECI Explorer.Title",     url: `/${locale}/eci/explore`}
      // {title: "Viz Builder",      url: `/${locale}/vizbuilder`},
      // {title: "Data Cart",        url: `/${locale}/cart`}
    ]},
    /*{title: "Data", items: [
      {title: "Data sources",     url: `/${locale}/data`},
      {title: "API",              url: `/${locale}/data#api`},
      {title: "Classifications",  url: `/${locale}/data#classifications`}
    ]},*/
    {title: "About", items: [
      // {title: "Background",       url: `/${locale}/about`},
      {title: "In the press",     url: `/${locale}/about/press`},
      // {title: "Team",             url: `/${locale}/about/team`},
      {title: "Glossary",         url: `/${locale}/about/glossary`},
      {title: "Terms of use",     url: `/${locale}/about/legal`},
      {title: "Contact us",       url: "mailto:datamexico@datawheel.us?subject=Contacto equipo DataMéxico"}
    ]}
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
  ]
};
