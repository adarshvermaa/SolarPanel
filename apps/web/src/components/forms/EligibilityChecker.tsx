"use client";

import { useState } from "react";
import { z } from "zod";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const eligibilitySchema = z.object({
    applicantType: z.enum(["household", "farmer", "business"]),
    connectionType: z.enum(["grid-connected", "off-grid"]),
    roofArea: z.coerce.number().min(100, "Minimum roof area is 100 sq ft"),
    monthlyAvgBill: z.coerce.number().min(500, "Minimum bill amount is ₹500"),
    state: z.string().default("Chhattisgarh"),
    consent: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

type EligibilityData = z.infer<typeof eligibilitySchema>;

export default function EligibilityChecker() {
    const [formData, setFormData] = useState<Partial<EligibilityData>>({
        state: "Chhattisgarh",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [result, setResult] = useState<"eligible" | "not-eligible" | null>(null);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        try {
            eligibilitySchema.parse(formData);
            setErrors({});
            return true;
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                err.issues.forEach((issue) => {
                    if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
                });
                setErrors(fieldErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        // Simulate API check
        setTimeout(() => {
            const isEligible =
                formData.applicantType === "household" ||
                formData.applicantType === "farmer" ||
                (formData.applicantType === "business" && (formData.roofArea || 0) > 500);

            setResult(isEligible ? "eligible" : "not-eligible");
            setLoading(false);
        }, 1000);
    };

    const handleChange = (field: keyof EligibilityData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-2xl font-bold mb-6 text-secondary dark:text-white">Check Your Eligibility</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Applicant Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Applicant Type
                        </label>
                        <select
                            className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            value={formData.applicantType || ""}
                            onChange={(e) => handleChange("applicantType", e.target.value)}
                            aria-invalid={!!errors.applicantType}
                        >
                            <option value="">Select Type</option>
                            <option value="household">Household</option>
                            <option value="farmer">Farmer</option>
                            <option value="business">Business</option>
                        </select>
                        {errors.applicantType && <p className="text-red-500 text-sm">{errors.applicantType}</p>}
                    </div>

                    {/* Connection Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Connection Type
                        </label>
                        <select
                            className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            value={formData.connectionType || ""}
                            onChange={(e) => handleChange("connectionType", e.target.value)}
                            aria-invalid={!!errors.connectionType}
                        >
                            <option value="">Select Type</option>
                            <option value="grid-connected">Grid Connected</option>
                            <option value="off-grid">Off Grid</option>
                        </select>
                        {errors.connectionType && <p className="text-red-500 text-sm">{errors.connectionType}</p>}
                    </div>

                    {/* Roof Area */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Roof Area (sq ft)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g. 500"
                            className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            value={formData.roofArea || ""}
                            onChange={(e) => handleChange("roofArea", Number(e.target.value))}
                            aria-invalid={!!errors.roofArea}
                        />
                        {errors.roofArea && <p className="text-red-500 text-sm">{errors.roofArea}</p>}
                    </div>

                    {/* Monthly Bill */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Avg. Monthly Bill (₹)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g. 2000"
                            className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            value={formData.monthlyAvgBill || ""}
                            onChange={(e) => handleChange("monthlyAvgBill", Number(e.target.value))}
                            aria-invalid={!!errors.monthlyAvgBill}
                        />
                        {errors.monthlyAvgBill && <p className="text-red-500 text-sm">{errors.monthlyAvgBill}</p>}
                    </div>
                </div>

                {/* State (Read-only) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        State
                    </label>
                    <input
                        type="text"
                        value="Chhattisgarh"
                        readOnly
                        className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    />
                </div>

                {/* Consent */}
                <div className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        id="consent"
                        className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                        checked={formData.consent || false}
                        onChange={(e) => handleChange("consent", e.target.checked)}
                        aria-invalid={!!errors.consent}
                    />
                    <label htmlFor="consent" className="text-sm text-neutral-600 dark:text-neutral-400">
                        I agree to check eligibility based on the provided information.
                    </label>
                </div>
                {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-secondary hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Check Eligibility"}
                </button>
            </form>

            {/* Result Live Region */}
            <div aria-live="polite" className="mt-6">
                {result === "eligible" && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-green-800 dark:text-green-300">You are Eligible!</h3>
                            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                Based on your details, you qualify for the Rooftop Solar Subsidy scheme.
                            </p>
                            <button className="mt-3 text-sm font-medium text-green-800 dark:text-green-300 hover:underline">
                                Proceed to Apply &rarr;
                            </button>
                        </div>
                    </div>
                )}
                {result === "not-eligible" && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-red-800 dark:text-red-300">Not Eligible</h3>
                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                Unfortunately, you do not meet the criteria at this time. Please contact support for more details.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
