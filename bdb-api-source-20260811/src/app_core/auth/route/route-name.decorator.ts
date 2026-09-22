import { SetMetadata } from '@nestjs/common';

export const ROUTE_NAME_METADATA = 'route_name';
export const RouteName = (name: string) => SetMetadata(ROUTE_NAME_METADATA, name);

export const ROUTE_TAGS = 'controller_tag';
export const ControllerTag = (tags: string) => SetMetadata(ROUTE_TAGS, tags);

export const GROUP_TAG = 'group';
export const Group = (group: string) => SetMetadata(GROUP_TAG, group);

export const MENU_TAG = 'menu';
export const Menu = (menu: string) => SetMetadata(MENU_TAG, menu);

export const ACTION_TAG = 'action';
export const Action = (action: string) => SetMetadata(ACTION_TAG, action);

export const PARENT_MENU = 'parent_menu';
export const Parent = (parent: string) => SetMetadata(PARENT_MENU, parent);