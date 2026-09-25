function paras(...lines) {
  return lines
}

export const readerSections = [
  { id: 'cover-page', label: 'Couverture', kind: 'cover' },
  { id: 'introduction', label: 'Introduction', kind: 'chapter', title: 'Introduction' },
  { id: 'chapter-content', label: 'Chapitre I — La mort', kind: 'chapter', chapter: 'Chapitre I', title: 'La mort' },
  { id: 'chapter-2', label: 'Chapitre II — La ville', kind: 'chapter', chapter: 'Chapitre II', title: 'La ville' },
  { id: 'chapter-3', label: 'Chapitre III — La mémoire', kind: 'chapter', chapter: 'Chapitre III', title: 'La mémoire' },
  { id: 'chapter-4', label: 'Chapitre IV — L’héritage', kind: 'chapter', chapter: 'Chapitre IV', title: 'L’héritage' },
  { id: 'chapter-5', label: 'Chapitre V — Le futur', kind: 'chapter', chapter: 'Chapitre V', title: 'Le futur' },
  { id: 'poetry-section', label: 'Poésie', kind: 'poetry' },
  { id: 'code-section', label: 'Extrait', kind: 'code' },
  { id: 'table-section', label: 'Table', kind: 'table' },
]

export const readerContent = {
  introduction: paras(
    "Ce roman nous plonge dans l'univers complexe d'un pays imaginaire où la mort refuse de partir. Sony Labou Tansi nous offre une vision poétique et politique de l'existence africaine.",
    "À travers une écriture riche et symbolique, l'auteur explore les thèmes de la mémoire, de l'héritage et de la survie dans un monde en perpétuelle transformation.",
    "L'œuvre se situe à la croisée de plusieurs traditions littéraires : le réalisme magique sud-américain, la négritude, et le postcolonialisme africain. Elle questionne les frontières entre le vivant et le mort, entre le réel et l'imaginaire.",
    "Le Guide Providentiel, figure centrale du récit, incarne cette dualité. Il est à la fois mort et vivant, présent et absent, mémoire et oubli. Sa traversée de la ville devient une métaphore de la condition humaine face à l'histoire.",
    "Les murs de la ville portent les noms des disparus, créant une architecture de la mémoire. Chaque rue, chaque bâtiment raconte une histoire, chaque pierre conserve une voix.",
    "Les vivants, quant à eux, ont appris à coexister avec leurs ombres. Ils dialoguent avec les morts, négocient avec la mémoire, construisent leur présent sur les fondations d'un passé qui refuse de s'effacer.",
    "La mort, dans ce monde, n'est pas une fin mais une continuation. Les morts continuent d'agir, de parler, d'influencer le cours des choses.",
    "Le roman nous propose ainsi une poétique de la survie, une réflexion sur ce qui reste quand tout semble avoir disparu.",
  ),
  'chapter-content': paras(
    "Il était une fois un pays qui n'existait nulle part. Dans ce pays, les morts n'avaient pas fini de mourir et les vivants avaient appris à parler avec leur ombre.",
    "Le Guide Providentiel avançait dans les rues comme on avance dans un rêve trop ancien. Les murs portaient les noms de ceux qui avaient disparu, et la ville gardait dans ses pierres la mémoire des voix.",
    "Chaque matin, le peuple se réveillait avec la même question au bord des lèvres : combien de temps peut-on vivre dans un pays où la mort refuse de partir ?",
    "QUOTE:La mémoire ne se lit pas seulement dans les livres : elle se transmet dans les silences.",
    "Ils avaient appris à vivre entre deux mondes, celui des vivants et celui des morts, sans jamais appartenir complètement à aucun des deux.",
    "Le Guide Providentiel se souvenait de tout. Il se souvenait du jour où la mort avait refusé de partir, du moment où les frontières s'étaient effondrées.",
    "La ville s'étendait à l'infini, ses rues se multipliant comme les ramifications d'une mémoire obstinée.",
    "Le marché était le lieu où les deux mondes se rencontraient le plus fréquemment. Les morts venaient y acheter ce qu'ils avaient oublié, les vivants y vendaient ce qu'ils voulaient oublier.",
    "Le Guide prit l'objet. Il était léger, presque insaisissable. En le tenant, il ressentit une présence, une chaleur, comme si quelqu'un lui prenait la main.",
    "C'est ainsi que commença la traversée, celle qui allait le mener à travers les quartiers de la ville, à travers les strates de la mémoire.",
    "Il marcha pendant des jours, peut-être des années. Le temps, dans ce pays, n'avait plus la même consistance.",
    "Le Guide rencontra des gens qui avaient perdu leur nom, d'autres qui avaient oublié leur visage, d'autres encore qui continuaient de chercher quelqu'un qui n'existait plus.",
    "Plus il avançait, plus il comprenait que la ville n'était pas seulement un lieu mais un temps, non seulement un espace mais une durée.",
    "Dans cet éternel crépuscule, le Guide comprit que la mort n'était pas la fin mais le commencement d'une autre manière d'exister.",
    "Et c'est ainsi que s'acheva le premier chapitre de son histoire, mais non la traversée. Car la traversée n'a ni commencement ni fin.",
  ),
  'chapter-2': paras(
    "La ville n'avait pas toujours été ainsi. Avant, avant le jour où la mort refusa de partir, la ville était comme les autres villes : organisée, ordonnée, prévisible.",
    "Puis vint le changement. Ce ne fut pas un événement spectaculaire. Ce fut un glissement, un déplacement imperceptible.",
    "Les morts commencèrent à rester. D'abord quelques-uns, puis de plus en plus. Ils ne s'évaporaient pas à l'aube.",
    "Les vivants, d'abord effrayés, finirent par s'habituer. Ils apprirent à coexister, à partager l'espace, à négocier les territoires.",
    "Les rues ne suivaient plus les directions cardinales mais les mémoires. Les places ne portaient plus les noms des héros mais ceux des oubliés.",
    "Chaque rue racontait une histoire, chaque quartier gardait une mémoire. La ville était devenue un livre géant.",
    "Il y avait le quartier des artisans, le secteur des commerçants, la zone des artistes, le quartier des savants.",
    "Les morts et les vivants ne formaient pas deux communautés séparées mais une seule société composite.",
    "Le Guide observa cette dynamique avec fascination. Il voyait comment les conflits engendraient des solutions.",
    "Et c'est ainsi que la ville devint non seulement le lieu de sa traversée mais le sujet de son étude.",
  ),
  'chapter-3': paras(
    "La mémoire était la véritable monnaie de la ville. On ne payait pas en pièces ou en billets mais en souvenirs, en récits, en traces.",
    "Quand on donnait un souvenir, on ne le perdait pas. Au contraire, il s'enrichissait de la réception.",
    "Le Guide Providentiel était un collectionneur de mémoires. Il écoutait les histoires des uns et des autres, les gardait en lui, les faisait circuler.",
    "Il y avait la mémoire des lieux, celle des mots, celle des gestes.",
    "Il découvrit que la mémoire n'était pas un stockage passif mais une activité créatrice.",
    "Dans la ville, l'oubli était pratiqué comme un art. On apprenait à oublier pour pouvoir se souvenir.",
    "Le Guide finit par devenir lui-même une mémoire vivante, un réservoir de récits, un gardien d'histoires.",
  ),
  'chapter-4': paras(
    "La question de l'héritage était centrale dans la ville. Comment transmettre ce qui avait été reçu ?",
    "Les morts avaient dû inventer de nouvelles formes de transmission : maisons de mémoire, ateliers de savoir, jardins de l'héritage.",
    "Le Guide comprit que l'héritage n'était pas une donnée mais une construction.",
    "Sans réinterprétation, l'héritage devenait un musée, une relique, un fossile.",
    "Il comprit que l'héritage n'était pas une possession mais une responsabilité.",
    "C'était peut-être là le plus précieux héritage : la conscience d'appartenir à une chaîne.",
  ),
  'chapter-5': paras(
    "Dans une ville où le passé était si présent, comment penser le futur ?",
    "Les vivants avaient encore un futur à construire, à imaginer, à habiter.",
    "Le Guide comprit que le futur n'était pas quelque chose qui arrivait mais quelque chose que l'on faisait.",
    "Les morts, bien que n'ayant plus de futur personnel, participaient à la création du futur collectif.",
    "Le passé n'était pas une prison mais un fond, non une contrainte mais une ressource.",
    "Ce futur n'était pas garanti. Mais il était possible, désirable, mérité.",
  ),
}

export const poetryLines = [
  "Dans l'ombre des ruelles oubliées,",
  "Les murmures des ancêtres s'élèvent,",
  "Comme des échos d'un temps révolu,",
  "Où chaque mot est une prière.",
]

export const tocRows = [
  { chapter: 'I', title: 'La mort', page: 12 },
  { chapter: 'II', title: 'La ville', page: 45 },
  { chapter: 'III', title: 'La mémoire', page: 78 },
  { chapter: 'IV', title: "L'héritage", page: 112 },
  { chapter: 'V', title: 'Le futur', page: 146 },
]
