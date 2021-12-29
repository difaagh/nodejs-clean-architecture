import { NewServer } from "./server/server";

(async () => {
  try {
    const { app, port } = await NewServer();
    app.listen(port, () => {
      console.info(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
