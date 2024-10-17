import { H3Event, createError } from 'h3';
import jwt from 'jsonwebtoken'
const SECRETJWT = process.env.APP_SECRET_JWT as string

const regexWhitelist = [/^\/api\/login$/, /^\/api\/logout$/, /^\/api\/numero$/]; // Example regex patterns for whitelist

const rules: Array<{ pattern: RegExp; rules: string[] }> = [
    { pattern: /^\/api\/user$/, rules: ['admin'] },
    { pattern: /^\/api\/product\/\w+$/, rules: ['admin'] },
    { pattern: /^\/api\/order$/, rules: ['customer', 'admin'] },
    { pattern: /^\/api\/customer$/, rules: ['admin'] },
];

function getRulesForPath(path: string): string[] | undefined {
    for (const route of rules) {
        if (route.pattern.test(path)) {
            return route.rules;
        }
    }
    return undefined;
}

function isPathWhiteList(event: any): boolean {
    const path = event.path;
    const pathAPI = event.path.startsWith("/api/");
    const whiteList = regexWhitelist.some(re => re.test(path))
    if (!pathAPI || whiteList) {
        return true;
    }
    return false;
}

async function validateAuthorization(token: string | null) {
    console.log('token', token)
    if (!token) {
        throw createError({
            status: 401,
            message: 'Não autorizado',
        });
    }

    const jwtDecoded = jwt.verify(token, SECRETJWT) as { id: number, rule: string }

    if (!jwtDecoded) {
        throw createError({
            status: 401,
            message: 'Não autorizado',
        });
    }

    return jwtDecoded;
}

export default defineEventHandler(async (event: H3Event) => {
    const isWhiteList = isPathWhiteList(event);

    if (!isWhiteList) {
        try {
            const authorization = event.headers.get('authorization');
            const response = await validateAuthorization(authorization);
            const userRules = response.rule || 'customer';
            const requiredRules = getRulesForPath(event.path);
            if (requiredRules && !requiredRules.includes(userRules)) {
                throw createError({
                    status: 401,
                    message: 'Não autorizado',
                });
            }
            event.context.user = response;
        } catch (error) {
            event.node.res.statusCode = 401;
            event.node.res.end('Unauthorized');
        }
    }
});