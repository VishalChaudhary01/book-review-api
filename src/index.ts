import "module-alias/register";
import { config } from "./config/env.config";
import { createServer } from "./create-server";

const server = createServer();

server.listen(config.PORT, () => {
  console.log(
    `Server running at http://localhost:${config.PORT} in ${config.NODE_ENV}`,
  );
});
