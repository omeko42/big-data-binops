"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const app_core_module_1 = require("./app_core/app_core.module");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const errorException_helper_service_1 = require("./app_core/helper/service/errorException.helper.service");
const loger_service_1 = require("./app_core/helper/service/loger.service");
const compression = require("compression");
const run_pending_migrations_1 = require("./run-pending-migrations");
async function bootstrap() {
    dotenv.config();
    await (0, run_pending_migrations_1.runPendingMigrations)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false }); const bodyParser = require('body-parser'); app.use(bodyParser.json({ limit: '50mb' })); app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    const logger = new loger_service_1.CoreLogger();
    app.useLogger(logger);
    const globalPrefix = process.env.GLOBAL_PREFIX || '';
    app.setGlobalPrefix(globalPrefix);
    const appCoreModule = app.get(app_core_module_1.AppCoreModule);
    appCoreModule.setApplication(app);
    dotenv.config();
    app.use(cookieParser());
    app.useGlobalFilters(new errorException_helper_service_1.ErrorExceptionFilter());
    app.use(compression());
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Authorization,Content-Type, Accept',
        credentials: true
    });
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map