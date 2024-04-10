import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestWithMockDataWithBranching from "../components/TestWithMockDataWithBranching";
import { mockData } from "../App";

describe("TestWithMockDataWithBranching component", () => {
  test("List renders successfully", () => {
    render(
      <TestWithMockDataWithBranching
        data={mockData}
        displayUnorderedList={true}
      />
    );

    expect(screen.getByText(/fletcher/i)).toBeInTheDocument();
  });

  test("Ordered list renders", () => {
    render(
      <TestWithMockDataWithBranching
        data={mockData}
        displayUnorderedList={false}
      />
    );

    expect(screen.getByText(/McVanamy/i)).toBeInTheDocument();
  });

  test("Email link click handler called", async () => {
    const mockFn = jest.fn();

    render(
      <TestWithMockDataWithBranching
        data={mockData}
        displayUnorderedList={true}
        handleClick={mockFn}
      />
    );

    await userEvent.click(screen.getByText(/mmcvanamy0@e-recht24.de/i));
    expect(mockFn).toHaveBeenCalled();
  });
});
