const YapiToSwagger = schema => {
  try {
    const data = JSON.parse(JSON.stringify(schema));
    const schemas = data.components?.schemas ?? {};
    Schema(data, schemas);
    if (data.components && data.components.schemas) data.components.schemas = schemas;
    return data;
  } catch (e) {
    console.log(e);
  }
};

const Schema = (data, schemas) => {
  const paths = data.paths;
  Object.keys(paths).forEach(key => {
    Object.keys(paths[key]).forEach(method => {
      const parameters = paths[key][method]['parameters'];
      if (parameters?.length) {
        if (method === 'post') {
          for (let item of parameters) {
            const schema = item?.['schema'];
            if (schema) {
              mapping(schema, schemas);
            }
          }
        }
      }
      for (let status_code of ['200', '201']) {
        const response = paths[key][method]['responses'][status_code]?.['content']['application/json']['schema'];
        mapping(response, schemas);
      }
    });
  });
};

const mapping = (data, schemas) => {
  if (!data || (data && !data.properties && !data.items)) {
    if (data?.type === 'object' && !data?.properties) {
      delete data?.$ref;
    }
    return;
  }
  if (data['$unifiedResRef']) {
    const tempArr = data['$unifiedResRef'].split('/');
    const name = tempArr[tempArr.length - 1];
    const properties = data.properties;
    if (!schemas[name]) {
      schemas[name] = {
        type: 'object',
        properties,
      };
    }
    delete data.properties;
    data.$ref = data['$unifiedResRef'];
    delete data['$unifiedResRef'];
  }
  if (data.type === 'object') {
    if (data.$ref) {
      const tempArr = data.$ref.split('/');
      const name = tempArr[tempArr.length - 1];
      if (!schemas[name]) {
        schemas[name] = {
          type: data.type,
          properties: JSON.parse(JSON.stringify(data.properties)),
          title: name,
          required: data.required,
          description: data.description,
        };
        Object.keys(schemas[name].properties).forEach(key => {
          mapping(schemas[name]['properties'][key]);
        });
      }
      delete data.properties;
      delete data.type;
      delete data.required;
      delete data.description;
      data.$ref = `#/components/schemas/${name}`;
    }
  }
  if (data.type === 'array') {
    if (data.items.$ref) {
      const tempArr = data.items.$ref.split('/');
      const name = tempArr[tempArr.length - 1];
      if (!schemas[name] && data.items.properties) {
        schemas[name] = {
          type: data.items.type,
          properties: JSON.parse(JSON.stringify(data.items.properties)),
          title: name,
          required: data.items.required,
          description: data.items.description,
        };
        Object.keys(schemas[name].properties).forEach(key => {
          mapping(schemas[name].properties[key]);
        });
      }
      delete data.items.type;
      delete data.items.properties;
      delete data.items.required;
      delete data.items.description;
      data.items.$ref = `#/components/schemas/${name}`;
    }
  }
};

module.exports = YapiToSwagger;
