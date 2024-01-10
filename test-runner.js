const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const mocha = new Mocha();

// Add each .js file to the mocha instance
fs.readdirSync(path.join(__dirname, 'tests')).filter(file => file.endsWith('.js')).forEach(file => {
  mocha.addFile(path.join(__dirname, 'tests', file));
});

// Run the tests
mocha.run((failures) => {
  process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
});
