# Random

Randomiser en utilisant la cryptographie

## getItems

Permet de récupérer un nombre d'éléments aléatoires dans une liste

### exemple

```js
let liste = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let listeRetour = Random.getItems(liste, 4);
```

## shuffle

Permet de mélanger une liste aléatoirement

### exemple

```js
let liste = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let listeRetour = Random.shuffle(liste);
```

## next

Permet de générer un nombre aléatoire (inclusif)

### exemple

```js
// nombre entier
let nombre = Random.next(1, 100);

// nombre decimal avec deux chiffres apres la virgule
let nombreDecimal = Random.next(1, 100, true, 2);
```

## nextString

Permet de générer une chaîne de caractère aléatoire

### exemple

```js
// chaine avec caractères spéciaux
let chaine = Random.nextString(10);

// chaine sans caractères spéciaux
let chaine1 = Random.nextString(10, false);
```
