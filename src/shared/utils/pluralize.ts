export const pluralize = (number: number, wordForms: string[]) => {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) return wordForms[2];
    if (n1 === 1) return wordForms[0];
    if (n1 >= 2 && n1 <= 4) return wordForms[1];
    return wordForms[2];
};
