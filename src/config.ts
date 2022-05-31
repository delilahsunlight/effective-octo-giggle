import { Config } from "./interfaces"

let config: Config;
try {
    config = require("../config.json");
} catch(error) {
    console.error(error);
    process.exit(1);
}


function closeWithError(obj:any) {
    console.error(obj);
    process.exit(1);
}

if (typeof config !== "object") {
    closeWithError("Invalid config! Object extected");
}

if (!Array.isArray(config.WEBHOOKS)) {
    closeWithError("WEBHOOKS has to be array");
}

for (const hook of config.WEBHOOKS) {
    if (typeof hook !== "string") {
        closeWithError(`String expected in WEBHOOKS[] got ${JSON.stringify(hook)}`);
    }
    if (!(hook.includes("discord.com") && hook.includes("webhooks"))) {
        closeWithError(`Invalid webgook ${hook}`);
    }
}

if (!Array.isArray(config.SCHEDULE)) {
    closeWithError("SCHEDULE has to be array");
}

for (const time of config.SCHEDULE) {
    if (typeof time !== "string") {
        closeWithError(`String expected in SCHEDULE[] got ${JSON.stringify(time)}`);
    }

    const splitTime = time.split(":").filter(e => e.length === 2).map(e=> parseInt(e, 10)).filter(e => !isNaN(e));
    if (splitTime.length !== 3) {
        closeWithError(`Incorecly formated time ${time}`);
    }
}

if (!Array.isArray(config.SERVICES)) {
    closeWithError("SERVICES has to be array");
}
if (config.SERVICES.length === 0) {
    closeWithError(`Array config.SERVICES is empty}`);
}
for (const service of config.SERVICES) {
    if (typeof service !== "object") {
        closeWithError(`Expected object SERVICES ${JSON.stringify(config.SERVICES)}`);
    }

    if (typeof service.ICON !== "string") {
        closeWithError(`Expected string SERVICE.ICON ${JSON.stringify(service.ICON)}`);
    }
    if (typeof service.SEND_RATE !== "number") {
        closeWithError(`Expected string service.SEND_RATE ${JSON.stringify(service.SEND_RATE)}`);
    }

    if (typeof service.URL !== "string") {
        closeWithError(`Expected string service.URL ${JSON.stringify(service.URL)}`);
    }
    if (!service.URL.endsWith("/")) {
        service.URL = `${service.URL}/`;
    }


    if (!Array.isArray(service.QUERIES)) {
        closeWithError(`Expected array service.QUERIES ${JSON.stringify(service.QUERIES)}`);
    }
    if (service.QUERIES.length === 0) {
        closeWithError(`Array service.QUERIES is empty}`);
    }
    for (const query of service.QUERIES) {
        
        if (typeof query.QUERY !== "string") {
            closeWithError(`Expected string query.QUERY ${JSON.stringify(query.QUERY)}`);
        }

        if (typeof query.FILTER_ID !== "number") {
            closeWithError(`Expected number query.FILTER_ID ${JSON.stringify(query.FILTER_ID)}`);
        }
    }
}


export const CONFIG = config; 