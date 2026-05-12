import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function TestButton({ label }: { label: string }) {
  return <button>{label}</button>;
}

describe("Setup verification", () => {
  it("renders a button with text", () => {
    render(<TestButton label="Click me" />);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("handles user events", async () => {
    const handleClick = vi.fn();
    render(<button onClick={handleClick}>Click</button>);
    await userEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
