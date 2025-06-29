import { useState } from 'react';

const Solid = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>{count}</h1>
    </>
  );
};

export default Solid;
