const axios = require("axios");

const BASE_URL = "/api/about/:lng";
const BACKGROUND = {
	es: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=0",
	en: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1933443601"
};
const PRESS = {
	es: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1846034667",
	en: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=282384783"
}
const GLOSSARY = {
	es: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1714281129",
	en: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=758368925"
}
const LEGAL = {
	es: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1918198501",
	en: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1295801580"
}
const VERSIONS = {
	es: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=257728479",
	en: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1810252159"
}
/*const CHALLENGES = {
	es: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=180037722",
	en: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1222752537"
}*/
const INFOAPI = {
	es: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=2067915636",
	en: "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1686248389"
}

module.exports = function (app) {
	app.get(BASE_URL, async (req, res) => {
		const lng = req.params.lng;
		try {
			await axios
				.all([axios.get(BACKGROUND[lng]), axios.get(PRESS[lng]), axios.get(GLOSSARY[lng]), axios.get(LEGAL[lng]), axios.get(VERSIONS[lng]), axios.get(INFOAPI[lng])])
				.then(axios.spread((...resp) => {
					const dictionary = {
						0: {Texto: "Text"},
						1: {Fecha: "Date", Plataforma: "Platform", Medio: "Media", Titular: "Title", Descripción: "Text", Fotografía: "Picture", URL: "URL"},
						2: {Concepto: "Concept", Descripción: "Description"},
						3: {Título: "Title", Descripción: "Description"},
						4: {Versión: "Version", Caracteristicas: "Features", Descripción: "Description"},
					//	5: {Desafío: "Challenge", Descripción: "Description", Lugar: "Position", Proyectos: "Project", Explicación: "Explanation", URL: "URL"},
						5: {Texto: "Text", Concepto: "Concept", Descripción: "Description", Link: "Link"},
					}
					const respData = resp.map(d => d.data);
					const csvData = respData.map((respItem, respIndex) => {
						const csv = respItem.split("\r\n").map(d => d.split("\t"));
						const csvHeader = csv[0];
						const csvDictionary = dictionary[respIndex];
						const data = csv.slice(1).reduce((all, d) => {
							const item = {};
							respIndex === 2 && (item["Initial"] = d[0].charAt(0).toUpperCase()); //Initials for glossary
							csvHeader.forEach((h, i) => {
								item[csvDictionary[h]] = d[i] !== "" ? d[i] : null;
							});
							all.push(item);
							return all;
						}, []);
						return data;
					});

					csvData[1].forEach(d => {
						const date = d.Date.split("-");
						const dateID = date[2] + date[1] + date[0];
						return d["Date ID"] = dateID
					})

					res.json({
						background: csvData[0],
						press: csvData[1],
						glossary: csvData[2],
						terms: csvData[3],
						version: csvData[4],
						//challenge: csvData[5],
						infoapi: csvData[5]
					});
				}));
		} catch (e) {
			console.log(e);
			return [];
		}
	});

};
