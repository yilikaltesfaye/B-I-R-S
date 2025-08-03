import { useCreateReport } from "@/api";
import { useAllCategories } from "@/api/category/queries";
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
		<form onSubmit={onSubmit} className="max-w-lg mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold mb-4">Create New Report</h1>

			{/* Category Dropdown */}
			<div>
				<label htmlFor="category" className="block font-medium mb-1">
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

			{/* Description */}
			<div>
				<label htmlFor="description" className="block font-medium mb-1">
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
			<fieldset className="border border-gray-300 rounded p-4 space-y-4">
				<legend className="font-semibold">Address</legend>

				<div>
					<label className="block font-medium mb-1" htmlFor="region">
						Region *
					</label>
					<input
						id="region"
						className="w-full border rounded p-2"
						value={address.region}
						onChange={(e) => setAddress({ ...address, region: e.target.value })}
						required
					/>
				</div>
				<div>
					<label className="block font-medium mb-1" htmlFor="zone">
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
					<label className="block font-medium mb-1" htmlFor="woreda">
						Woreda
					</label>
					<input
						id="woreda"
						className="w-full border rounded p-2"
						value={address.woreda}
						onChange={(e) => setAddress({ ...address, woreda: e.target.value })}
					/>
				</div>
				<div>
					<label className="block font-medium mb-1" htmlFor="city">
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
					<label className="block font-medium mb-1" htmlFor="subCity">
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
					<label className="block font-medium mb-1" htmlFor="kebele">
						Kebele
					</label>
					<input
						id="kebele"
						className="w-full border rounded p-2"
						value={address.kebele}
						onChange={(e) => setAddress({ ...address, kebele: e.target.value })}
					/>
				</div>
			</fieldset>

			<button
				type="submit"
				disabled={createReportMutation.status === "pending"}
				className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
			>
				{createReportMutation.status === "pending"
					? "Submitting..."
					: "Submit Report"}
			</button>
		</form>
	);
}
