module.exports = (plop) => {

  plop.setActionType('checkFileExists', (answers, config, plop) => {
    var fs = require('fs');
    try {
      fs.unlinkSync(config.file)
    } catch { }

    var menu = {
      "data": answers.menu || []
    }

    var menuString = JSON.stringify(menu);
    fs.writeFile("public/data/menu.json", menuString, function (err, result) {
      if (err) console.log('error', err);
    });

  });

  plop.setActionType('updateFileContent', (answers, config, plop) => {

    var fs = require('fs')
    fs.readFile(config.file, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/\$\{menu\}/g, answers.menu);

      fs.writeFile(config.file, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });

  });

  plop.setGenerator("app", {
    description: "App JS generation using options",
    prompts: [
      {
        type: "input",
        name: "menu",
        message: "Menu Options: ",
        default: [{ href: '/page1', name: 'Hello Page1', servicePath: 'products' },
        { href: '/page3', name: 'Page 3', servicePath: 'products1' }]
      }
    ],
    actions: [
      {
        type: 'checkFileExists',
        file: 'src/App.js'
      },
      {
        type: "addMany",
        destination: "src/",
        templateFiles: "templates/app/*.hbs",
        base: "templates/app",
      },
    ],
  });
};
