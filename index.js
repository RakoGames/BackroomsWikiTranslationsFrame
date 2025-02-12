const fetch = require('node-fetch');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors({credentials: true, origin: true}));

const port = process.env.PORT || 4000;
const embedWidth = 350;

let templates = ['<a target="_top" href="HOST/URL"><img src="FLAG" class="image" alt="ALT"></a>',
    '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="FLAG" class="image" alt="ALT"></a><a class="expanded" target="_top" href="HOST/URL">NAME</a></div>',
    '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="FLAG" class="image" alt="ALT"></a><a class="expanded" target="_top" href="HOST/URL">NAME</a></div>'];

let results = require('./branches.json');

htmlCode = fs.readFileSync('website.html').toString()
app.get('/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    const url = req.query.url ?? '';
    const branch = req.query.branch ?? '';
    const color = req.query.color ?? '';
    let result = '';
    let count = 0;
    let branches = {};
    let wsmol = 20;
    let wmid = 0;
    let wbig = 0;

    for (const lang in results) {
        if (branch == lang.toLowerCase()) { continue }
        await CheckSite(results[lang].host, url, results[lang].title) ? (() => {
            branches[lang] = true;
            count++;
            wsmol += 20;
            wmid += 44;
            wbig += results[lang].width;
        })() : branches[lang] = false;
    }

    for (const lang in branches) {
        if (branches[lang]) {
            result += templates[wmid < embedWidth ? (wbig < embedWidth ? 2 : 1) : 0].replaceAll("HOST", results[lang].host).replaceAll("URL", url).replaceAll("FLAG", results[lang].flag).replaceAll("ALT", results[lang].alt).replaceAll("NAME", results[lang].name[(wbig < embedWidth ? 1 : 0)]);
        }
    }

    res.send(htmlCode.replaceAll("THING GOES HERE", result).replaceAll("COLOR", /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) ? color : "000"));
});
app.listen(port, () => console.log(`Service Started at link: http://localhost:${port}`));

CheckSite = function(host, url, title) {
    return new Promise(async (resolve, reject) => {
        res = await (await fetch(`${host}/${url ?? ''}`)).text();
        console.log(host.split("//")[1].split(".wikidot")[0] + " " + res.split('<title>')[1]?.split('</title>')[0]);
        resolve(!res.includes(`<title>${title}</title>`));
    });
}
