import { Param, ParseUUIDPipe } from "@nestjs/common";

export interface UUIDParamOptions {
	version?: "3" | "4" | "5";
}

export function UUIDParam(property: string, options: UUIDParamOptions = {}) {
	const { version = "4" } = options;
	return Param(
		property,
		new ParseUUIDPipe({
			version,
			errorHttpStatusCode: 400,
		})
	);
}
