export class StringUtils {
    public static hashString(text: string) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            var character = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + character;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}
