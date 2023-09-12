import { bootstrap } from "./index";
import { IncanGoldRouterForFrontendDev } from "./src/IncanGoldForFrontendDev/api/IncanGold.router";

bootstrap.use("/test", IncanGoldRouterForFrontendDev())
bootstrap.start();