"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const cors = require("cors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.use(cors({ origin: config.get('CORS_ORIGIN') || '*' }));
    const port = config.get('PORT') || 4000;
    await app.listen(port);
    console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map