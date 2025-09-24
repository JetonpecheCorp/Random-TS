import * as crypto from 'crypto';

export class Random
{
    /**
     * récupérer un / des élément(s) aléatoires dans une liste avec la cryptographie
     * 
     * @param _list liste à partir de laquelle on va récupérer les éléments
     * @param _nbElement nombre d'éléments à récupérer
     * 
     * @returns la liste d'éléments aléatoires
     */
    static getItems<T>(_list: T[], _nbElement: number): T[]
    {
        if (_list.length == 0 || _nbElement <= 0)
            return [];

        if (_nbElement >= _list.length)
            return _list;

        let listeRetour = [];
        const LISTE_INDEX = Array.from({ length: _list.length }, (_, i) => i);

        for (let i = 0; i < _nbElement; i++)
        {
            const INDEX_ALEATOIRE = this.next(0, LISTE_INDEX.length - 1);
            const INDEX = LISTE_INDEX[INDEX_ALEATOIRE];
            listeRetour.push(_list[INDEX]);

            // supprimer pour éviter les doublons
            LISTE_INDEX.splice(INDEX_ALEATOIRE, 1);
        }

        return listeRetour;
    }

    /**
     * Mélanger une liste de manière aléatoire avec la cryptographie
     * 
     * @param _list liste a mélanger 
     * @returns La liste mélangée
     */
    static shuffle<T>(_list: T[]): T[]
    {
        if (!Array.isArray(_list) || _list.length === 0)
            return _list;

        for (let i = _list.length - 1; i > 0; i--)
        {
            const j = this.next(0, i);
            [_list[i], _list[j]] = [_list[j], _list[i]];
        }

        return _list;
    }

    /**
     * Generer un nombre aléatoire entre _min et _max inclus avec la cryptographie
     * 
     * @param _min valeur minimum
     * @param _max valeur maximum
     * @param _autoriserDecimal si on autorise les décimales
     * @param _nbChiffreApresVirgule nombre de chiffres après la virgule si on autorise les décimales
     * 
     * @returns le nombre aléatoire généré
     */
    static next(_min: number, _max: number, _autoriserDecimal: boolean = false, _nbChiffreApresVirgule: number = 2): number
    {
        if(_min == _max)
            return _min;

        if(_min > _max)
            throw new Error("min doit etre inférieur à max");

        let min = _min;
        let max = _max;
        let multiplier = 1;

        if (_autoriserDecimal && _nbChiffreApresVirgule > 0)
        {
            multiplier = Math.pow(10, _nbChiffreApresVirgule);
            min = Math.round(_min * multiplier);
            max = Math.round(_max * multiplier);
        }

        const RANGE = max - min + 1;

        let numByte = Math.ceil(Math.log2(RANGE) / 8);
        let listeOctel = new Uint8Array(numByte);

        let nombreAleatoire;
        let nombreMaxValide;

        do
        {
            crypto.getRandomValues(listeOctel);
            nombreAleatoire = 0;

            for (let i = 0; i < numByte; i++)
                nombreAleatoire = (nombreAleatoire << 8) | listeOctel[i];

            nombreMaxValide = Math.floor(256 ** numByte / RANGE) * RANGE;

        } while (nombreAleatoire >= nombreMaxValide);

        let resultat = (nombreAleatoire % RANGE) + min;

        return _autoriserDecimal ?  resultat / multiplier : resultat;
    }

    /**
     * Générer une chaîne de caractère aléatoire avec la cryptographie
     * 
     * @param _nbCharacter nombre de caractères dans la chaine
     * @param _hasSpecialCharacter Accepte les caractères spéciaux (defaut true)
     * 
     * @returns La chaine aléatoire générée
     */
    static nextString(_nbCharacter: number, _hasSpecialCharacter: boolean = true): string
    {
        if(_nbCharacter <= 0)
            return "";

        const LISTE_CARACTERE = [
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
            "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",

            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
            "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",

            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
        ];

        const LISTE_CARACTERE_SPECIAUX = [
            "!", "@", "#", "$", "£", "%", "^", "&", "*", "\\", "(", ")", "_", "-", 
            "+", "=", "[", "{", "]", "}", ";", ":", "<", ">", "|", ".", "/", "?", "§"
        ];

        let listeCaractereMelanger = this.shuffle(LISTE_CARACTERE);
        let listeCaractereSpeMelanger = this.shuffle(LISTE_CARACTERE_SPECIAUX);

        let retour: string[] = [];
        let nbCaractereSpeciaux: number = _hasSpecialCharacter ? this.next(1, _nbCharacter) : 0;

        for (let i = 0; i < _nbCharacter; i++) 
        {
            if(i < nbCaractereSpeciaux)
                retour.push(this.getItems(listeCaractereSpeMelanger, 1)[0]);
            
            else
                retour.push(this.getItems(listeCaractereMelanger, 1)[0]);
        }

        return this.shuffle(retour).join("");
    }
}