interface SuccessResponse<T> {
  title: "success";
  message: string;
  data: T;
}

export const responseFormatter = <T>(
  message = "Success",
  data: T,
): SuccessResponse<T> => ({
  title: "success",
  message,
  data,
});
