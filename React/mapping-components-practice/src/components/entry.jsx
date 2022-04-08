import React from "react";

function CreateEmoji() {
  return (
    <div className="term">
      <dt>
        <span className="emoji" role="img" aria-label="Tense Biceps">
          {EmojiPedia[0].emoji}
        </span>
        <span>{EmojiPedia[0].name}</span>
      </dt>
      <dd>{EmojiPedia[0].meaning}</dd>
    </div>
  );
}

export default CreateEmoji;
