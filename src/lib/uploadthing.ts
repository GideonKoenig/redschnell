export function getKeyFromUrl(url: string) {
    return url.split("/").at(-1)!;
}
