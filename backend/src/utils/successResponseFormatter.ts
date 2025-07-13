interface SuccessResponse<T> {
	status: "success";
	message: string;
	data: T;
}

export const responseFormatter = <T>(
	message = "Success",
	data: T
): SuccessResponse<T> => ({
	status: "success",
	message,
	data,
});
