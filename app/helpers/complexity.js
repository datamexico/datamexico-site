const industryLevels = [
  {name: "Industry Group", id: "Industry Group"},
  {name: "NAICS Industry", id: "NAICS Industry"},
  {name: "National Industry", id: "National Industry"}
];

const productLevels = [
  {name: "HS4", id: "HS4 4 Digit"},
  {name: "HS6", id: "HS6"}
];

export const cubes = {
  inegi_denue: {
    name: "DENUE",
    cube: "inegi_denue",
    isAgg: true,
    measures: [
      {title: "Companies", id: "Companies"},
      {title: "Employees", id: "Number of Employees Midpoint"}
    ],
    levels: industryLevels,
    timeDrilldown: "Month",
    time: [
      {name: "2020-S1", id: 20200417},
      {name: "2019-S2", id: 20191114},
      {name: "2019-S1", id: 20190410},
      {name: "2018-S2", id: 20181130},
      {name: "2018-S1", id: 20180327},
      {name: "2017-S2", id: 20171115},
      {name: "2017-S1", id: 20170331},
      {name: "2016-S2", id: 20161031},
      {name: "2016-S1", id: 20160115},
      {name: "2015-S1", id: 20150225}
    ]
  },
  inegi_economic_census: {
    name: "Economic Census",
    cube: "inegi_economic_census",
    isAgg: false,
    measures: [
      {title: "Economic Unit", id: "Economic Unit"},
      {title: "Total Gross Production", id: "Total Gross Production"}
    ],
    levels: industryLevels,
    timeDrilldown: "Year",
    time: [
      {name: "2014", id: 2014},
      {name: "2009", id: 2009},
      {name: "2004", id: 2004}
    ]
  },
  inegi_enoe: {
    name: "ENOE",
    cube: "inegi_enoe",
    isAgg: true,
    measures: [
      {title: "Workforce", id: "Workforce"}
    ],
    levels: industryLevels,
    timeDrilldown: "Quarter",
    time: [
      {name: "2020-Q1", id: 20201},
      {name: "2019-Q4", id: 20194},
      {name: "2019-Q3", id: 20193}
    ]
  },
  economy_foreign_trade_mun: {
    name: "Foreign Trade",
    cube: "economy_foreign_trade_mun",
    isAgg: true,
    measures: [
      {title: "Trade Value", id: "Trade Value"}
    ],
    levels: productLevels,
    timeDrilldown: "Date Year",
    time: [
      {name: "2019", id: 2019},
      {name: "2018", id: 2018},
      {name: "2017", id: 2017},
      {name: "2016", id: 2016},
      {name: "2015", id: 2015},
      {name: "2014", id: 2014}
    ]
  }
};
