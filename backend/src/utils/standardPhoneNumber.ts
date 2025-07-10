export const standardPhone = (input: string): string => {
	let standard = input.replace(/[^+\d]/g, "");

	if (
		!standard.startsWith("+2519") ||
		!standard.startsWith("2519") ||
		!standard.startsWith("09")
	) {
		throw new Error("Incorrect Phone Format");
	} else if (standard.startsWith("09")) {
		return standard.replace(/^09/, "+2519");
	} else if (standard.startsWith("251")) {
		return "+" + standard;
	} else if (standard.startsWith("+251")) {
		return standard;
	}
	return standard;
};
