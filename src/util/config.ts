import type { ApplicationData } from "../interface/applicationData";

let config: ApplicationData;

export function loadConfig(applicationData: ApplicationData): void {
	config = applicationData;
}

export function getToken(): string | undefined {
	return config.token;
}

export function getReqDb(): boolean | undefined {
	if (config.reqDb === "true" || config.reqDb === "false") return new Boolean(config.reqDb).valueOf();
	return undefined;
}

export function getDbUri(): string | undefined {
	return config.dbUri;
}

export function getPrefix(): string | undefined {
	return config.prefix;
}
