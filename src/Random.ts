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

        const clone = [..._list];

        this.shuffle(clone);
        
        return clone.slice(0, Math.min(_list.length, _nbElement));
    }

    /**
     * Mélanger une liste de manière aléatoire avec la cryptographie
     * Attention: Modifie le tableau original
     * 
     * @param _list liste a mélanger 
     * @returns La liste mélangée
     */
    static shuffle<T>(_list: T[]): void
    {
        if (!Array.isArray(_list) || _list.length == 0) 
            return;

        for (let i = _list.length - 1; i > 0; i--) 
        {
            const j = this.next(0, i);
            [_list[i], _list[j]] = [_list[j], _list[i]];
        }
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
        if (_min == _max) 
            return _min;
        
        if (_min > _max) 
            throw new Error("min > max");

        if (!_autoriserDecimal)
            return crypto.randomInt(_min, _max + 1);
        
        const multiplier = Math.pow(10, _nbChiffreApresVirgule);
        const minInt = Math.round(_min * multiplier);
        const maxInt = Math.round(_max * multiplier);
        
        const randomInt = crypto.randomInt(minInt, maxInt + 1);
        return randomInt / multiplier;
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
        if (_nbCharacter <= 0) 
            return "";

        const LISTE_CARACTERE_ALPHANUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const LISTE_CARACTERE_SPECIAL = "!@#$£%^&*\\()_-+=[{]};:<>.|/?§";

        const POOL_STRING = _hasSpecialCharacter ? LISTE_CARACTERE_ALPHANUM + LISTE_CARACTERE_SPECIAL : LISTE_CARACTERE_ALPHANUM;
        const POOL_LISTE = POOL_STRING.split("");
        
        this.shuffle(POOL_LISTE);
        
        let resultat = "";

        for (let i = 0; i < _nbCharacter; i++) 
        {
            const randomIndex = this.next(0, POOL_LISTE.length - 1);
            resultat += POOL_LISTE[randomIndex];
        }

        return resultat;
    }
}
