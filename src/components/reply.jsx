import React, { useState, useRef, useLayoutEffect, /* useEffect */ } from "react";
import styled from "styled-components";
import { StyledInput } from "./input";
import Button from "./button";
import Icon from "./icon";

const freshPrince =
  "  \nNow, this is a story all about how   \nMy life got flipped-turned upside down   \nAnd I'd like to take a minute   \nJust sit right there   \nI'll tell you how I became the prince of a town called Bel Air   \nIn west Philadelphia born and raised   \nOn the playground was where I spent most of my days   \nChillin' out maxin' relaxin' all cool   \nAnd all shootin some b-ball outside of the school   \nWhen a couple of guys who were up to no good   \nStarted making trouble in my neighborhood   \nI got in one little fight and my mom got scared   \nShe said 'You're movin' with your auntie and uncle in Bel Air'   \nI begged and pleaded with her day after day   \nBut she packed my suit case and sent me on my way   \nShe gave me a kiss and then she gave me my ticket.   \nI put my Walkman on and said, 'I might as well kick it'.   \nFirst class, yo this is bad   \nDrinking orange juice out of a champagne glass.   \nIs this what the people of Bel-Air living like?   \nHmm this might be alright.   \nBut wait I hear they're prissy, bourgeois, all that   \nIs this the type of place that they just send this cool cat?   \nI don't think so   \nI'll see when I get there   \nI hope they're prepared for the prince of Bel-Air   \nWell, the plane landed and when I came out   \nThere was a dude who looked like a cop standing there with my name out   \nI ain't trying to get arrested yet   \nI just got here   \nI sprang with the quickness like lightning, disappeared   \nI whistled for a cab and when it came near   \nThe license plate said fresh and it had dice in the mirror   \nIf anything I could say that this cab was rare   \nBut I thought 'Nah, forget it' - 'Yo, homes to Bel Air'   \nI pulled up to the house about seven or eigth   \nAnd I yelled to the cabbie 'Yo homes smell ya later'   \nI looked at my kingdom   \nI was finally there   \nTo sit on my throne as the Prince of Bel Air";

var md = require("markdown-it")({
  html: false,
  linkify: true,
});

const TextArea = styled(StyledInput)`
  width: 500px;
  height: 100px;
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin: 0.25rem 0;
  line-height: 1.25;
`;

const Split = styled.div`
  display: flex;
  flex-flow: row nowrap;
  & > * {
    flex: 1 1 50%;
    height: 100%;
  }
`;

const StyledPreview = styled.div`
  border: 1px solid ${({theme}) => theme.input.border};
  border-radius: 0.25rem;
  background-color: ${({theme}) => theme.input.background};
  padding: 0 0.25rem;
  margin: 0.25rem;
`;

const MDPreview = ({ value }) => {
  return (
    <StyledPreview
      className="md"
      dangerouslySetInnerHTML={{ __html: md.render(value) }}
    />
  );
};

const Reply = ({ autoFocus, onSubmit, onCancel, draft = "" }) => {
  const [value, setValue] = useState(draft);
  const handleChange = (e) => setValue(e.target.value);

  // const [history, setHistory] = useState([]);
  // const [historyIndex, setHistoryIndex] = useState(0);
  // useEffect(() => {
  //   setHistory((h) => [...h, value]);
  // }, [value]);

  // const undo = () => {
    // setValue(history[])
  // };

  const $textarea = useRef(null);
  const [autoFocused, setAutoFocused] = useState(false);
  useLayoutEffect(() => {
    if (!autoFocused && autoFocus) {
      $textarea.current.focus();
      setAutoFocused(true);
    }
  }, [autoFocused, autoFocus]);

  const submit = () => {
    onSubmit(value);
    setValue("");
  };
  const cancel = () => onCancel(value);

  const setCursorPosition = (value) => {
    $textarea.current.selectionStart = value;
    $textarea.current.selectionEnd = value;
  };
  const blur = () => $textarea.current.blur();

  const bold = () => wrapSelection(["**"]);
  const italicize = () => wrapSelection(["*"]);
  const strikethrough = () => wrapSelection(["~~"]);
  const linkify = () => wrapSelection(["[", "]()"]);
  const tab = () => setValue((v) => v + "    ");

  const wrapSelection = (wrap) => {
    const wrapBefore = wrap[0];
    const wrapAfter = wrap.length === 2 ? wrap[1] : wrap[0];

    let { selectionStart: start, selectionEnd: end } = $textarea.current;

    let selection = value.slice(start, end);

    while (selection.charAt(selection.length) === " ") {
      selection = selection.slice(0, selection.length - 1);
      end -= 1;
    }
    while (selection.charAt(0) === " ") {
      selection = selection.slice(1, selection.length);
      start += 1;
    }

    const before = value.slice(0, start);
    const after = value.slice(end, value.length);

    setValue((v) => `${before}${wrapBefore}${selection}${wrapAfter}${after}`);
    setCursorPosition(end + 2);
  };

  const debugFreshPrince = () => {
    setValue((v) => `${v.length > 0 ? v + "\n\n" : v}${freshPrince}`);
  };

  const keybindings = {
    ctrlEnter: submit,
    ctrlB: bold,
    ctrlI: italicize,
    ctrlS: strikethrough,
    ctrlL: linkify,
    Escape: blur,
    Tab: tab,
  };
  const debugBindings = {
    ctrlP: debugFreshPrince,
  };

  const handleKeypress = (e) => {
    const { ctrlKey, key } = e;

    const combo = `${ctrlKey ? "ctrl" : ""}${key.charAt(0).toUpperCase() +
      key.slice(1, key.length)}`;

    const prevent = () => {
      e.preventDefault();
      e.nativeEvent.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopPropagation();
    };

    if (combo in keybindings) {
      prevent();
      keybindings[combo]();
    }

    if (process.env.NODE_ENV === "development" && combo in debugBindings) {
      prevent();
      debugBindings[combo]();
    }
  };

  return (
    <div>
      <Split>
        <TextArea
          as="textarea"
          ref={$textarea}
          placeholder="Reply"
          onChange={handleChange}
          onKeyDown={handleKeypress}
          value={value}
        />
        <MDPreview value={value} />
      </Split>
      <Button type="primary" label="Reply" onClick={submit} />
      {onCancel ? <Button label="Cancel" onClick={cancel} /> : null}
      {process.env.NODE_ENV === "development" ? (
        <Button onClick={debugFreshPrince}>
          <Icon icon="loader" />
        </Button>
      ) : null}
    </div>
  );
};

export default Reply;
