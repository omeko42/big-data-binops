"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JukrahController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const auth_guard_1 = require("../../app_core/auth/auth.guard");
const current_user_interceptor_1 = require("../../app_core/helper/interceptor/current-user.interceptor");
const upload_limits_1 = require("../common/upload-limits");
const jukrah_service_1 = require("./jukrah.service");
let JukrahController = class JukrahController {
    service;
    constructor(service) {
        this.service = service;
    }
    streamMedia(token, res) {
        return this.service.streamMedia(token, res);
    }
    getFeed(req, q) {
        return this.service.getFeed(req?.user, q || {});
    }
    createSocialPost(req, body, files) {
        let targetSatkers = [];
        if (body.target_satker_ids) {
            try {
                targetSatkers = typeof body.target_satker_ids === 'string' ? JSON.parse(body.target_satker_ids) : body.target_satker_ids;
            }
            catch {
                targetSatkers = [];
            }
        }
        let caseLps = [];
        if (body.case_lp_ids) {
            try {
                caseLps = typeof body.case_lp_ids === 'string' ? JSON.parse(body.case_lp_ids) : body.case_lp_ids;
            }
            catch {
                caseLps = [];
            }
        }
        return this.service.createSocialPost(req?.user, {
            content: body.content,
            audience_type: body.audience_type,
            target_satker_ids: targetSatkers,
            case_lp_ids: caseLps,
            is_official_jukrah: body.is_official_jukrah,
            is_pinned: body.is_pinned,
            parent_post_id: body.parent_post_id ? parseInt(body.parent_post_id, 10) : undefined
        }, files || []);
    }
    reactPost(req, id, reactionType) {
        return this.service.reactPost(req?.user, parseInt(id, 10), reactionType || 'like');
    }
    getComments(req, id) {
        return this.service.getComments(req?.user, parseInt(id, 10));
    }
    addComment(req, id, content, parentId) {
        return this.service.addComment(req?.user, parseInt(id, 10), content, parentId ? parseInt(parentId, 10) : undefined);
    }
    deleteComment(req, id) {
        return this.service.deleteComment(req?.user, parseInt(id, 10));
    }
    acknowledgePost(req, id) {
        return this.service.acknowledgePost(req?.user, parseInt(id, 10));
    }
    updateVisibility(req, id, aud) {
        return this.service.updateVisibility(req?.user, parseInt(id, 10), aud);
    }
    
    getReactions(req, id) {
        return this.service.getReactions(req?.user, parseInt(id, 10));
    }
    toggleBookmark(req, id) {
        return this.service.toggleBookmark(req?.user, parseInt(id, 10));
    }
    editSocialPost(req, id, body) {
        return this.service.editPost(req?.user, parseInt(id, 10), body || {});
    }

    deleteSocialPost(req, id) {
        return this.service.deletePost(req?.user, parseInt(id, 10));
    }
    reportSocialPost(req, id, reason) {
        return this.service.reportPost(req?.user, parseInt(id, 10), reason);
    }
    panicTakedown(req, id) {
        return this.service.panicTakedown(req?.user, parseInt(id, 10));
    }
    getNotifications(req, category) {
        return this.service.getNotifications(req?.user, category);
    }
    markNotificationRead(req, id) {
        return this.service.markNotificationRead(req?.user, parseInt(id, 10));
    }
    markAllNotificationsRead(req, category) {
        return this.service.markAllNotificationsRead(req?.user, category || 'social');
    }
    getDashboardWidgets(req) {
        return this.service.getDashboardWidgets(req?.user);
    }
    getJukrahReadReport(req, id) {
        return this.service.getJukrahReadReport(req?.user, parseInt(id, 10));
    }
    list(q) {
        return this.service.list(q || {});
    }
    active(req, q) {
        return this.service.active(req?.user, q || {});
    }
    create(req, body, files) {
        return this.service.create(req?.user, body || {}, files?.[0]);
    }
    update(req, id, body, files) {
        return this.service.update(req?.user, parseInt(id, 10), body || {}, files?.[0], body?.keep_lampiran);
    }
    remove(req, id) {
        return this.service.remove(req?.user, parseInt(id, 10));
    }

    getNetworkUsers(req, q) {
        return this.service.getNetworkUsers(req?.user, q || {});
    }
    getNetworkProfile(req, id) {
        return this.service.getNetworkProfile(req?.user, id);
    }
    toggleFollow(req, id) {
        return this.service.toggleFollowUser(req?.user, parseInt(id, 10));
    }
    connectNetworkUser(req, id) {
        return this.service.connectNetworkUser(req?.user, parseInt(id, 10));
    }
    disconnectNetworkUser(req, id) {
        return this.service.disconnectNetworkUser(req?.user, parseInt(id, 10));
    }
    getMessageConversations(req, q) {
        return this.service.getMessageConversations(req?.user, q || {});
    }
    getMessageThread(req, targetId) {
        return this.service.getMessageThread(req?.user, parseInt(targetId, 10));
    }
    sendMessage(req, body) {
        return this.service.sendSocialMessage(req?.user, body || {});
    }
    getAccountInsight(req) {
        return this.service.getAccountInsight(req?.user);
    }
    getPusatBantuanCards(req) {
        return this.service.getPusatBantuanCards(req?.user);
    }
    repostSocialPost(req, id, body) {
        return this.service.repostPost(req?.user, parseInt(id, 10), body?.content);
    }
    editCommentPost(req, id, body) {
        return this.service.editComment(req?.user, parseInt(id, 10), body?.content);
    }
    editCommentPatch(req, id, body) {
        return this.service.editComment(req?.user, parseInt(id, 10), body?.content);
    }
    reactComment(req, id) {
        return this.service.reactComment(req?.user, parseInt(id, 10));
    }
    likeComment(req, id) {
        return this.service.reactComment(req?.user, parseInt(id, 10));
    }
};
exports.JukrahController = JukrahController;

    __decorate([
        (0, common_1.Get)('network/users'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Query)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "getNetworkUsers", null);
    __decorate([
        (0, common_1.Get)('network/profile/:id'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "getNetworkProfile", null);
    __decorate([
        (0, common_1.Post)('follow/:id'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "toggleFollow", null);
    __decorate([
        (0, common_1.Post)('network/connect/:id'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "connectNetworkUser", null);
    __decorate([
        (0, common_1.Post)('network/disconnect/:id'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "disconnectNetworkUser", null);
    __decorate([
        (0, common_1.Get)('messages/conversations'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Query)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "getMessageConversations", null);
    __decorate([
        (0, common_1.Get)('messages/thread/:targetId'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('targetId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "getMessageThread", null);
    __decorate([
        (0, common_1.Post)('messages/send'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "sendMessage", null);
    __decorate([
        (0, common_1.Get)('insight'),
        __param(0, (0, common_1.Req)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "getAccountInsight", null);
    __decorate([
        (0, common_1.Get)('pusat-bantuan-cards'),
        __param(0, (0, common_1.Req)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "getPusatBantuanCards", null);
    __decorate([
        (0, common_1.Post)('post/:id/repost'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, Object]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "repostSocialPost", null);
    __decorate([
        (0, common_1.Post)('comment/:id/edit'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, Object]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "editCommentPost", null);
    __decorate([
        (0, common_1.Patch)('comment/:id'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, Object]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "editCommentPatch", null);
    __decorate([
        (0, common_1.Post)('comment/:id/reaction'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "reactComment", null);
    __decorate([
        (0, common_1.Post)('comment/:id/like'),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], JukrahController.prototype, "likeComment", null);
    __decorate([
    (0, common_1.Get)('stream/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "streamMedia", null);
__decorate([
    (0, common_1.Get)('feed'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Post)('post'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, { limits: { fileSize: 20 * 1024 * 1024 } })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Array]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "createSocialPost", null);
__decorate([
    (0, common_1.Post)('post/:id/reaction'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reaction_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "reactPost", null);
__decorate([
    (0, common_1.Get)('post/:id/comments'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('post/:id/comment'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('content')),
    __param(3, (0, common_1.Body)('parent_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "addComment", null);
__decorate([
    (0, common_1.Delete)('comment/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Post)('post/:id/acknowledge'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "acknowledgePost", null);
__decorate([
    (0, common_1.Post)('post/:id/visibility'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('audience_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "updateVisibility", null);

__decorate([
    (0, common_1.Get)('post/:id/reactions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "getReactions", null);
__decorate([
    (0, common_1.Post)('post/:id/bookmark'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "toggleBookmark", null);
__decorate([
    (0, common_1.Post)('post/:id/edit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "editSocialPost", null);

__decorate([
    (0, common_1.Post)('post/:id/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "deleteSocialPost", null);
__decorate([
    (0, common_1.Post)('post/:id/report'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "reportSocialPost", null);
__decorate([
    (0, common_1.Post)('post/:id/panic-takedown'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "panicTakedown", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Post)('notifications/:id/read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "markNotificationRead", null);
__decorate([
    (0, common_1.Post)('notifications/read-all'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "markAllNotificationsRead", null);
__decorate([
    (0, common_1.Get)('dashboard-widgets'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "getDashboardWidgets", null);
__decorate([
    (0, common_1.Get)('report/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "getJukrahReadReport", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "active", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 1, upload_limits_1.DOC_UPLOAD_LIMITS)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Array]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/update'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 1, upload_limits_1.DOC_UPLOAD_LIMITS)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Array]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JukrahController.prototype, "remove", null);
exports.JukrahController = JukrahController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    (0, common_1.Controller)('bdb/jukrah'),
    __metadata("design:paramtypes", [jukrah_service_1.JukrahService])
], JukrahController);
//# sourceMappingURL=jukrah.controller.js.map