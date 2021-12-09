ajv validate -s data/schema/icao.json -d data/icao.json  &&
ajv validate -s data/schema/airports.json -d data/airports.json &&
html5validator --config html5validation.yml &&
eslint "js/*.js" --ext .js
