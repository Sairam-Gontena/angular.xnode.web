const generateConfig = () => {
    var fs = require('fs');
    var path = require('path');
    var CWD = process.cwd()
    var schemaPath = path.join(CWD, "schema.json")
    if (!fs.existsSync(schemaPath)) {
        console.log('schema file is not available')
        return
    }

    var data = fs.readFileSync('schema.json', 'utf8');
    var schema = JSON.parse(data);
    let menuOptions = []

    for (const key of Object.keys(schema)) {
        let entity = schema[key]
        menuOptions.push({ href: "/" + key, code: key, name: entity.page_title, servicePath: entity.service_path })
    }
    let menuStr = JSON.stringify({ data: menuOptions })
    fs.writeFileSync(path.join(CWD, "public", "config", "menu.json"), menuStr, function (err, result) {
        if (err) { console.log('error', err) };
        console.log("Result of file write:", result);
    });

    fs.writeFileSync(path.join(CWD, "public", "config", "schema.json"), data, function (err, result) {
        if (err) { console.log('error', err) };
        console.log("Result of schema.json write:", result);
    });

}

generateConfig()