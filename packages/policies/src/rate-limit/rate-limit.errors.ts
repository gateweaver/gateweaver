export class RateLimitPolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitPolicyError";
  }
}
