import React from "react";
import Entry from "./entry";
import emojipedia from "../emojipedia";

function emojies(emoji) {
  return (
    <Entry
      key={emoji.id}
      emoji={emoji.emoji}
      name={emoji.name}
      description={emoji.meaning}
    />
  );
}

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>
      <dl className="dictionary">{emojipedia.map(emojies)}</dl>
    </div>
  );
}

export default App;
