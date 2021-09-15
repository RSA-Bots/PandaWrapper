import { connect } from "mongoose";
import { getDbUri } from "../util/config";

export function connectDatabase(): boolean {
	const dbUri = getDbUri();

	if (!dbUri) throw new Error("No dbUri provided.");

	connect(dbUri).catch(console.error.bind(console));

	return true;
}
