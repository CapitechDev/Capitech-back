"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailController = void 0;
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
const Trail_1 = require("../models/Trail");
class TrailController {
    async getAll(req, res) {
        try {
            const limit = req.query.limit || 10;
            const skip = req.query.skip || 0;
            const trails = await Trail_1.Trail.find().limit(limit).skip(skip);
            SendResponse_1.default.success(res, 200, "Sucesso ao listar trilhas", trails);
        }
        catch (error) {
            console.log("🚀 ~ TrailController ~ getAll ~ error:", error);
            return SendResponse_1.default.error(res, 500, "Erro ao buscar trilhas");
        }
    }
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const trail = await Trail_1.Trail.findById(id);
            if (!trail) {
                return SendResponse_1.default.error(res, 404, "Trilha não encontrada");
            }
            return SendResponse_1.default.success(res, 200, "Trilha encontrada com sucesso", trail);
        }
        catch (error) {
            console.log("🚀 ~ TrailController ~ getOne ~ error:", error);
            return SendResponse_1.default.error(res, 500, "Erro ao buscar trilha");
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            const trailExists = await Trail_1.Trail.findOne()
                .where("subtitle")
                .equals(data.subtitle);
            if (trailExists) {
                return SendResponse_1.default.error(res, 400, "Trilha com este subtítulo já cadastrada");
            }
            const trail = await Trail_1.Trail.create(data);
            return SendResponse_1.default.success(res, 201, "Trilha criada com sucesso", trail);
        }
        catch (error) {
            console.log("🚀 ~ TrailController ~ create ~ error:", error);
            return SendResponse_1.default.error(res, 500, "Erro ao criar trilha");
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const trail = await Trail_1.Trail.findById(id);
            if (!trail) {
                return SendResponse_1.default.error(res, 404, "Trilha não encontrada");
            }
            const updatedTrail = await Trail_1.Trail.findByIdAndUpdate(id, data, {
                new: true,
            });
            return SendResponse_1.default.success(res, 200, "Trilha atualizada", updatedTrail);
        }
        catch (error) {
            console.log("🚀 ~ TrailController ~ update ~ error:", error);
            return SendResponse_1.default.error(res, 500, "Erro ao atualizar trilha");
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const trail = await Trail_1.Trail.findById(id);
            if (!trail) {
                return SendResponse_1.default.error(res, 404, "Trilha não encontrada");
            }
            await Trail_1.Trail.findByIdAndDelete(id, { new: true });
            return SendResponse_1.default.success(res, 200, "Trilha excluída");
        }
        catch (error) {
            console.log("🚀 ~ TrailController ~ delete ~ error:", error);
            return SendResponse_1.default.error(res, 500, "Erro ao excluir trilha");
        }
    }
}
exports.TrailController = TrailController;
//# sourceMappingURL=TrailController.js.map