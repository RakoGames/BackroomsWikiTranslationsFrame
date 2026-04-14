// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "jsr:@supabase/supabase-js/cors";
import branches from "./branches.json" with { type: "json" };
import htmlCode from "./website.json" with { type: "json" };

const cacheDuration = 15 * 60; // seconds

Deno.serve(async (req) => {
  try {
    // CORS Check
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: {...corsHeaders, 'Access-Control-Allow-Headers': 'url, branch, theme, site'}})
    }
    
    // Initialize Supabase Database Client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );
    

    // Flag Template
    // HOST is the branch url
    // URL is the page UNIX url
    // NAME is the branch's language name
    // FLAG is the branch's flag url
    // ALT is the flag's alt text
    let template = '<a style="padding: 0 5%;" target="_top" href="HOST/URL"><img src="FLAG" class="image" alt="ALT"></a>';

    // Get the request parameters
    const query = req.headers;
    const url = query.get("url") !== "{$url}" ? query.get("url") : "";
    const branch = query.get("branch") !== "{$branch}" ? query.get("branch") : "";
    const theme = query.get("theme") !== "{$theme}" ? query.get("theme") : "";
    const siteid = query.get("site") ?? 'backrooms-wiki';


    const SQLData = (await supabase.from("Branches").select("*").eq('url', url)).data;
    let result = "";
    let isCached = SQLData.length > 0 && Date.now() - SQLData[0].date < cacheDuration * 1000;

    if (SQLData.length == 0) { SQLData[0] = { 'url': url }; }

    // Go through each branch
    for (const lang in branches) {
      // Skip the current branch
      if (branch == lang.toLowerCase()) { SQLData[0][lang] = true; continue; }

      // Check if the page exists in the branch
      if(isCached ? SQLData[0][lang] == true : await CheckSite(branches[lang].host, url, branches[lang].title)) {
          // Generate the resulting page
          result += template.replaceAll("HOST", branches[lang].host).replaceAll("URL", url).replaceAll("FLAG", branches[lang].flag).replaceAll("ALT", branches[lang].alt).replaceAll("NAME", branches[lang].name[1]);
          SQLData[0][lang] = true;
      } else {
        SQLData[0][lang] = false;
      }

      console.log(`URL: ${url}, isCached: ${isCached}, SQLData[0][${lang}] = ${SQLData[0][lang]}`);
    }

    SQLData[0].date = Date.now();

    if (!isCached) await supabase.from("Branches").upsert(SQLData[0], { onConflict: 'url' });
    
    let page = htmlCode["htmlCode"].replaceAll("THING GOES HERE", result).replaceAll("THEME", theme).replaceAll("SITEID", siteid);

    // Return the page
    return new Response(page, {
      headers: {...corsHeaders, "Content-Type": "text/plain"},
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ message: err?.message ?? err }), {
      headers: {...corsHeaders, "Content-Type": "application/json"},
      status: 500 
    })
  }
})

let CheckSite = function(host, url, title) {
    console.log(`HI, LangURL: ${host}/${url}`);
    return new Promise(async (resolve, reject) => {
        try {
            // Get the page's source
            let res = await (await fetch(`${host}/${url ?? ""}`)).text();

            // Check if it exists
            resolve(!res.includes(`<title>${title}</title>`));
        } catch (error) {
            resolve(false);
        }
    });
}
