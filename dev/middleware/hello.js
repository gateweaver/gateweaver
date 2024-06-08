export function hello(_req, res, _next) {
  const name = process.env.TEST_NAME;
  return res.status(200).json({ message: `Hello, ${name}` });
}
