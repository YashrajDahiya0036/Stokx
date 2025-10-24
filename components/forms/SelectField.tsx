import React from "react";
import { Label } from "../ui/label";
import { Controller } from "react-hook-form";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const SelectField = ({
	name,
	label,
	placeholder,
	options,
	control,
	error,
	required,
}: SelectFieldProps) => {
	return (
		<div className="space-y-2">
			<Label htmlFor={name} className="form-label">
				{label}
			</Label>
			<Controller
				name={name}
				control={control}
				rules={{
					required: required
						? `Please select a ${label.toLowerCase()}`
						: false,
				}}
				render={({ field }) => (
					<Select value={field.value} onValueChange={field.onChange}>
						<SelectTrigger className="select-trigger">
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent className="bg-gray-800 border-gray-600 text-white">
							{options.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
									className="focus:bg-gray-300 text-white"
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>
			{error && (
				<p className="mt-2 text-sm text-red-500">{error.message}</p>
			)}
		</div>
	);
};

export default SelectField;
