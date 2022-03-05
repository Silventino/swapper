import {render, screen} from "@testing-library/react";
import SuccessPage from "./SuccessPage";


describe("SuccessPage", () => {
  it("should render success message", () => {
    render(<SuccessPage/>);
    expect(screen.getByText("Success!")).toBeInTheDocument();
  })
});
