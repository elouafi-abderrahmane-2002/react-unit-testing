import TestWithMockData from "../components/TestWithMockData";
import { mockData } from "../App";
import { render, screen } from "@testing-library/react";

describe("TestWithMockData component", () => {
  test("List render successfully", () => {
    render(<TestWithMockData data={mockData} />);
    
    // screen.logTestingPlaygroundURL();

    let element = screen.getByText(/fletcher/i);
    expect(element).toBeInTheDocument();
  });
});
