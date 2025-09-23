import * as crypto from 'crypto';

export class Random
{
    /**
     * récupérer un nombre d'éléments aléatoires dans une liste avec la cryptographie
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
}