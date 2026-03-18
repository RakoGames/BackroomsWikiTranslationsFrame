// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "jsr:@supabase/supabase-js/cors";
import branches from "./branches.json" with { type: "json" };
import htmlCode from "./website.json" with { type: "json" };

Deno.serve(async (req) => {
  try {
    // CORS Check
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: {...corsHeaders, 'Access-Control-Allow-Headers': 'url, branch, theme, site'}})
    }
    /*
    // Initialize Supabase Database Client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // TODO: Change the table_name to your table
    const { data, error } = await supabase.from("table_name").select("*")

    if (error) {
      throw error
    }
    */

    // Flag Template
    let template = '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="FLAG" class="image" alt="ALT"></a><a class="expanded" target="_top" href="HOST/URL">NAME</a></div>';

    // Get the request parameters
    const query = req.headers;
    const url = query.get("url") !== "{$url}" ? query.get("url") : "";
    const branch = query.get("branch") !== "{$branch}" ? query.get("branch") : "";
    const theme = query.get("theme") !== "{$theme}" ? query.get("theme") : "";
    const siteid = query.get("site") ?? 'backrooms-wiki';

    // To be populated with found Branches
    let matches = {};
    let result = ""

    // Go through rach branch
    for (const lang in branches) {
        // Skip the current branch
        if (branch == lang.toLowerCase()) { continue; }

        // Check if the page exists in the branch
        if(await CheckSite(branches[lang].host, url, branches[lang].title)) {
            // Generate the resulting page
            result += template.replaceAll("HOST", branches[lang].host).replaceAll("URL", url).replaceAll("FLAG", branches[lang].flag).replaceAll("ALT", branches[lang].alt).replaceAll("NAME", branches[lang].name[1]);
        };
    }
    
    let page = htmlCode["htmlCode"].replaceAll("THING GOES HERE", result).replaceAll("THEME", theme).replaceAll("SITEID", siteid);

    console.log(page);

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
