import { bootstrap } from "../../index";
import { IncanGoldRouterForFrontendDev } from "./api/IncanGold.router";

bootstrap.use("/test", IncanGoldRouterForFrontendDev())
bootstrap.start();