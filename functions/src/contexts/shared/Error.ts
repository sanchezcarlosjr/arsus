export function warn(className: string, line: number, message: string, errorType = 'API REQUEST') {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    `\t🔥 ERROR BY ${errorType} | In ${className} (LINE ${line}) | ${message.slice(0, 250)}`
  );
}
