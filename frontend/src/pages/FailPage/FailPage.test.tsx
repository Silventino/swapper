import {render, screen} from "@testing-library/react";
import FailPage from "./FailPage";

describe("FailPage", () => {
  it("should render fail message", () => {
    render(<FailPage/>);
    expect(screen.getByText("Fail...")).toBeInTheDocument();
  })
});
