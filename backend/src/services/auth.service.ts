import prisma from "../prisma/client";
import { comparePasswords, hashPassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

export const signup = async (
	name: string,
	email: string,
	phone: string,
	password: string,
	region: string
) => {
	if (!name || !phone || !password || !region)
		throw new Error("All Input fields should be submitted");

	const exisiting = await prisma.user.findUnique({
		where: { phone },
	});
	if (exisiting) throw new Error("Phone Number is already in use");
	// if (exisiting) throw new Error("ስልክ ቁጥሩ ሌላ ተጠቃሚ ይዞታል");

	const hashed = await hashPassword(password);
	const user = await prisma.user.create({
		data: {
			name,
			email,
			phone,
			password: hashed,
			region,
		},
	});

	const accessToken = generateAccessToken(user.id);
	const refreshToken = generateRefreshToken(user.id);

	return { accessToken, refreshToken };
};
export const login = async (phone: string, password: string) => {
	if (!phone || !password)
		throw new Error("All Input fields should be submitted");

	const user = await prisma.user.findUnique({
		where: { phone },
	});
	if (!user) throw new Error("Invalid Phone");
	// if (!user) throw new Error("ስልክ ቁጥሩ ሌላ ተጠቃሚ ይዞታል");
	const valid = await comparePasswords(password, user.password);
	if (!valid) throw new Error("Invalid Password");

	const accessToken = generateAccessToken(user.id);
	const refreshToken = generateRefreshToken(user.id);

	return { accessToken, refreshToken };
};
