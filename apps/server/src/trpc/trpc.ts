import { initTRPC } from '@trpc/server';

// 创建TRPC实例
const trpc = initTRPC.create();

// 导出公共方法
export const router = trpc.router;
export const procedure = trpc.procedure;
export const mergeRouters = trpc.mergeRouters;