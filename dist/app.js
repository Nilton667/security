"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// view engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Home
const index_1 = __importDefault(require("./routes/index"));
app.use(index_1.default);
// Acess
const jwt_access_1 = __importDefault(require("./config/jwt.access"));
app.use(jwt_access_1.default);
// Login
const login_1 = __importDefault(require("./routes/login"));
app.use(login_1.default);
// Cadastro
const cadastro_1 = __importDefault(require("./routes/cadastro"));
app.use(cadastro_1.default);
// Recover
const recover_1 = __importDefault(require("./routes/recover"));
app.use(recover_1.default);
// Acess token
const jwt_token_1 = __importDefault(require("./config/jwt.token"));
app.use(jwt_token_1.default);
// Rotas protegidas
const perfil_1 = __importDefault(require("./routes/perfil"));
app.use(perfil_1.default);
const pagamentos_1 = __importDefault(require("./routes/pagamentos"));
app.use(pagamentos_1.default);
const carregamento_1 = __importDefault(require("./routes/carregamento"));
app.use(carregamento_1.default);
const feedback_1 = __importDefault(require("./routes/feedback"));
app.use(feedback_1.default);
const online_1 = __importDefault(require("./routes/online"));
app.use(online_1.default);
const historico_1 = __importDefault(require("./routes/historico"));
app.use(historico_1.default);
const session_1 = __importDefault(require("./routes/session"));
app.use(session_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Server Error' });
});
exports.default = app;
