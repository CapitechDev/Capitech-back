"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
dotenv_1.default.config();
class UserController {
    async auth(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne().where("email").equals(email);
            if (!user) {
                return SendResponse_1.default.error(res, 404, "Usuário não encontrado");
            }
            const passwordMatch = await bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return SendResponse_1.default.error(res, 400, "Usuário ou senha incorreta");
            }
            const userObject = user.toObject();
            const { password: userPass, ...restUser } = userObject;
            const userToken = jsonwebtoken_1.default.sign(restUser, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            return SendResponse_1.default.success(res, 200, "Login realizado", {
                user: {
                    id: restUser._id,
                    ...restUser,
                },
                token: userToken,
            });
        }
        catch (error) {
            console.log("🚀 ~ UserController ~ auth ~ error:", error);
            return SendResponse_1.default.error(res, 500, "Erro ao realizar login");
        }
    }
    async register(req, res) {
        try {
            const { adminCode, email, password, name } = req.body;
            if (!adminCode || !email || !password) {
                return SendResponse_1.default.error(res, 404, "Campos obrigatórios não preenchidos");
            }
            if (adminCode !== process.env.ADMIN_CODE) {
                return SendResponse_1.default.error(res, 400, "Código de admin incorreto");
            }
            const userExists = await User_1.User.findOne().where("email").equals(email);
            if (userExists) {
                return SendResponse_1.default.error(res, 400, "Usuário com e-mail já cadastrado");
            }
            const saltRounds = 10;
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const hashedPassword = bcrypt_1.default.hashSync(password, salt);
            const newUser = { email, password: hashedPassword, name };
            const createdUser = await User_1.User.create(newUser);
            return SendResponse_1.default.success(res, 201, "Usuário criado com sucesso", createdUser);
        }
        catch (error) {
            console.log("🚀 ~ UserController ~ auth ~ error:", error);
            return SendResponse_1.default.error(res, 500, "Erro ao cadastrar usuário");
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const userExists = await User_1.User.findOne().where("_id").equals(id);
            if (!userExists) {
                return SendResponse_1.default.error(res, 404, "Usuário não encontrado");
            }
            await User_1.User.deleteOne().where("_id").equals(id);
            return SendResponse_1.default.success(res, 200, "Usuário excluido com sucesso");
        }
        catch (error) {
            console.log("🚀 ~ UserController ~ delete ~ error:", error);
            return SendResponse_1.default.error(res, 500, "Erro ao excluir usuário");
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const userExists = await User_1.User.findById(id);
            if (!userExists) {
                return SendResponse_1.default.error(res, 404, "Usuário não encontrado");
            }
            let hashedPassword = null;
            let userUpdate = data;
            if (!data.password) {
                delete userUpdate.password;
            }
            if (data?.password) {
                const saltRounds = 10;
                const salt = bcrypt_1.default.genSaltSync(saltRounds);
                hashedPassword = bcrypt_1.default.hashSync(data.password, salt);
                userUpdate.password = hashedPassword;
            }
            const user = await User_1.User.findByIdAndUpdate(id, userUpdate, { new: true });
            return SendResponse_1.default.success(res, 200, "Dados do usuário atualizados com sucesso!", user);
        }
        catch (error) {
            console.log("🚀 ~ UserController ~ update ~ error:", error);
            return SendResponse_1.default.error(res, 500, "Erro ao atualizar usuário");
        }
    }
    async getAll(req, res) {
        try {
            const limit = req.query.limit || 10;
            const skip = req.query.skip || 0;
            const users = await User_1.User.find().limit(limit).skip(skip);
            return SendResponse_1.default.success(res, 200, "Sucesso ao listar usuários", users);
        }
        catch (error) {
            console.log("🚀 ~ UserController ~ error:", error);
            SendResponse_1.default.error(res, 500, "Erro ao listar usuários");
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map