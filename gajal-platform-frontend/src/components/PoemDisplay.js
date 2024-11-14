import React from 'react';

// Helper function to replace newlines with <br /> tags
const newlineToBreak = (text) => {
  return text.split('\n').map((item, index) => (
    <span key={index}>
      {item}
      <br />
    </span>
  ));
};

const PoemDisplay = ({ poemContent }) => {
  return (
    <div className="poem-content">
      {newlineToBreak(poemContent)}
    </div>
  );
};

export default PoemDisplay;
