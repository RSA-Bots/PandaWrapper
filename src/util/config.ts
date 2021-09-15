import type { ApplicationData } from "../interface/applicationData";

let token: string | undefined;
let reqDb: boolean | undefined;
let dbUri: string | undefined;
let prefix: string | undefined;

export function loadConfig(applicationData: ApplicationData): void {
	token = applicationData.token;
	reqDb = applicationData.reqDb;
	dbUri = applicationData.dbUri;
	prefix = applicationData.prefix;
}

export function getToken(): string | undefined {
	return token;
}

export function getReqDb(): boolean | undefined {
	return reqDb;
}

export function getDbUri(): string | undefined {
	return dbUri;
}

export function getPrefix(): string | undefined {
	return prefix;
}
