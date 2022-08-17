import React from "react";

import { styled } from "@linaria/react";
import { motion } from "framer-motion";

const Foo = styled(motion.div)`
  background: red;
`;

export default function App() {
    return (
      <Foo>
        <p>Hello World from React</p>
      </Foo>
    );
  }
