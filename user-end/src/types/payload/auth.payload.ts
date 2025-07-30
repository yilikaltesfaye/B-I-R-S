export interface RequestOtpPayload {
	phone: string;
	type: "forgetpassword" | "newaccount";
}

export interface VerifyOtpPayload {
	phone: string;
	code: string;
	verificationId: string;
}

export interface RegisterPayload {
	phone: string;
	password: string;
	fullname: string;
	appContext: "admin" | "user" | "authority";
	email?: string;
	guestToken?: string;
	address: {
		region: string;
		zone: string;
		woreda: string;
		city: string;
		subCity: string;
		kebele: string;
	};
}

export interface LoginPayload {
	phone: string;
	password: string;
	appContext: "admin" | "user" | "authority";
}
