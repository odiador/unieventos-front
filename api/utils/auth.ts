import { checkUserRole } from "./api";

async function checkRole(cookie?: string) {
    if (!cookie)
        return null;
    return await checkUserRole(cookie);
}
export { checkRole };