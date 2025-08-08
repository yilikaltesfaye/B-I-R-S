// Authority users don't create reports - they manage existing ones
// This page should redirect to dashboard
import { useState } from "react";
import { useNavigate } from "react-router";

export default function CreateReportPage() {
	const navigate = useNavigate();
	const createReportMutation = useCreateReport();
	const { data: categoriesResponse, isLoading, error } = useAllCategories();
	const categories = categoriesResponse ?? [];

	const [description, setDescription] = useState("");
	const [categoryId, setCategoryId] = useState<number | "">("");
	const [address, setAddress] = useState({
		region: "",
		zone: "",
		woreda: "",
		city: "",
		subCity: "",
		kebele: "",
	});
	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error loading categories.</p>;
	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!categoryId) return alert("Please select a category");
		if (!description.trim()) return alert("Description is required");
		if (!address.region.trim()) return alert("Region is required");

		createReportMutation.mutate(
			{ categoryId: Number(categoryId), description, address },
			{
				onSuccess: () => navigate("/reports"),
			}
		);
	};

	return (
		<div className="p-6 space-y-6 flex flex-col w-full gap-8">
			<h1 className="text-2xl font-semibold mb-4">Create New Report</h1>
			<form onSubmit={onSubmit} className="flex flex-col self-center">
				<div>
					<label
						htmlFor="category"
						className="text-start italic font-extrabold"
					>
						Category
					</label>
					<select
						id="category"
						className="w-full border rounded p-2"
						value={categoryId}
						onChange={(e) => setCategoryId(Number(e.target.value))}
						required
					>
						<option value="" disabled>
							Select category
						</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor="description"
						className="text-start italic font-extrabold"
					>
						Description
					</label>
					<textarea
						id="description"
						className="w-full border rounded p-2"
						rows={4}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>

				{/* Address Fields */}
				<fieldset className="border border-gray-300 rounded p-4 space-y-4 grid sm:grid-cols-3 gap-4">
					<legend className="font-semibold">Address</legend>

					<div>
						<label
							className="block mb-1 text-start italic font-extrabold"
							htmlFor="region"
						>
							Region *
						</label>
						{/* <input
							id="region"
							className="w-full border rounded p-2"
							value={address.region}
							onChange={(e) =>
								setAddress({ ...address, region: e.target.value })
							}
							required
						/> */}
						<select
							id="Region"
							value={address.region}
							className="w-full border rounded p-2"
							onChange={(e) =>
								setAddress({ ...address, region: e.target.value })
							}
							required
						>
							<option value="" disabled>
								Select your Region
							</option>
							<option value="Sidama">Sidama</option>
							<option value="Oromia">Oromia</option>
							<option value="Amhara">Amhara</option>
							<option value="Tigray">Tigray</option>
							<option value="Diredawa">Diredawa</option>
							<option value="Addis Ababa">Addis Ababa</option>
							<option value="Somalia">Somalia</option>
						</select>
					</div>
					<div>
						<label
							className="block mb-1 text-start italic font-extrabold"
							htmlFor="zone"
						>
							Zone
						</label>
						<input
							id="zone"
							className="w-full border rounded p-2"
							value={address.zone}
							onChange={(e) => setAddress({ ...address, zone: e.target.value })}
						/>
					</div>
					<div>
						<label
							className="block mb-1 text-start italic font-extrabold"
							htmlFor="woreda"
						>
							Woreda
						</label>
						<input
							id="woreda"
							className="w-full border rounded p-2"
							value={address.woreda}
							onChange={(e) =>
								setAddress({ ...address, woreda: e.target.value })
							}
						/>
					</div>
					<div>
						<label
							className="block mb-1 text-start italic font-extrabold"
							htmlFor="city"
						>
							City
						</label>
						<input
							id="city"
							className="w-full border rounded p-2"
							value={address.city}
							onChange={(e) => setAddress({ ...address, city: e.target.value })}
						/>
					</div>
					<div>
						<label
							className="block mb-1 text-start italic font-extrabold"
							htmlFor="subCity"
						>
							Sub City
						</label>
						<input
							id="subCity"
							className="w-full border rounded p-2"
							value={address.subCity}
							onChange={(e) =>
								setAddress({ ...address, subCity: e.target.value })
							}
						/>
					</div>
					<div>
						<label
							className="block mb-1 text-start italic font-extrabold"
							htmlFor="kebele"
						>
							Kebele
						</label>
						<input
							id="kebele"
							className="w-full border rounded p-2"
							value={address.kebele}
							onChange={(e) =>
								setAddress({ ...address, kebele: e.target.value })
							}
						/>
					</div>
				</fieldset>

				<button
					type="submit"
					disabled={createReportMutation.status === "pending"}
					className="btn mt-5"
				>
					{createReportMutation.status === "pending"
						? "Submitting..."
						: "Submit Report"}
				</button>
			</form>
		</div>
	);
}
