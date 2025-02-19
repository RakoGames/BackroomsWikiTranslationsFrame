const fetch = require('node-fetch');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors({ credentials: true, origin: true }));

const port = process.env.PORT || 4000;

let template = '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="FLAG" class="image" alt="ALT"></a><a class="expanded" target="_top" href="HOST/URL">NAME</a></div>';

let branches = require('./branches.json');

htmlCode = fs.readFileSync('website.html').toString()
app.get('/translations', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    const url = req.query.url !== "{$url}" ? req.query.url : '';
    const branch = req.query.branch !== "{$branch}" ? req.query.branch : '';
    const theme = req.query.theme !== "{$theme}" ? req.query.theme : '';
    const siteid = req.get('Referrer').split("//")[1].split(".wikidot")[0];

    let result = '';
    let count = 0;
    let matches = {};

    for (const lang in branches) {
        if (branch == lang.toLowerCase()) { continue }
        await CheckSite(branches[lang].host, url, branches[lang].title) ? (() => {
            matches[lang] = true;
            count++;
        })() : matches[lang] = false;
    }

    for (const lang in matches) {
        if (matches[lang]) {
            result += template.replaceAll("HOST", branches[lang].host).replaceAll("URL", url).replaceAll("FLAG", branches[lang].flag).replaceAll("ALT", branches[lang].alt).replaceAll("NAME", branches[lang].name[1]);
        }
    }

    res.send(htmlCode.replaceAll("THING GOES HERE", result).replaceAll("THEME", theme).replaceAll("SITEID", siteid));
});
app.listen(port, () => console.log(`Service Started at link: http://localhost:${port}`));

CheckSite = function(host, url, title) {
    return new Promise(async (resolve, reject) => {
        try {
            res = await (await fetch(`${host}/${url ?? ''}`)).text();
            //console.log(host.split("//")[1].split(".wikidot")[0] + " " + res.split('<title>')[1]?.split('</title>')[0]);
            resolve(!res.includes(`<title>${title}</title>`));
        } catch {
            resolve(false);
        }
    });
}
