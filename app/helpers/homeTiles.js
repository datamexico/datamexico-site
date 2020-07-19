module.exports = {
  geo: {
    name: "Cities & Places",
    dimension: "Geography",
    background: "#8b9f65",
    items: [9, 19039, 14039, 17, 17007],
    levels: [
      {name: "Nation", count: 1},
      {name: "State", count: 32},
      {name: "Municipality", count: 2464}
    ],
    subtitle: "Más importantes"
  },
  industry: {
    dimension: "Industry",
    background: "#f5c094",
    items: [21, 52, 62, "31-33", 23],
    name: "Industries",
    levels: [
      {name: "Sector", count: 22},
      {name: "Subsector", count: 107},
      {name: "Industry Group", count: 379},
      {name: "NAICS Industry", count: 776},
      {name: "National Industry", count: 1207},
    ],
    subtitle: "Más buscadas"
  },
  occupation: {
    dimension: "Occupation Actual Job",
    background: "#68adcd",
    items: [24, 2122, 2253, 3132, 61],
    name: "Occupations",
    levels: [
      {name: "Category", count: 9},
      {name: "Group", count: 53},
      {name: "Subgroup", count: 156},
      {name: "Occupation", count: 467}
    ],
    subtitle: "1er semestre 2020"
  },
  product: {
    dimension: "Product",
    background: "#ea8db2",
    items: [527, 1787, 1685, 1471, 1890],
    name: "Products",
    subtitle: "Más exportados",
    levels: [
      {name: "Chapter", count:21},
      {name: "HS2", count:96},
      {name: "HS4", count:1217},
      {name: "HS6", count:4957}
    ]
  },
  institution: {
    dimension: "Campus",
    background: "#e7d98c",
    items: [317, 248, 725, 1101, 82],
    name: "Universities",
    levels: [
      {name: "Institution", count: 3430}
    ],
    subtitle: "Más populares"
  }
};
