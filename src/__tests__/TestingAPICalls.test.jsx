/* eslint-disable testing-library/await-async-utils */
import { render, waitFor, screen } from "@testing-library/react";
import TestingAPICalls from "../components/TestingAPICalls";
import * as services from "../utils/Services";

describe("TestingAPICalls component", () => {
  test("Fetch Data API Called", () => {
    const mockFetch = jest
      .spyOn(services, "FetchData")
      .mockImplementation(async () => {
        return [{ name: "kunal" }];
      });

    render(<TestingAPICalls />);

    expect(mockFetch).toHaveBeenCalled();

    waitFor(() => {
      expect(screen.getByText(/kunal/i)).toBeInTheDocument();
    });
  });
});
