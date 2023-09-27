export function randomString(length: number) {
    let result = '';
    const characters = 'ADYZfhijksuv34579';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}