import { render } from "@testing-library/react";
import React from "react";

import App from "./App";

describe("test", () => {
    test("test", () => {
      const onChange = jest.fn();
  
      render(<App />);
  
      expect(true).toBe(true)
    });
});