
export function formatCurrent(value: number) {
    const formatter = new Intl.NumberFormat('en-CM', {
        style: 'currency',
        currency: 'XAF'
    });

    return formatter.format(value);
}