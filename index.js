const fetch = require('node-fetch');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const mediumThreshold = 8;
const largeThreshold = 5;

let results = {
    AR: {
        host: 'http://ar-backrooms-wiki.wikidot.com',
        title: 'الغرف الخلفية',
        href: ['<a target="_top" href="HOST/URL"><img src="https://cdn3.iconfinder.com/data/icons/142-mini-country-flags-16x16px/32/flag-saudi-arabia2x.png" class="image" alt="flag-saudi-arabia2x.png"></a>',
            '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="https://cdn3.iconfinder.com/data/icons/142-mini-country-flags-16x16px/32/flag-saudi-arabia2x.png" class="image" alt="flag-saudi-arabia2x.png"></a><a class="expanded" target="_top" href="HOST/URL">AR</a></div>',
            '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="https://cdn3.iconfinder.com/data/icons/142-mini-country-flags-16x16px/32/flag-saudi-arabia2x.png" class="image" alt="flag-saudi-arabia2x.png"></a><a class="expanded" target="_top" href="HOST/URL">Arabic</a></div>'],
        miss: ''
    },
    CN: {
        host: 'http://backrooms-wiki-cn.wikidot.com',
        title: 'The Backrooms中文维基',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/china" class="image" alt="china"></a>',
            '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/china" class="image" alt="china"></a><a class="expanded" target="_top" href="HOST/URL">CN</a></div>',
            '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/china" class="image" alt="china"></a><a class="expanded" target="_top" href="HOST/URL">Chinese</a></div>'],
        miss: ''
    },
    DE: {
        host: 'http://de-backrooms-wiki.wikidot.com',
        title: 'Das Backrooms Wiki auf Deutsch',
        href: ['<a target="_top" href="HOST/URL"><img src="https://cdn3.iconfinder.com/data/icons/142-mini-country-flags-16x16px/32/flag-germany2x.png" class="image" alt="flag-germany2x.png"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="https://cdn3.iconfinder.com/data/icons/142-mini-country-flags-16x16px/32/flag-germany2x.png" class="image" alt="flag-germany2x.png"></a><a class="expanded" target="_top" href="HOST/URL">DE</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="https://cdn3.iconfinder.com/data/icons/142-mini-country-flags-16x16px/32/flag-germany2x.png" class="image" alt="flag-germany2x.png"></a><a class="expanded" target="_top" href="HOST/URL">German</a></div>'],
        miss: ''
    },
    EN: {
        host: 'https://backrooms-wiki.wikidot.com',
        title: 'The Backrooms',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/uk" class="image" alt="uk"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/uk" class="image" alt="uk"></a><a class="expanded" target="_top" href="HOST/URL">EN</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/uk" class="image" alt="uk"></a><a class="expanded" target="_top" href="HOST/URL">English</a></div>'],
        miss: ''
    },
    ES: {
        host: 'http://es-backrooms-wiki.wikidot.com',
        title: 'Wiki Backrooms Español',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/spain" class="image" alt="spain"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/spain" class="image" alt="spain"></a><a class="expanded" target="_top" href="HOST/URL">ES</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/spain" class="image" alt="spain"></a><a class="expanded" target="_top" href="HOST/URL">Spanish</a></div>'],
        miss: ''
    },
    FR: {
        host: 'http://fr-backrooms-wiki.wikidot.com',
        title: 'Backrooms Wiki',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/france" class="image" alt="france"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/france" class="image" alt="france"></a><a class="expanded" target="_top" href="HOST/URL">FR</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/france" class="image" alt="france"></a><a class="expanded" target="_top" href="HOST/URL">French</a></div>'],
        miss: ''
    },
    ID: {
        host: 'http://id-backrooms-wiki.wikidot.com',
        title: 'Backrooms Indonesia',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/indonesia" class="image" alt="indonesia"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/indonesia" class="image" alt="indonesia"></a><a class="expanded" target="_top" href="HOST/URL">ID</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/indonesia" class="image" alt="indonesia"></a><a class="expanded" target="_top" href="HOST/URL">Indonesian</a></div>'],
        miss: ''
    },
    IT: {
        host: 'http://it-backrooms-wiki.wikidot.com',
        title: 'Le Backrooms',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/italy" class="image" alt="italy"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/italy" class="image" alt="italy"></a><a class="expanded" target="_top" href="HOST/URL">IT</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/italy" class="image" alt="italy"></a><a class="expanded" target="_top" href="HOST/URL">Italian</a></div>'],
        miss: ''
    },
    PL: {
        host: 'http://pl-backrooms-wiki.wikidot.com',
        title: 'Backrooms Polska',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/poland" class="image" alt="poland"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/poland" class="image" alt="poland"></a><a class="expanded" target="_top" href="HOST/URL">PL</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/poland" class="image" alt="poland"></a><a class="expanded" target="_top" href="HOST/URL">Polish</a></div>'],
        miss: ''
    },
    PTBR: {
        host: 'http://pt-br-backrooms-wiki.wikidot.com',
        title: 'As Backrooms',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/portugal" class="image" alt="portugal"></a>',
               '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/portugal" class="image" alt="portugal"></a><a class="expanded" target="_top" href="HOST/URL">PT-BR</a></div>',
               '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/portugal" class="image" alt="portugal"></a><a class="expanded" target="_top" href="HOST/URL">Portuguese</a></div>'],
        miss: ''
    },
    RU: {
        host: 'http://ru-backrooms-wiki.wikidot.com',
        title: 'База данных Backrooms',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/russia" class="image" alt="russia"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/russia" class="image" alt="russia"></a><a class="expanded" target="_top" href="HOST/URL">RU</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/russia" class="image" alt="russia"></a><a class="expanded" target="_top" href="HOST/URL">Russian</a></div>'],
        miss: ''
    },
    TH: {
        host: 'http://th-backrooms-wiki.wikidot.com',
        title: 'แบ็กรูมส์',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/thai" class="image" alt="thai"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/thai" class="image" alt="thai"></a><a class="expanded" target="_top" href="HOST/URL">TH</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/thai" class="image" alt="thai"></a><a class="expanded" target="_top" href="HOST/URL">Thai</a></div>'],
        miss: ''
    },
    TOK: {
        host: 'http://backrooms-tok-wiki.wikidot.com',
        title: 'tomo monsi',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/toki" class="image" alt="toki"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/toki" class="image" alt="toki"></a><a class="expanded" target="_top" href="HOST/URL">TOK</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/toki" class="image" alt="toki"></a><a class="expanded" target="_top" href="HOST/URL">Toka Pona</a></div>'],
        miss: ''
    },
    VN: {
        host: 'http://backrooms-vn.wikidot.com',
        title: 'Backrooms Việt Nam',
        href: ['<a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/vietnam" class="image" alt="vietnam"></a>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/vietnam" class="image" alt="vietnam"></a><a class="expanded" target="_top" href="HOST/URL">VN</a></div>',
              '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/vietnam" class="image" alt="vietnam"></a><a class="expanded" target="_top" href="HOST/URL">Veitnamese</a></div>'],
        miss: ''
    },
}
htmlCode = fs.readFileSync('website.html').toString()
app.get('/', async (req, res) => {
    const url = req.query.url ?? '';
    const branch = req.query.branch ?? '';
    let result = '';
    let count = 0;
    let branches = {};

    for (const lang in results) {
        if (branch == lang.toLowerCase()) { continue }
        await CheckSite(results[lang].host, url, results[lang].title) ? (() => { branches[lang] = true; count++; })() : branches[lang] = false;
    }

    for (const lang in branches) {
        if (branches[lang]) {
            result += results[lang].href[count < mediumThreshold ? (count < largeThreshold ? 2 : 1) : 0].replaceAll("URL", url).replaceAll("HOST", results[lang].host);
        } else {
            result += results[lang].miss;
        }
    }

    res.send(htmlCode.replace("THING GOES HERE", result).replace("WIDTH", count * (count < mediumThreshold ? (count < largeThreshold ? 100 : 50) : 25)));
});
app.listen(port, () => console.log(`Service Started at link: http://localhost:${port}`));

CheckSite = function(host, url, title) {
    return new Promise(async (resolve, reject) => {
        res = await (await fetch(`${host}/${url ?? ''}`)).text();
        console.log(host.split("//")[1].split(".wikidot")[0] + " " + res.split('<title>')[1]?.split('</title>')[0]);
        resolve(!res.includes(`<title>${title}</title>`));
    });
}
