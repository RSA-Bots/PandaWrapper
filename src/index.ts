import { readFileSync } from "fs";
import { initClient } from "./client/client";
import { connectDatabase } from "./db/database";
import type { ApplicationData } from "./interface/applicationData";
import { getReqDb, loadConfig } from "./util/config";

const applicationData = JSON.parse(readFileSync("token.json", "utf-8")) as ApplicationData;

loadConfig(applicationData);

const dbRequired = getReqDb();
let dbConnected = false;

if (dbRequired) {
	dbConnected = connectDatabase();
}

if (dbRequired && !dbConnected) throw new Error("Failed to connect to required database.");

void initClient();
