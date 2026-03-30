export enum Province {
	QC = 'QC',
	ON = 'ON',
	NL = 'NL',
	NS = 'NS',
	PE = 'PE',
	NB = 'NB',
	MB = 'MB',
	SK = 'SK',
	AB = 'AB',
	BC = 'BC',
	YT = 'YT',
	NT = 'NT',
	NU = 'NU'
}

export class AddressConstants {
	constructor() {}

	static readonly ADDRESS_API_TAG = 'Address';
	static readonly ADDRESS_PREFIX = 'customer/:customerId/address';
	static readonly ID = 'id';
	static readonly CUSTOMER_ID = 'customerId';
	static readonly ACCESS_TOKEN_TYPE = 'access-token';
}
