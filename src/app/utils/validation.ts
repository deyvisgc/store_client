export class Validation {

    public validateNumberDoc(typeDoc: string, numberDoc: string): boolean {
        switch (typeDoc) {
            case 'DNI':
                return numberDoc.length === 8;
            case 'RUC':
                return numberDoc.length === 11;
            default:
                return false;
        }
    }
}
