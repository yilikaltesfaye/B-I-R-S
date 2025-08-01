const RegisterPage = () => {
	return (
		<div>
			<h1 className="text-5xl ">Register</h1>
			<form>
				<label htmlFor="phone">Phone</label>
				<input
					type="tel"
					name="phone"
					id="phone"
					placeholder="+251 93 968 4404"
				/>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					placeholder="enter your Password Here"
				/>
			</form>
		</div>
	);
};

export default RegisterPage;
