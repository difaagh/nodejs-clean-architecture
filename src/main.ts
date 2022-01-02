import "./aliases";
import { NewServer } from "./server/server";
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from "typeorm-transactional-cls-hooked";
import { NewTypeOrm } from "@src/config/index";

(async () => {
  try {
    const { app, port } = await NewServer({
      Transactional: initializeTransactionalContext,
      PatchRepository: patchTypeORMRepositoryWithBaseRepository,
      DataBase: NewTypeOrm,
    });
    app.listen(port, () => {
      console.info(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
