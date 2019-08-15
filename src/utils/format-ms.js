const formatMs = (ms) => (ms - (ms %= 60)) / 60 + (ms > 9 ? ":" : ":0") + ms;
export default formatMs;