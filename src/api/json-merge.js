const jsonfile = require('jsonfile');
const fs = require('fs/promises');
const YapiToSwagger = require('./YapiToSwagger.js');
const newFile = __dirname + '/new-api-docs.json';
mergeJson();

async function mergeJson() {
  try {
    const specFiles = await fs.readdir(__dirname + '/api_specs');
    const readFilePromises = specFiles
      .filter(filename => /\.json$/.test(filename))
      .map(filename => {
        return jsonfile.readFileSync(__dirname + '/api_specs/' + filename, {
          endoding: 'utf8',
        });
      });
    // merge all json spec files into a single josn object
    await Promise.all(readFilePromises).then(objs => {
      const json = YapiToSwagger(objs[0]);
      jsonfile.writeFile(newFile, json);
    });
  } catch (error) {
    console.error(error);
  }
}
