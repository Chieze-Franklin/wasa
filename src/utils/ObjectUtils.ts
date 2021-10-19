import { StringUtils } from "./StringUtils.js";

export class ObjectUtils {
    public static hashObject(obj: Object) {
        const stringify = JSON.stringify(obj);
        return StringUtils.hashString(stringify);
    }
}
