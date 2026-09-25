/**
 * Génère `app/favicon.ico` (16 et 32 px) à partir du même dessin que
 * `app/icon.tsx` et `app/apple-icon.tsx` : `lib/brand-icon.tsx`.
 *
 * Next ne sait pas produire un `favicon.ico` par du code : c'est un
 * fichier statique, d'où ce script, à relancer si le dessin change :
 *
 *   npx tsx scripts/generate-favicon.tsx
 *
 * Chaque taille est rendue à sa taille réelle plutôt que réduite depuis
 * la grande : à 16 px, un rendu direct reste plus net qu'une réduction.
 * Les images sont stockées en PNG dans le conteneur ICO, ce que tous les
 * navigateurs actuels lisent.
 */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderBrandIcon } from '@/lib/brand-icon';

const SIZES = [16, 32];

async function main() {
  const images = await Promise.all(
    SIZES.map(async (side) => ({
      side,
      png: Buffer.from(await (await renderBrandIcon(side)).arrayBuffer()),
    })),
  );

  // En-tête ICONDIR (6 octets), puis une entrée ICONDIRENTRY (16 octets)
  // par image, puis les données PNG à la suite.
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // réservé
  header.writeUInt16LE(1, 2); // type : icône
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + 16 * images.length;

  const entries = images.map(({ side, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(side, 0); // largeur
    entry.writeUInt8(side, 1); // hauteur
    entry.writeUInt8(0, 2); // pas de palette
    entry.writeUInt8(0, 3); // réservé
    entry.writeUInt16LE(1, 4); // plans
    entry.writeUInt16LE(32, 6); // bits par pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  const ico = Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
  const target = join(process.cwd(), 'app', 'favicon.ico');

  await writeFile(target, ico);
  console.log(`${target} : ${SIZES.join(' et ')} px, ${ico.length} octets`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
