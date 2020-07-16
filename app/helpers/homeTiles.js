module.exports = {
  geo: {
    name: "Cities & Places",
    dimension: "Geography",
    background: "#8b9f65",
    items: [1, 9007, 13, 9, 32001],
    levels: [
      {name: "Nation", count: 1},
      {name: "State", count: 32},
      {name: "Municipality", count: 2464}
    ]
  },
  industry: {
    dimension: "Industry",
    background: "#f5c094",
    items: [6221, 5611, 6111, 2122, 8111],
    name: "Industries",
    levels: [
      {name: "Sector", count: 22},
      {name: "Subsector", count: 107},
      {name: "Industry Group", count: 379},
      {name: "NAICS Industry", count: 776},
      {name: "National Industry", count: 1207},
    ]
  },
  occupation: {
    dimension: "Occupation Actual Job",
    background: "#68adcd",
    items: [2332, 2253, 4211, 9111, 2412],
    name: "Occupations",
    levels: [
      {name: "Category", count: 9},
      {name: "Group", count: 53},
      {name: "Subgroup", count: 156},
      {name: "Occupation", count: 467}
    ]
  },
  product: {
    dimension: "Product",
    background: "#ea8db2",
    items: [178703, 20804, 52603, 168504, 209401],
    name: "Products",
    levels: [
      {name: "Chapter", count: 21},
      {name: "HS2", count: 96},
      {name: "HS4", count: 1224},
      {name: "HS6", count: 5205}
    ]
  },
  institution: {
    dimension: "Campus",
    background: "#e7d98c",
    items: [317, 248, 683, 725, 82],
    name: "Universities",
    levels: [
      {name: "Institution", count: 3430}
    ]
  }
};
