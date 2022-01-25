export class Timeout {
  constructor(private promise: Promise<any>, private error: Error, private timeout: number = 1000) {}
  execute() {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(this.error), this.timeout);
    });
    return {
      promiseOrTimeout: Promise.race([this.promise, timeoutPromise]),
      timeoutId,
    };
  }
}
