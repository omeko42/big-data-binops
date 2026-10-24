import { Injectable, RequestMethod } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { ACTION_TAG, GROUP_TAG, MENU_TAG, ROUTE_TAGS } from './route-name.decorator';

@Injectable()
export class RouteService {
    constructor(
        private readonly _discoveryService: DiscoveryService,
        private readonly _reflector: Reflector
    ) {}

    public async getAllEndpoints(): Promise<
        {
            path: string;
            method: string;
            name?: string;
            tags?: string;
            group?: string;
            menu?: string;
            action?: string;
            parent?: string;
        }[]
    > {
        const routes = [];
        const controllers = this._discoveryService.getControllers();

        for (const wrapper of controllers) {
            const { instance } = wrapper;
            if (!instance) continue;

            const controllerPath = this._reflector.get<string>(PATH_METADATA, instance.constructor) || '';
            const controllerTags = this._reflector.get<string>(ROUTE_TAGS, instance.constructor) || '';

            const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
            
            for (const methodName of methods) {
                if (methodName === 'constructor') continue;

                const methodHandler = instance[methodName];
                const methodPath = this._reflector.get<string>(PATH_METADATA, methodHandler) || '';
                const requestMethod = this._reflector.get<RequestMethod>(METHOD_METADATA, methodHandler);
                const routeName = this._reflector.get<string>('route_name', methodHandler);
                const routeMenu= this._reflector.get<string>('menu', methodHandler);
                const routeGroup = this._reflector.get<string>('group', methodHandler);
                const routeAction = this._reflector.get<string>('action', methodHandler);
                const parent_menu = this._reflector.get<string>('parent_menu', methodHandler);

                if (requestMethod !== undefined) {
                    const method = RequestMethod[requestMethod]?.toUpperCase();
                    const fullPath = this.formatPath(`${controllerPath}/${methodPath}`);

                    routes.push({
                        tags: controllerTags,
                        path: fullPath,
                        method,
                        name: routeName,
                        group: routeGroup,
                        menu: routeMenu,
                        action: routeAction,
                        parent:parent_menu
                    });
                }
            }
        }

        return routes;
    }

    private formatPath(path: string): string {
        // Ensure the path starts with a '/'
        path = path.trim().replace(/^\/+/, '/');

        // Replace ":param" with "/:param"
        path = path.replace(/(:[a-zA-Z0-9_]+)/g, '/$1');

        // Remove any redundant slashes
        path = path.replace(/\/{2,}/g, '/');

        // Remove trailing slash if present, except for the root path
        return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    }
}
