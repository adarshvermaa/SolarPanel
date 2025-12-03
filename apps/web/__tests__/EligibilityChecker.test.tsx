import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EligibilityChecker from "../src/components/forms/EligibilityChecker";

describe("EligibilityChecker", () => {
    it("renders all form fields", () => {
        render(<EligibilityChecker />);
        expect(screen.getByText("Applicant Type")).toBeInTheDocument();
        expect(screen.getByText("Connection Type")).toBeInTheDocument();
        expect(screen.getByText("Roof Area (sq ft)")).toBeInTheDocument();
        expect(screen.getByText("Avg. Monthly Bill (₹)")).toBeInTheDocument();
    });

    it("shows validation errors for empty submission", async () => {
        render(<EligibilityChecker />);
        const submitButton = screen.getByRole("button", { name: /Check Eligibility/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Please select an applicant type")).toBeInTheDocument();
        });
    });

    it("shows eligible result for valid household input", async () => {
        render(<EligibilityChecker />);

        // Fill form
        fireEvent.change(screen.getByLabelText(/Applicant Type/i), { target: { value: "household" } });
        fireEvent.change(screen.getByLabelText(/Connection Type/i), { target: { value: "grid-connected" } });
        fireEvent.change(screen.getByLabelText(/Roof Area/i), { target: { value: "200" } });
        fireEvent.change(screen.getByLabelText(/Avg. Monthly Bill/i), { target: { value: "1000" } });
        fireEvent.click(screen.getByLabelText(/I agree/i));

        // Submit
        fireEvent.click(screen.getByRole("button", { name: /Check Eligibility/i }));

        // Check result
        await waitFor(() => {
            expect(screen.getByText("You are Eligible!")).toBeInTheDocument();
        });
    });
});
