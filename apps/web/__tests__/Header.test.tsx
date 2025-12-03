import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../src/components/layout/Header";
import { ThemeProvider } from "next-themes";

// Mock next/navigation
jest.mock("next/navigation", () => ({
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    useRouter: () => ({ push: jest.fn() }),
}));

// Mock GSAP
jest.mock("gsap", () => ({
    fromTo: jest.fn(),
}));

describe("Header", () => {
    const renderHeader = () => {
        return render(
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        );
    };

    it("renders logo and site name", () => {
        renderHeader();
        expect(screen.getByText("SolarGov")).toBeInTheDocument();
        expect(screen.getByText("CG")).toBeInTheDocument();
    });

    it("renders navigation links", () => {
        renderHeader();
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Schemes")).toBeInTheDocument();
        expect(screen.getByText("Apply")).toBeInTheDocument();
    });

    it("toggles mobile menu", () => {
        renderHeader();
        const menuButton = screen.getByLabelText("Toggle menu");
        fireEvent.click(menuButton);
        expect(screen.getByRole("button", { name: /Toggle menu/i })).toBeInTheDocument();
    });

    it("renders theme toggle button", () => {
        renderHeader();
        const themeButton = screen.getByLabelText("Toggle theme");
        expect(themeButton).toBeInTheDocument();
    });
});
