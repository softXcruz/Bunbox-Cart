// Remove accents and uppercase so "jalapeno" finds "Jalapeño"
export const normalizeText = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");