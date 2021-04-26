
const DIVIDER_CHAR = '―';
const DIVIDER_LENGTH = 80;
const DIVIDER = new Array(DIVIDER_LENGTH).fill(DIVIDER_CHAR).join('');

enum Styles {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",
}

export function log(...args: any[]) {
  for (const arg of args) console.log(Styles.Reset, Styles.FgBlack, arg);
}

export function startLog(title: string) {
  console.log(Styles.FgYellow, DIVIDER, Styles.Reset);
  console.log(Styles.FgBlue, Styles.Bright, title, Styles.Reset);
}

export function endLog() {
  console.log(Styles.FgYellow, DIVIDER, Styles.Reset);
}

export function logSection(title: string, ...args: any[]) {
  startLog(title);
  log(...args);
  endLog();
}
