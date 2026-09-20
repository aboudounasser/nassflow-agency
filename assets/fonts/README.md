# Polices embarquées

Elles ne servent qu'à la génération des images de partage
(`opengraph-image.tsx`), jamais au rendu du site — celui-ci passe par
`next/font/google`, qui sert du woff2.

Elles sont ici parce que `ImageResponse` (satori) ne lit ni le woff2 ni
les polices variables : il lui faut une instance statique en TTF. Et
elles sont *dans le dépôt* plutôt que téléchargées au build, pour que
construire le site ne dépende pas d'un service tiers joignable.

| Fichier | Famille | Graisse / style |
|---|---|---|
| `Archivo-Bold.ttf` | Archivo | 700 |
| `Archivo-ExtraBold.ttf` | Archivo | 800 |
| `InstrumentSerif-Italic.ttf` | Instrument Serif | 400 italique |

Les trois sont sous SIL Open Font License 1.1 — voir `OFL-Archivo.txt`
et `OFL-InstrumentSerif.txt`. Récupérées depuis Google Fonts, ce sont
les mêmes fontes que celles servies au navigateur.
