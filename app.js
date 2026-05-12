const STORAGE_KEY = "fauche-lumiere-state-v2";
const LEGACY_STORAGE_KEY = "fauche-lumiere-state";
const ACTIVE_CHARACTER_KEY = "serment-active-character-id";
const DEFAULT_CHARACTERS_MANIFEST_PATH = "personnages/personnages.json";

let PLAYABLE_CHARACTERS = [
  { id: "timble", name: "Timble" },
  { id: "shamash", name: "Shamash" },
  { id: "salomon", name: "Salomon" },
  { id: "sarcine", name: "Sarcine" },
  { id: "kaelen", name: "Kaelen" },
];

let activeCharacterId =
  localStorage.getItem(ACTIVE_CHARACTER_KEY) || PLAYABLE_CHARACTERS[0].id;

function hasSavedCharacter(characterId) {
  return Boolean(localStorage.getItem(storageKeyForCharacter(characterId)));
}

function storageKeyForCharacter(characterId) {
  return `${STORAGE_KEY}-${characterId}`;
}

function getCharacterPreset(characterId = activeCharacterId) {
  return (
    PLAYABLE_CHARACTERS.find((character) => character.id === characterId) ||
    PLAYABLE_CHARACTERS[0]
  );
}

function getCharacterDefaultState(characterId = activeCharacterId) {
  const preset = getCharacterPreset(characterId);
  const base = defaultState();
  base.character.name = preset.name;
  base.encounter.combatants[0].name = preset.name;
  return base;
}

const makeId = () =>
  crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const DAMAGE_TYPES = [
  { id: "acid", label: "Acide", icon: "Ac" },
  { id: "cold", label: "Froid", icon: "Fr" },
  { id: "fire", label: "Feu", icon: "Fe" },
  { id: "force", label: "Force", icon: "Fo" },
  { id: "lightning", label: "Foudre", icon: "Fd" },
  { id: "necrotic", label: "Necrotique", icon: "Ne" },
  { id: "poison", label: "Poison", icon: "Po" },
  { id: "psychic", label: "Psychique", icon: "Ps" },
  { id: "radiant", label: "Radiant", icon: "Ra" },
  { id: "thunder", label: "Tonnerre", icon: "To" },
  { id: "slashing", label: "Tranchant", icon: "Tr" },
  { id: "piercing", label: "Perforant", icon: "Pe" },
  { id: "bludgeoning", label: "Contondant", icon: "Co" },
];

const WEAPON_LIBRARY = [
  { id: "dagger", name: "Dague", damage: "1d4", damageType: "piercing", note: "Finesse, legere, lancer" },
  { id: "club", name: "Gourdin", damage: "1d4", damageType: "bludgeoning", note: "Legere" },
  { id: "greatclub", name: "Massue", damage: "1d8", damageType: "bludgeoning", note: "Deux mains" },
  { id: "handaxe", name: "Hachette", damage: "1d6", damageType: "slashing", note: "Legere, lancer" },
  { id: "javelin", name: "Javeline", damage: "1d6", damageType: "piercing", note: "Lancer" },
  { id: "light-hammer", name: "Marteau leger", damage: "1d4", damageType: "bludgeoning", note: "Legere, lancer" },
  { id: "mace", name: "Masse d'armes", damage: "1d6", damageType: "bludgeoning", note: "Simple" },
  { id: "quarterstaff", name: "Baton", damage: "1d6", damageType: "bludgeoning", note: "Polyvalente 1d8" },
  { id: "sickle", name: "Serpe", damage: "1d4", damageType: "slashing", note: "Legere" },
  { id: "spear", name: "Lance", damage: "1d6", damageType: "piercing", note: "Lancer, polyvalente 1d8" },
  { id: "light-crossbow", name: "Arbalete legere", damage: "1d8", damageType: "piercing", note: "Munitions, chargement, deux mains" },
  { id: "shortbow", name: "Arc court", damage: "1d6", damageType: "piercing", note: "Munitions, deux mains" },
  { id: "longbow", name: "Arc long", damage: "1d8", damageType: "piercing", note: "Munitions, lourd, deux mains" },
  { id: "battleaxe", name: "Hache d'armes", damage: "1d8", damageType: "slashing", note: "Polyvalente 1d10" },
  { id: "greataxe", name: "Grande hache", damage: "1d12", damageType: "slashing", note: "Lourde, deux mains" },
  { id: "greatsword", name: "Espadon", damage: "2d6", damageType: "slashing", note: "Lourd, deux mains" },
  { id: "longsword", name: "Epee longue", damage: "1d8", damageType: "slashing", note: "Polyvalente 1d10" },
  { id: "rapier", name: "Rapiere", damage: "1d8", damageType: "piercing", note: "Finesse" },
  { id: "scimitar", name: "Cimeterre", damage: "1d6", damageType: "slashing", note: "Finesse, legere" },
  { id: "shortsword", name: "Epee courte", damage: "1d6", damageType: "piercing", note: "Finesse, legere" },
  { id: "warhammer", name: "Marteau de guerre", damage: "1d8", damageType: "bludgeoning", note: "Polyvalente 1d10" },
  { id: "whip", name: "Fouet", damage: "1d4", damageType: "slashing", note: "Finesse, allonge" },
];

const INJURY_PARTS = [
  { id: "head", label: "Tete" },
  { id: "torso", label: "Torse" },
  { id: "left-arm", label: "Bras gauche" },
  { id: "right-arm", label: "Bras droit" },
  { id: "left-leg", label: "Jambe gauche" },
  { id: "right-leg", label: "Jambe droite" },
];

const QUEST_STATUSES = {
  "en-cours": "En cours",
  terminee: "Terminee",
  oubliee: "Oubliee",
  delaissee: "Delaissee",
  "en-attente": "En attente",
};

const SPELL_DAMAGE_OVERRIDES = {
  "acid-splash": "acid", "fire-bolt": "fire", "poison-spray": "poison", "ray-of-frost": "cold",
  "sacred-flame": "radiant", "shocking-grasp": "lightning", "vicious-mockery": "psychic",
  "burning-hands": "fire", "cure-wounds": "none", "guiding-bolt": "radiant", "healing-word": "none",
  "hellish-rebuke": "fire", "inflict-wounds": "necrotic", "magic-missile": "force", "ray-of-sickness": "poison",
  "thunderwave": "thunder", "aid": "none", "blindness-deafness": "none", "flaming-sphere": "fire",
  "lesser-restoration": "none", "scorching-ray": "fire", shatter: "thunder", "spiritual-weapon": "force",
  "animate-dead": "none", "beacon-of-hope": "none", counterspell: "none", "dispel-magic": "none",
  fireball: "fire", "lightning-bolt": "lightning", "mass-healing-word": "none", "protection-from-energy": "none",
  revivify: "none", "spirit-guardians": "radiant", "banishment": "none", blight: "necrotic",
  "fire-shield": "fire", "ice-storm": "bludgeoning", "wall-of-fire": "fire", cloudkill: "poison",
  "cone-of-cold": "cold", "flame-strike": "fire", "greater-restoration": "none", "mass-cure-wounds": "none",
  "raise-dead": "none", "wall-of-force": "force", "chain-lightning": "lightning", "circle-of-death": "necrotic",
  disintegrate: "force", harm: "necrotic", heal: "none", sunbeam: "radiant",
  "delayed-blast-fireball": "fire", "finger-of-death": "necrotic", "fire-storm": "fire",
  regenerate: "none", resurrection: "none", earthquake: "bludgeoning", sunburst: "radiant",
  "mass-heal": "none", "meteor-swarm": "fire", "power-word-kill": "none", wish: "none",
};

function inferSpellDamageType(spell) {
  if (SPELL_DAMAGE_OVERRIDES[spell.id]) return SPELL_DAMAGE_OVERRIDES[spell.id];
  const text = `${spell.fr} ${spell.en} ${spell.school}`.toLowerCase();
  if (/feu|fire|flame|burn/.test(text)) return "fire";
  if (/froid|givre|cold|frost|ice/.test(text)) return "cold";
  if (/foudre|eclair|lightning/.test(text)) return "lightning";
  if (/poison|venom/.test(text)) return "poison";
  if (/necrom|mort|death|harm|wound/.test(text)) return "necrotic";
  if (/radiant|sacre|sacred|sun/.test(text)) return "radiant";
  if (/psych|mockery|mind/.test(text)) return "psychic";
  if (/thunder|tonnerre|onde|shatter/.test(text)) return "thunder";
  if (/acid|acide/.test(text)) return "acid";
  if (/force|magic missile|mur de force/.test(text)) return "force";
  return "none";
}

function damageTypeLabel(typeId) {
  if (!typeId || typeId === "none") return "Aucun / utilitaire";
  return DAMAGE_TYPES.find((type) => type.id === typeId)?.label || typeId;
}


const SPELL_DETAILS = {
  "acid-splash": { description: "Projette une bulle d'acide sur une ou deux creatures proches.", damage: "1d6 acide (augmente aux niveaux 5, 11 et 17)" },
  "blade-ward": { description: "Vous protege temporairement contre les attaques d'armes." },
  "dancing-lights": { description: "Cree jusqu'a quatre lumieres mobiles que vous controlez." },
  "fire-bolt": { description: "Lance un trait de feu a distance sur une creature ou un objet.", damage: "1d10 feu (augmente aux niveaux 5, 11 et 17)" },
  "light": { description: "Fait briller un objet touche comme une torche." },
  "mage-hand": { description: "Cree une main spectrale capable de manipuler de petits objets a distance." },
  "mending": { description: "Repare une petite cassure ou dechirure sur un objet." },
  "message": { description: "Envoie un court murmure magique a une creature proche." },
  "minor-illusion": { description: "Cree un son ou une image illusoire de petite taille." },
  "poison-spray": { description: "Projette une vapeur toxique sur une creature proche.", damage: "1d12 poison (augmente aux niveaux 5, 11 et 17)" },
  "prestidigitation": { description: "Produit de petits effets magiques mineurs et pratiques." },
  "ray-of-frost": { description: "Projette un rayon glacial qui ralentit la cible.", damage: "1d8 froid (augmente aux niveaux 5, 11 et 17)" },
  "sacred-flame": { description: "Frappe une creature visible avec une flamme radieuse.", damage: "1d8 radiant (augmente aux niveaux 5, 11 et 17)" },
  "shillelagh": { description: "Rend un gourdin ou baton magique pour l'attaque et les degats." },
  "shocking-grasp": { description: "Touche une creature avec de l'electricite et gene ses reactions.", damage: "1d8 foudre (augmente aux niveaux 5, 11 et 17)" },
  "spare-the-dying": { description: "Stabilise une creature mourante." },
  "thaumaturgy": { description: "Produit de petits signes surnaturels impressionnants." },
  "true-strike": { description: "Aide a anticiper la defense d'une cible pour votre prochaine attaque." },
  "vicious-mockery": { description: "Insulte magique qui trouble la cible.", damage: "1d4 psychique (augmente aux niveaux 5, 11 et 17)" },
  "burning-hands": { description: "Un cone de flammes jaillit de vos mains.", damage: "3d6 feu" },
  "cure-wounds": { description: "Rend des points de vie a une creature touchee.", damage: "Soin: 1d8 + modificateur de caracteristique" },
  "guiding-bolt": { description: "Un eclair lumineux marque la cible pour faciliter la prochaine attaque.", damage: "4d6 radiant" },
  "healing-word": { description: "Soigne rapidement une creature a distance avec une parole magique.", damage: "Soin: 1d4 + modificateur de caracteristique" },
  "hellish-rebuke": { description: "Riposte infernale contre une creature qui vous blesse.", damage: "2d10 feu" },
  "inflict-wounds": { description: "Une attaque de contact inflige une necrose brutale.", damage: "3d10 necrotique" },
  "magic-missile": { description: "Cree des projectiles magiques qui touchent automatiquement.", damage: "3 projectiles de 1d4 + 1 force" },
  "ray-of-sickness": { description: "Rayon verdatre qui empoisonne potentiellement la cible.", damage: "2d8 poison" },
  "sleep": { description: "Endort des creatures dans une zone selon leurs points de vie.", damage: "Aucun degat; affecte 5d8 PV" },
  "thunderwave": { description: "Onde de tonnerre qui repousse les creatures proches.", damage: "2d8 tonnerre" },
  "flaming-sphere": { description: "Cree une sphere de feu mobile qui percute et brule.", damage: "2d6 feu" },
  "scorching-ray": { description: "Projette plusieurs rayons ardents sur une ou plusieurs cibles.", damage: "3 rayons de 2d6 feu" },
  "shatter": { description: "Explosion sonore qui detruit et blesse dans une zone.", damage: "3d8 tonnerre" },
  "spiritual-weapon": { description: "Cree une arme spectrale qui attaque a distance.", damage: "1d8 + modificateur de caracteristique force" },
  "glyph-of-warding": { description: "Inscrit un glyphe piege pouvant declencher un sort ou une explosion.", damage: "Explosion: 5d8 selon le type choisi" },
  "fireball": { description: "Explosion de feu dans une large zone.", damage: "8d6 feu" },
  "lightning-bolt": { description: "Ligne d'eclair traversant les creatures sur son trajet.", damage: "8d6 foudre" },
  "mass-healing-word": { description: "Soigne plusieurs allies a distance avec une parole magique.", damage: "Soin: 1d4 + modificateur de caracteristique" },
  "spirit-guardians": { description: "Des esprits protecteurs blessent les ennemis autour de vous.", damage: "3d8 radiant ou necrotique" },
  "blight": { description: "Draine l'humidite et la vitalite d'une creature.", damage: "8d8 necrotique" },
  "fire-shield": { description: "Vous entoure de flammes defensives chaudes ou froides.", damage: "2d8 feu ou froid contre les attaquants" },
  "ice-storm": { description: "Grele et glace frappent une zone.", damage: "2d8 contondant + 4d6 froid" },
  "wall-of-fire": { description: "Dresse un mur de feu qui brule les creatures proches ou le traversant.", damage: "5d8 feu" },
  "cloudkill": { description: "Nuage toxique mobile qui empoisonne les creatures dedans.", damage: "5d8 poison" },
  "cone-of-cold": { description: "Souffle glacial en cone.", damage: "8d8 froid" },
  "flame-strike": { description: "Colonne de feu divin descendant du ciel.", damage: "4d6 feu + 4d6 radiant" },
  "insect-plague": { description: "Essaim d'insectes mordants dans une zone.", damage: "4d10 perforant" },
  "mass-cure-wounds": { description: "Soigne plusieurs creatures dans une zone.", damage: "Soin: 3d8 + modificateur de caracteristique" },
  "chain-lightning": { description: "Eclair principal qui se ramifie vers plusieurs cibles.", damage: "10d8 foudre" },
  "circle-of-death": { description: "Sphere d'energie negative qui ravage une grande zone.", damage: "8d6 necrotique" },
  "disintegrate": { description: "Rayon destructeur qui peut reduire la cible en poussiere.", damage: "10d6 + 40 force" },
  "harm": { description: "Inflige une necrose massive et reduit temporairement les PV maximum.", damage: "14d6 necrotique" },
  "heal": { description: "Rend beaucoup de points de vie et retire certains etats.", damage: "Soin: 70 PV" },
  "sunbeam": { description: "Rayon de lumiere intense que vous pouvez relancer pendant la concentration.", damage: "6d8 radiant" },
  "delayed-blast-fireball": { description: "Boule de feu retardee qui devient plus puissante avec le temps.", damage: "12d6 feu + 1d6 par round de retard" },
  "finger-of-death": { description: "Energie necrotique qui peut relever la victime en zombie.", damage: "7d8 + 30 necrotique" },
  "fire-storm": { description: "Tempete de flammes modelable dans plusieurs cubes.", damage: "7d10 feu" },
  "regenerate": { description: "Rend des PV et fait repousser les membres perdus.", damage: "Soin: 4d8 + 15 puis 1 PV par round" },
  "earthquake": { description: "Secousse massive qui fissure le sol et detruit les structures.", damage: "Degats variables selon terrain/effondrement" },
  "sunburst": { description: "Lumiere solaire aveuglante dans une grande zone.", damage: "12d6 radiant" },
  "mass-heal": { description: "Distribue une immense quantite de soins entre plusieurs creatures.", damage: "Soin: 700 PV repartis" },
  "meteor-swarm": { description: "Quatre meteores explosent dans de vastes zones.", damage: "20d6 feu + 20d6 contondant" },
  "power-word-kill": { description: "Tue instantanement une creature assez affaiblie." },
  "aid": { description: "Augmente temporairement les points de vie actuels et maximum de plusieurs allies." },
  "shield": { description: "Reaction defensive qui augmente fortement la CA jusqu'au debut de votre prochain tour." },
  "misty-step": { description: "Teleportation courte en action bonus vers un espace visible." },
  "counterspell": { description: "Interrompt le lancement d'un sort adverse." },
  "dispel-magic": { description: "Met fin a un sort ou effet magique sur une cible." },
  "revivify": { description: "Ramene a la vie une creature morte tres recemment." },
  "greater-restoration": { description: "Retire un effet grave comme charme, petrification, malediction ou reduction de caracteristique." },
  "raise-dead": { description: "Ramene a la vie une creature morte depuis peu." },
  "resurrection": { description: "Ramene a la vie une creature morte depuis longtemps." },
  "true-resurrection": { description: "Ramene pleinement a la vie une creature, meme sans corps complet." },
  "wish": { description: "Reproduit un sort puissant ou formule un effet exceptionnel au risque de complications." }
};

function buildSpellDescription(spell) {
  const level = spellLevelLabel(Number(spell.level) || 0).toLowerCase();
  const school = spell.school || "magie";
  const classes = Array.isArray(spell.classes) && spell.classes.length ? spell.classes.join(", ") : "classe non precisee";
  return `Sort de ${level} (${school}) pour ${classes}. Effet detaille a noter selon votre table ou vos regles.`;
}

function getSpellDescription(spell) {
  return spell.description || spell.notes || SPELL_DETAILS[spell.id]?.description || buildSpellDescription(spell);
}

function getSpellDamageText(spell) {
  const damage = spell.damage || SPELL_DETAILS[spell.id]?.damage || "";
  const type = damageTypeLabel(spell.damageType || inferSpellDamageType(spell));
  return damage ? `${damage} · ${type}` : type;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const SPELL_LIBRARY = [
  { id: "acid-splash", fr: "Aspersion acide", en: "Acid Splash", level: 0, school: "Invocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "blade-ward", fr: "Protection contre les armes", en: "Blade Ward", level: 0, school: "Abjuration", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "dancing-lights", fr: "Lumieres dansantes", en: "Dancing Lights", level: 0, school: "Evocation", classes: ["Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "fire-bolt", fr: "Trait de feu", en: "Fire Bolt", level: 0, school: "Evocation", classes: ["Artificier", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "light", fr: "Lumiere", en: "Light", level: 0, school: "Evocation", classes: ["Barde", "Clerc", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "mage-hand", fr: "Main de mage", en: "Mage Hand", level: 0, school: "Invocation", classes: ["Artificier", "Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "mending", fr: "Reparation", en: "Mending", level: 0, school: "Transmutation", classes: ["Artificier", "Barde", "Clerc", "Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "message", fr: "Message", en: "Message", level: 0, school: "Transmutation", classes: ["Artificier", "Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "minor-illusion", fr: "Illusion mineure", en: "Minor Illusion", level: 0, school: "Illusion", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "poison-spray", fr: "Jet de poison", en: "Poison Spray", level: 0, school: "Invocation", classes: ["Druide", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "prestidigitation", fr: "Prestidigitation", en: "Prestidigitation", level: 0, school: "Transmutation", classes: ["Artificier", "Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "ray-of-frost", fr: "Rayon de givre", en: "Ray of Frost", level: 0, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "sacred-flame", fr: "Flamme sacree", en: "Sacred Flame", level: 0, school: "Evocation", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "shillelagh", fr: "Gourdin magique", en: "Shillelagh", level: 0, school: "Transmutation", classes: ["Druide"], source: "SRD 5.1" },
  { id: "shocking-grasp", fr: "Poigne electrique", en: "Shocking Grasp", level: 0, school: "Evocation", classes: ["Artificier", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "spare-the-dying", fr: "Stabilisation", en: "Spare the Dying", level: 0, school: "Necromancie", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "thaumaturgy", fr: "Thaumaturgie", en: "Thaumaturgy", level: 0, school: "Transmutation", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "true-strike", fr: "Coup au but", en: "True Strike", level: 0, school: "Divination", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "vicious-mockery", fr: "Moquerie cruelle", en: "Vicious Mockery", level: 0, school: "Enchantement", classes: ["Barde"], source: "SRD 5.1" },
  { id: "alarm", fr: "Alarme", en: "Alarm", level: 1, school: "Abjuration", classes: ["Artificier", "Magicien", "Rodeur"], source: "SRD 5.1" },
  { id: "bane", fr: "Fleau", en: "Bane", level: 1, school: "Enchantement", classes: ["Barde", "Clerc"], source: "SRD 5.1" },
  { id: "bless", fr: "Benediction", en: "Bless", level: 1, school: "Enchantement", classes: ["Clerc", "Paladin"], source: "SRD 5.1" },
  { id: "burning-hands", fr: "Mains brulantes", en: "Burning Hands", level: 1, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "charm-person", fr: "Charme-personne", en: "Charm Person", level: 1, school: "Enchantement", classes: ["Barde", "Druide", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "color-spray", fr: "Couleurs dansantes", en: "Color Spray", level: 1, school: "Illusion", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "command", fr: "Injonction", en: "Command", level: 1, school: "Enchantement", classes: ["Clerc", "Paladin"], source: "SRD 5.1" },
  { id: "comprehend-languages", fr: "Comprehension des langues", en: "Comprehend Languages", level: 1, school: "Divination", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "cure-wounds", fr: "Soins", en: "Cure Wounds", level: 1, school: "Evocation", classes: ["Artificier", "Barde", "Clerc", "Druide", "Paladin", "Rodeur"], source: "SRD 5.1" },
  { id: "detect-magic", fr: "Detection de la magie", en: "Detect Magic", level: 1, school: "Divination", classes: ["Artificier", "Barde", "Clerc", "Druide", "Ensorceleur", "Magicien", "Paladin", "Rodeur"], source: "SRD 5.1" },
  { id: "disguise-self", fr: "Deguisement", en: "Disguise Self", level: 1, school: "Illusion", classes: ["Artificier", "Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "entangle", fr: "Enchevetrement", en: "Entangle", level: 1, school: "Invocation", classes: ["Druide", "Rodeur"], source: "SRD 5.1" },
  { id: "faerie-fire", fr: "Lueurs feeriques", en: "Faerie Fire", level: 1, school: "Evocation", classes: ["Artificier", "Barde", "Druide"], source: "SRD 5.1" },
  { id: "feather-fall", fr: "Feuille morte", en: "Feather Fall", level: 1, school: "Transmutation", classes: ["Artificier", "Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "fog-cloud", fr: "Nappe de brouillard", en: "Fog Cloud", level: 1, school: "Invocation", classes: ["Druide", "Ensorceleur", "Magicien", "Rodeur"], source: "SRD 5.1" },
  { id: "goodberry", fr: "Baies nourricieres", en: "Goodberry", level: 1, school: "Transmutation", classes: ["Druide", "Rodeur"], source: "SRD 5.1" },
  { id: "guiding-bolt", fr: "Eclair traçant", en: "Guiding Bolt", level: 1, school: "Evocation", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "healing-word", fr: "Mot de guerison", en: "Healing Word", level: 1, school: "Evocation", classes: ["Barde", "Clerc", "Druide"], source: "SRD 5.1" },
  { id: "hellish-rebuke", fr: "Reprimande infernale", en: "Hellish Rebuke", level: 1, school: "Evocation", classes: ["Occultiste"], source: "SRD 5.1" },
  { id: "identify", fr: "Identification", en: "Identify", level: 1, school: "Divination", classes: ["Artificier", "Barde", "Magicien"], source: "SRD 5.1" },
  { id: "inflict-wounds", fr: "Blessure", en: "Inflict Wounds", level: 1, school: "Necromancie", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "jump", fr: "Saut", en: "Jump", level: 1, school: "Transmutation", classes: ["Artificier", "Druide", "Ensorceleur", "Magicien", "Rodeur"], source: "SRD 5.1" },
  { id: "longstrider", fr: "Grande foulee", en: "Longstrider", level: 1, school: "Transmutation", classes: ["Artificier", "Barde", "Druide", "Magicien", "Rodeur"], source: "SRD 5.1" },
  { id: "mage-armor", fr: "Armure du mage", en: "Mage Armor", level: 1, school: "Abjuration", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "magic-missile", fr: "Projectile magique", en: "Magic Missile", level: 1, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "ray-of-sickness", fr: "Rayon empoisonne", en: "Ray of Sickness", level: 1, school: "Necromancie", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "shield", fr: "Bouclier", en: "Shield", level: 1, school: "Abjuration", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "sleep", fr: "Sommeil", en: "Sleep", level: 1, school: "Enchantement", classes: ["Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "thunderwave", fr: "Onde de choc", en: "Thunderwave", level: 1, school: "Evocation", classes: ["Barde", "Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "aid", fr: "Aide", en: "Aid", level: 2, school: "Abjuration", classes: ["Artificier", "Clerc", "Paladin"], source: "SRD 5.1" },
  { id: "alter-self", fr: "Modification d'apparence", en: "Alter Self", level: 2, school: "Transmutation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "arcane-lock", fr: "Verrou magique", en: "Arcane Lock", level: 2, school: "Abjuration", classes: ["Artificier", "Magicien"], source: "SRD 5.1" },
  { id: "blindness-deafness", fr: "Cecite/surdite", en: "Blindness/Deafness", level: 2, school: "Necromancie", classes: ["Barde", "Clerc", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "blur", fr: "Flou", en: "Blur", level: 2, school: "Illusion", classes: ["Artificier", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "calm-emotions", fr: "Apaisement des emotions", en: "Calm Emotions", level: 2, school: "Enchantement", classes: ["Barde", "Clerc"], source: "SRD 5.1" },
  { id: "darkness", fr: "Tenebres", en: "Darkness", level: 2, school: "Evocation", classes: ["Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "darkvision", fr: "Vision dans le noir", en: "Darkvision", level: 2, school: "Transmutation", classes: ["Druide", "Ensorceleur", "Magicien", "Rodeur"], source: "SRD 5.1" },
  { id: "detect-thoughts", fr: "Detection des pensees", en: "Detect Thoughts", level: 2, school: "Divination", classes: ["Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "enhance-ability", fr: "Amelioration de caracteristique", en: "Enhance Ability", level: 2, school: "Transmutation", classes: ["Artificier", "Barde", "Clerc", "Druide", "Ensorceleur"], source: "SRD 5.1" },
  { id: "flaming-sphere", fr: "Sphere de feu", en: "Flaming Sphere", level: 2, school: "Invocation", classes: ["Druide", "Magicien"], source: "SRD 5.1" },
  { id: "hold-person", fr: "Immobilisation de personne", en: "Hold Person", level: 2, school: "Enchantement", classes: ["Barde", "Clerc", "Druide", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "invisibility", fr: "Invisibilite", en: "Invisibility", level: 2, school: "Illusion", classes: ["Artificier", "Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "knock", fr: "Deblocage", en: "Knock", level: 2, school: "Transmutation", classes: ["Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "lesser-restoration", fr: "Restauration partielle", en: "Lesser Restoration", level: 2, school: "Abjuration", classes: ["Artificier", "Barde", "Clerc", "Druide", "Paladin", "Rodeur"], source: "SRD 5.1" },
  { id: "levitate", fr: "Levitation", en: "Levitate", level: 2, school: "Transmutation", classes: ["Artificier", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "mirror-image", fr: "Image miroir", en: "Mirror Image", level: 2, school: "Illusion", classes: ["Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "misty-step", fr: "Foulee brumeuse", en: "Misty Step", level: 2, school: "Invocation", classes: ["Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "pass-without-trace", fr: "Passage sans trace", en: "Pass without Trace", level: 2, school: "Abjuration", classes: ["Druide", "Rodeur"], source: "SRD 5.1" },
  { id: "scorching-ray", fr: "Rayon ardent", en: "Scorching Ray", level: 2, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "shatter", fr: "Fracassement", en: "Shatter", level: 2, school: "Evocation", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "silence", fr: "Silence", en: "Silence", level: 2, school: "Illusion", classes: ["Barde", "Clerc", "Rodeur"], source: "SRD 5.1" },
  { id: "spider-climb", fr: "Pattes d'araignee", en: "Spider Climb", level: 2, school: "Transmutation", classes: ["Artificier", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "spiritual-weapon", fr: "Arme spirituelle", en: "Spiritual Weapon", level: 2, school: "Evocation", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "web", fr: "Toile d'araignee", en: "Web", level: 2, school: "Invocation", classes: ["Artificier", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "animate-dead", fr: "Animation des morts", en: "Animate Dead", level: 3, school: "Necromancie", classes: ["Clerc", "Magicien"], source: "SRD 5.1" },
  { id: "beacon-of-hope", fr: "Lueur d'espoir", en: "Beacon of Hope", level: 3, school: "Abjuration", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "bestow-curse", fr: "Jeter une malediction", en: "Bestow Curse", level: 3, school: "Necromancie", classes: ["Barde", "Clerc", "Magicien"], source: "SRD 5.1" },
  { id: "counterspell", fr: "Contresort", en: "Counterspell", level: 3, school: "Abjuration", classes: ["Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "daylight", fr: "Lumiere du jour", en: "Daylight", level: 3, school: "Evocation", classes: ["Clerc", "Druide", "Paladin", "Rodeur", "Ensorceleur"], source: "SRD 5.1" },
  { id: "dispel-magic", fr: "Dissipation de la magie", en: "Dispel Magic", level: 3, school: "Abjuration", classes: ["Barde", "Clerc", "Druide", "Ensorceleur", "Magicien", "Occultiste", "Paladin"], source: "SRD 5.1" },
  { id: "fireball", fr: "Boule de feu", en: "Fireball", level: 3, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "fly", fr: "Vol", en: "Fly", level: 3, school: "Transmutation", classes: ["Artificier", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "gaseous-form", fr: "Forme gazeuse", en: "Gaseous Form", level: 3, school: "Transmutation", classes: ["Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "glyph-of-warding", fr: "Glyphe de protection", en: "Glyph of Warding", level: 3, school: "Abjuration", classes: ["Barde", "Clerc", "Magicien"], source: "SRD 5.1" },
  { id: "haste", fr: "Hate", en: "Haste", level: 3, school: "Transmutation", classes: ["Artificier", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "hypnotic-pattern", fr: "Motif hypnotique", en: "Hypnotic Pattern", level: 3, school: "Illusion", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "lightning-bolt", fr: "Eclair", en: "Lightning Bolt", level: 3, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "major-image", fr: "Image majeure", en: "Major Image", level: 3, school: "Illusion", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "mass-healing-word", fr: "Mot de guerison de groupe", en: "Mass Healing Word", level: 3, school: "Evocation", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "protection-from-energy", fr: "Protection contre l'energie", en: "Protection from Energy", level: 3, school: "Abjuration", classes: ["Artificier", "Clerc", "Druide", "Ensorceleur", "Magicien", "Rodeur"], source: "SRD 5.1" },
  { id: "remove-curse", fr: "Delivrance des maledictions", en: "Remove Curse", level: 3, school: "Abjuration", classes: ["Clerc", "Magicien", "Occultiste", "Paladin"], source: "SRD 5.1" },
  { id: "revivify", fr: "Reviviscence", en: "Revivify", level: 3, school: "Necromancie", classes: ["Artificier", "Clerc", "Paladin"], source: "SRD 5.1" },
  { id: "sending", fr: "Communication a distance", en: "Sending", level: 3, school: "Evocation", classes: ["Barde", "Clerc", "Magicien"], source: "SRD 5.1" },
  { id: "sleet-storm", fr: "Tempete de neige", en: "Sleet Storm", level: 3, school: "Invocation", classes: ["Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "slow", fr: "Lenteur", en: "Slow", level: 3, school: "Transmutation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "spirit-guardians", fr: "Gardiens spirituels", en: "Spirit Guardians", level: 3, school: "Invocation", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "stinking-cloud", fr: "Nuage nauseabond", en: "Stinking Cloud", level: 3, school: "Invocation", classes: ["Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "tongues", fr: "Langues", en: "Tongues", level: 3, school: "Divination", classes: ["Barde", "Clerc", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "water-breathing", fr: "Respiration aquatique", en: "Water Breathing", level: 3, school: "Transmutation", classes: ["Artificier", "Druide", "Ensorceleur", "Magicien", "Rodeur"], source: "SRD 5.1" },
  { id: "arcane-eye", fr: "Oeil magique", en: "Arcane Eye", level: 4, school: "Divination", classes: ["Artificier", "Magicien"], source: "SRD 5.1" },
  { id: "banishment", fr: "Bannissement", en: "Banishment", level: 4, school: "Abjuration", classes: ["Clerc", "Ensorceleur", "Magicien", "Occultiste", "Paladin"], source: "SRD 5.1" },
  { id: "blight", fr: "Fletrissement", en: "Blight", level: 4, school: "Necromancie", classes: ["Druide", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "confusion", fr: "Confusion", en: "Confusion", level: 4, school: "Enchantement", classes: ["Barde", "Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "dimension-door", fr: "Porte dimensionnelle", en: "Dimension Door", level: 4, school: "Invocation", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "dominate-beast", fr: "Domination de bete", en: "Dominate Beast", level: 4, school: "Enchantement", classes: ["Druide", "Ensorceleur"], source: "SRD 5.1" },
  { id: "fire-shield", fr: "Bouclier de feu", en: "Fire Shield", level: 4, school: "Evocation", classes: ["Magicien"], source: "SRD 5.1" },
  { id: "freedom-of-movement", fr: "Liberte de mouvement", en: "Freedom of Movement", level: 4, school: "Abjuration", classes: ["Barde", "Clerc", "Druide", "Rodeur"], source: "SRD 5.1" },
  { id: "greater-invisibility", fr: "Invisibilite superieure", en: "Greater Invisibility", level: 4, school: "Illusion", classes: ["Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "ice-storm", fr: "Tempete de grele", en: "Ice Storm", level: 4, school: "Evocation", classes: ["Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "polymorph", fr: "Metamorphose", en: "Polymorph", level: 4, school: "Transmutation", classes: ["Barde", "Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "stoneskin", fr: "Peau de pierre", en: "Stoneskin", level: 4, school: "Abjuration", classes: ["Artificier", "Druide", "Ensorceleur", "Magicien", "Rodeur"], source: "SRD 5.1" },
  { id: "wall-of-fire", fr: "Mur de feu", en: "Wall of Fire", level: 4, school: "Evocation", classes: ["Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "animate-objects", fr: "Animation des objets", en: "Animate Objects", level: 5, school: "Transmutation", classes: ["Artificier", "Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "cloudkill", fr: "Nuage mortel", en: "Cloudkill", level: 5, school: "Invocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "commune", fr: "Communion", en: "Commune", level: 5, school: "Divination", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "cone-of-cold", fr: "Cone de froid", en: "Cone of Cold", level: 5, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "contact-other-plane", fr: "Contact avec les plans", en: "Contact Other Plane", level: 5, school: "Divination", classes: ["Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "dominate-person", fr: "Domination de personne", en: "Dominate Person", level: 5, school: "Enchantement", classes: ["Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "flame-strike", fr: "Colonne de flamme", en: "Flame Strike", level: 5, school: "Evocation", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "geas", fr: "Injonction supreme", en: "Geas", level: 5, school: "Enchantement", classes: ["Barde", "Clerc", "Druide", "Magicien", "Paladin"], source: "SRD 5.1" },
  { id: "greater-restoration", fr: "Restauration superieure", en: "Greater Restoration", level: 5, school: "Abjuration", classes: ["Artificier", "Barde", "Clerc", "Druide"], source: "SRD 5.1" },
  { id: "hold-monster", fr: "Immobilisation de monstre", en: "Hold Monster", level: 5, school: "Enchantement", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "insect-plague", fr: "Fleau d'insectes", en: "Insect Plague", level: 5, school: "Invocation", classes: ["Clerc", "Druide", "Ensorceleur"], source: "SRD 5.1" },
  { id: "mass-cure-wounds", fr: "Soins de groupe", en: "Mass Cure Wounds", level: 5, school: "Evocation", classes: ["Barde", "Clerc", "Druide"], source: "SRD 5.1" },
  { id: "raise-dead", fr: "Rappel a la vie", en: "Raise Dead", level: 5, school: "Necromancie", classes: ["Barde", "Clerc", "Paladin"], source: "SRD 5.1" },
  { id: "scrying", fr: "Scrutation", en: "Scrying", level: 5, school: "Divination", classes: ["Barde", "Clerc", "Druide", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "telekinesis", fr: "Telekinesie", en: "Telekinesis", level: 5, school: "Transmutation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "wall-of-force", fr: "Mur de force", en: "Wall of Force", level: 5, school: "Evocation", classes: ["Magicien"], source: "SRD 5.1" },
  { id: "wall-of-stone", fr: "Mur de pierre", en: "Wall of Stone", level: 5, school: "Evocation", classes: ["Artificier", "Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "chain-lightning", fr: "Chaine d'eclairs", en: "Chain Lightning", level: 6, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "circle-of-death", fr: "Cercle de mort", en: "Circle of Death", level: 6, school: "Necromancie", classes: ["Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "contingency", fr: "Contingence", en: "Contingency", level: 6, school: "Evocation", classes: ["Magicien"], source: "SRD 5.1" },
  { id: "create-undead", fr: "Creation de mort-vivant", en: "Create Undead", level: 6, school: "Necromancie", classes: ["Clerc", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "disintegrate", fr: "Desintegration", en: "Disintegrate", level: 6, school: "Transmutation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "eyebite", fr: "Mauvais oeil", en: "Eyebite", level: 6, school: "Necromancie", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "harm", fr: "Fletrissure", en: "Harm", level: 6, school: "Necromancie", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "heal", fr: "Guerison", en: "Heal", level: 6, school: "Evocation", classes: ["Clerc", "Druide"], source: "SRD 5.1" },
  { id: "heroes-feast", fr: "Festin des heros", en: "Heroes' Feast", level: 6, school: "Invocation", classes: ["Clerc", "Druide"], source: "SRD 5.1" },
  { id: "sunbeam", fr: "Rayon de soleil", en: "Sunbeam", level: 6, school: "Evocation", classes: ["Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "true-seeing", fr: "Vision supreme", en: "True Seeing", level: 6, school: "Divination", classes: ["Barde", "Clerc", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "delayed-blast-fireball", fr: "Boule de feu a retardement", en: "Delayed Blast Fireball", level: 7, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "etherealness", fr: "Forme etheree", en: "Etherealness", level: 7, school: "Transmutation", classes: ["Barde", "Clerc", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "finger-of-death", fr: "Doigt de mort", en: "Finger of Death", level: 7, school: "Necromancie", classes: ["Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "fire-storm", fr: "Tempete de feu", en: "Fire Storm", level: 7, school: "Evocation", classes: ["Clerc", "Druide", "Ensorceleur"], source: "SRD 5.1" },
  { id: "plane-shift", fr: "Changement de plan", en: "Plane Shift", level: 7, school: "Invocation", classes: ["Clerc", "Druide", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "regenerate", fr: "Regeneration", en: "Regenerate", level: 7, school: "Transmutation", classes: ["Barde", "Clerc", "Druide"], source: "SRD 5.1" },
  { id: "resurrection", fr: "Resurrection", en: "Resurrection", level: 7, school: "Necromancie", classes: ["Barde", "Clerc"], source: "SRD 5.1" },
  { id: "reverse-gravity", fr: "Inversion de la gravite", en: "Reverse Gravity", level: 7, school: "Transmutation", classes: ["Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "symbol", fr: "Symbole", en: "Symbol", level: 7, school: "Abjuration", classes: ["Barde", "Clerc", "Magicien"], source: "SRD 5.1" },
  { id: "teleport", fr: "Teleportation", en: "Teleport", level: 7, school: "Invocation", classes: ["Barde", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "antimagic-field", fr: "Champ antimagie", en: "Antimagic Field", level: 8, school: "Abjuration", classes: ["Clerc", "Magicien"], source: "SRD 5.1" },
  { id: "clone", fr: "Clone", en: "Clone", level: 8, school: "Necromancie", classes: ["Magicien"], source: "SRD 5.1" },
  { id: "control-weather", fr: "Controle du climat", en: "Control Weather", level: 8, school: "Transmutation", classes: ["Clerc", "Druide", "Magicien"], source: "SRD 5.1" },
  { id: "dominate-monster", fr: "Domination de monstre", en: "Dominate Monster", level: 8, school: "Enchantement", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "earthquake", fr: "Tremblement de terre", en: "Earthquake", level: 8, school: "Evocation", classes: ["Clerc", "Druide", "Ensorceleur"], source: "SRD 5.1" },
  { id: "holy-aura", fr: "Aura sacree", en: "Holy Aura", level: 8, school: "Abjuration", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "maze", fr: "Labyrinthe", en: "Maze", level: 8, school: "Invocation", classes: ["Magicien"], source: "SRD 5.1" },
  { id: "mind-blank", fr: "Esprit impenetrable", en: "Mind Blank", level: 8, school: "Abjuration", classes: ["Barde", "Magicien"], source: "SRD 5.1" },
  { id: "power-word-stun", fr: "Mot de pouvoir etourdissant", en: "Power Word Stun", level: 8, school: "Enchantement", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "sunburst", fr: "Explosion de lumiere", en: "Sunburst", level: 8, school: "Evocation", classes: ["Druide", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "astral-projection", fr: "Projection astrale", en: "Astral Projection", level: 9, school: "Necromancie", classes: ["Clerc", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "foresight", fr: "Prescience", en: "Foresight", level: 9, school: "Divination", classes: ["Barde", "Druide", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "gate", fr: "Portail", en: "Gate", level: 9, school: "Invocation", classes: ["Clerc", "Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "imprisonment", fr: "Emprisonnement", en: "Imprisonment", level: 9, school: "Abjuration", classes: ["Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "mass-heal", fr: "Guerison de groupe", en: "Mass Heal", level: 9, school: "Evocation", classes: ["Clerc"], source: "SRD 5.1" },
  { id: "meteor-swarm", fr: "Nuage de meteores", en: "Meteor Swarm", level: 9, school: "Evocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "power-word-kill", fr: "Mot de pouvoir mortel", en: "Power Word Kill", level: 9, school: "Enchantement", classes: ["Barde", "Ensorceleur", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "prismatic-wall", fr: "Mur prismatique", en: "Prismatic Wall", level: 9, school: "Abjuration", classes: ["Magicien"], source: "SRD 5.1" },
  { id: "shapechange", fr: "Changement de forme", en: "Shapechange", level: 9, school: "Transmutation", classes: ["Druide", "Magicien"], source: "SRD 5.1" },
  { id: "time-stop", fr: "Arret du temps", en: "Time Stop", level: 9, school: "Transmutation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
  { id: "true-polymorph", fr: "Metamorphose supreme", en: "True Polymorph", level: 9, school: "Transmutation", classes: ["Barde", "Magicien", "Occultiste"], source: "SRD 5.1" },
  { id: "true-resurrection", fr: "Resurrection supreme", en: "True Resurrection", level: 9, school: "Necromancie", classes: ["Clerc", "Druide"], source: "SRD 5.1" },
  { id: "wish", fr: "Souhait", en: "Wish", level: 9, school: "Invocation", classes: ["Ensorceleur", "Magicien"], source: "SRD 5.1" },
];

SPELL_LIBRARY.forEach((spell) => {
  const details = SPELL_DETAILS[spell.id] || {};
  spell.damageType = spell.damageType || inferSpellDamageType(spell);
  spell.description = spell.description || details.description || buildSpellDescription(spell);
  spell.damage = spell.damage || details.damage || "";
});

const defaultState = () => ({
  activeTab: "sheet",
  character: {
    name: "Aelis Marque-Songe",
    ancestry: "Tieffeline",
    class: "Roublard",
    level: 3,
    background: "Enfant des rues",
    alignment: "Chaotique bon",
    stats: { str: 10, dex: 16, con: 14, int: 12, wis: 10, cha: 14 },
    ac: 15,
    hp: 22,
    hpMax: 22,
    proficiency: 2,
    speed: 9,
    initiativeBonus: 3,
    lastSession:
      "La piste traverse les anciennes citernes. Le symbole de la porte ressemble a un d20 fendu par une etoile.",
  },
  diceMode: "normal",
  rollModifier: 0,
  rolls: [],
  encounter: {
    activeTurn: 0,
    combatants: [
      { id: makeId(), name: "Aelis", initiative: 17, hp: 22 },
      { id: makeId(), name: "Sentinelle d'os", initiative: 13, hp: 18 },
      { id: makeId(), name: "Meneur gobelin", initiative: 9, hp: 11 },
    ],
    creatures: [
      {
        id: makeId(),
        name: "Sentinelle d'os",
        hp: 18,
        weaknesses: ["bludgeoning", "radiant"],
        note: "Semble moins stable apres les coups contondants.",
      },
    ],
    weapons: [
      { id: makeId(), name: "Rapiere", damage: "1d8 + DEX", damageType: "piercing", note: "Finesse" },
      { id: makeId(), name: "Arc court", damage: "1d6 + DEX", damageType: "piercing", note: "Distance 24/96 m" },
    ],
    injuries: Object.fromEntries(INJURY_PARTS.map((part) => [part.id, false])),
    slots: Object.fromEntries(Array.from({ length: 9 }, (_, index) => [index + 1, { used: 0, max: index < 2 ? 2 : 0 }])),
  },
  journal: {
    quest: "Retrouver la clef du sanctuaire de Lune-Basse",
    quests: [{ id: makeId(), title: "Retrouver la clef du sanctuaire de Lune-Basse", status: "en-cours" }],
    notes: "Le groupe a trouve un autel grave d'une etoile brisee.",
    feelings: "Aelis se mefie de la guilde des Lanternes, mais veut encore croire qu'ils peuvent aider.",
    rareItems: "Dague +1\nPotion de soins",
    valuables: "Dette envers la guilde des Lanternes.",
    coins: { pp: 0, gp: 42, ep: 3, sp: 18, cp: 55 },
  },
  grimoire: {
    knownSpellIds: ["minor-illusion", "mage-hand", "shield", "misty-step"],
    homebrewSpells: [],
  },
});

let state = loadState();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const statIds = ["str", "dex", "con", "int", "wis", "cha"];

const fields = {
  name: $("#character-name"),
  ancestry: $("#character-ancestry"),
  class: $("#character-class"),
  level: $("#character-level"),
  background: $("#character-background"),
  alignment: $("#character-alignment"),
  ac: $("#armor-class"),
  hp: $("#hit-points"),
  hpMax: $("#hit-points-max"),
  proficiency: $("#proficiency"),
  speed: $("#speed"),
  initiativeBonus: $("#initiative-bonus"),
  lastSession: $("#last-session-summary"),
  modifier: $("#roll-modifier"),
  quest: $("#quest-title"),
  questStatus: $("#quest-status"),
  weaponLibrary: $("#weapon-library-select"),
  weaponDamageType: $("#weapon-damage-type"),
  spellDamageFilter: $("#spell-damage-filter"),
  notes: $("#session-notes"),
  feelings: $("#character-feelings"),
  rareItems: $("#rare-items"),
  valuables: $("#valuables"),
  search: $("#spell-search"),
  levelFilter: $("#spell-level-filter"),
  classFilter: $("#spell-class-filter"),
};

function loadState() {
  const base = getCharacterDefaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeyForCharacter(activeCharacterId)));
    if (saved) return mergeState(base, saved);

    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    if (legacy) return mergeLegacy(base, legacy);
  } catch {
    return base;
  }
  return base;
}

function mergeState(base, saved) {
  const encounter = saved.encounter || {};
  const journal = saved.journal || {};
  const character = saved.character || {};
  return {
    ...base,
    ...saved,
    character: {
      ...base.character,
      ...character,
      stats: { ...base.character.stats, ...character.stats },
    },
    encounter: {
      ...base.encounter,
      ...encounter,
      combatants: Array.isArray(encounter.combatants) ? encounter.combatants : base.encounter.combatants,
      creatures: Array.isArray(encounter.creatures) ? encounter.creatures : base.encounter.creatures,
      weapons: Array.isArray(encounter.weapons) ? encounter.weapons : base.encounter.weapons,
      injuries: { ...base.encounter.injuries, ...encounter.injuries },
      slots: { ...base.encounter.slots, ...encounter.slots },
    },
    journal: {
      ...base.journal,
      ...journal,
      coins: { ...base.journal.coins, ...journal.coins },
      quests: Array.isArray(journal.quests) ? journal.quests : base.journal.quests,
    },
    grimoire: {
      ...base.grimoire,
      ...saved.grimoire,
      knownSpellIds: Array.isArray(saved.grimoire?.knownSpellIds)
        ? saved.grimoire.knownSpellIds
        : base.grimoire.knownSpellIds,
      homebrewSpells: Array.isArray(saved.grimoire?.homebrewSpells)
        ? saved.grimoire.homebrewSpells
        : base.grimoire.homebrewSpells,
    },
    rolls: Array.isArray(saved.rolls) ? saved.rolls.slice(0, 8) : base.rolls,
  };
}

function mergeLegacy(base, legacy) {
  const merged = mergeState(base, {
    character: {
      ...legacy.character,
      lastSession: legacy.journal?.notes || base.character.lastSession,
    },
    diceMode: legacy.diceMode,
    rollModifier: legacy.rollModifier,
    rolls: legacy.rolls,
    encounter: {
      ...base.encounter,
      combatants: legacy.combatants || base.encounter.combatants,
      activeTurn: legacy.activeTurn || 0,
    },
    journal: {
      ...base.journal,
      quest: legacy.journal?.quest || base.journal.quest,
      notes: legacy.journal?.notes || base.journal.notes,
      rareItems: legacy.journal?.spellbook || base.journal.rareItems,
    },
  });
  saveState(merged);
  return merged;
}

function saveState(nextState = state) {
  localStorage.setItem(storageKeyForCharacter(activeCharacterId), JSON.stringify(nextState));
  localStorage.setItem(ACTIVE_CHARACTER_KEY, activeCharacterId);
}

function switchCharacter(characterId) {
  if (!PLAYABLE_CHARACTERS.some((character) => character.id === characterId)) return;
  saveState();
  activeCharacterId = characterId;
  localStorage.setItem(ACTIVE_CHARACTER_KEY, activeCharacterId);
  state = loadState();
  renderAll();
}



function normalizeCharacterPayload(payload, fallbackId) {
  const importedState = payload?.state || payload;
  const characterName =
    payload?.characterName || importedState?.character?.name || fallbackId || "Personnage";
  return { importedState, characterName };
}

function upsertPlayableCharacter(character) {
  if (!character?.id) return;
  const existingIndex = PLAYABLE_CHARACTERS.findIndex((item) => item.id === character.id);
  if (existingIndex >= 0) {
    PLAYABLE_CHARACTERS[existingIndex] = {
      ...PLAYABLE_CHARACTERS[existingIndex],
      ...character,
      name: character.name || PLAYABLE_CHARACTERS[existingIndex].name,
    };
  } else {
    PLAYABLE_CHARACTERS.push({ id: character.id, name: character.name || character.id });
  }
}

async function loadDefaultCharactersFromProject() {
  let manifest;
  try {
    const response = await fetch(DEFAULT_CHARACTERS_MANIFEST_PATH, { cache: "no-store" });
    if (!response.ok) return false;
    manifest = await response.json();
  } catch {
    return false;
  }

  const entries = Array.isArray(manifest) ? manifest : manifest.characters || [];
  let changed = false;

  for (const entry of entries) {
    if (!entry?.id) continue;
    upsertPlayableCharacter({ id: entry.id, name: entry.name });
    changed = true;

    if (!entry.file) continue;

    try {
      const response = await fetch(`personnages/${entry.file}`, { cache: "no-store" });
      if (!response.ok) continue;
      const payload = await response.json();
      const { importedState, characterName } = normalizeCharacterPayload(payload, entry.id);
      upsertPlayableCharacter({ id: entry.id, name: entry.name || characterName });

      // Le JSON du projet sert de configuration par defaut.
      // Il est applique seulement si ce personnage n'a pas deja une sauvegarde locale.
      if (!hasSavedCharacter(entry.id)) {
        const defaultState = mergeState(getCharacterDefaultState(entry.id), importedState);
        localStorage.setItem(storageKeyForCharacter(entry.id), JSON.stringify(defaultState));
      }
    } catch (error) {
      console.error("Personnage par defaut non charge:", entry.file, error);
    }
  }

  if (!PLAYABLE_CHARACTERS.some((character) => character.id === activeCharacterId)) {
    activeCharacterId = PLAYABLE_CHARACTERS[0].id;
    localStorage.setItem(ACTIVE_CHARACTER_KEY, activeCharacterId);
  }

  return changed;
}

function safeFileName(value) {
  return String(value || "personnage")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "personnage";
}

function exportCharacterJson() {
  saveState();
  const payload = {
    app: "Fauche Lumiere - Compagnon DND",
    version: 1,
    characterId: activeCharacterId,
    characterName: state.character.name,
    exportedAt: new Date().toISOString(),
    state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${safeFileName(state.character.name)}-serment.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function importCharacterJsonFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(String(reader.result || "{}"));
      const importedState = payload.state || payload;
      const importedCharacterId = PLAYABLE_CHARACTERS.some(
        (character) => character.id === payload.characterId,
      )
        ? payload.characterId
        : activeCharacterId;

      activeCharacterId = importedCharacterId;
      localStorage.setItem(ACTIVE_CHARACTER_KEY, activeCharacterId);
      state = mergeState(getCharacterDefaultState(activeCharacterId), importedState);
      saveState();
      renderAll();

      $("#roll-output").innerHTML = `
        <span class="roll-total">OK</span>
        <span class="roll-detail">Personnage importe depuis ${file.name}.</span>
      `;
    } catch {
      $("#roll-output").innerHTML = `
        <span class="roll-total">!</span>
        <span class="roll-detail">Import impossible: le fichier JSON n'est pas valide.</span>
      `;
    }
  });
  reader.readAsText(file);
}

function signed(value) {
  return value >= 0 ? `+${value}` : String(value);
}

function abilityModifier(score) {
  return Math.floor((Number(score) - 10) / 2);
}

function readNumber(input, fallback = 0) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function spellLevelLabel(level) {
  return Number(level) === 0 ? "Tour de magie" : `Niveau ${level}`;
}

function getAllSpells() {
  return [...SPELL_LIBRARY, ...state.grimoire.homebrewSpells];
}

function getSpellById(id) {
  return getAllSpells().find((spell) => spell.id === id);
}

function renderCharacterSelect() {
  const select = $("#character-select");
  if (!select) return;
  select.innerHTML = PLAYABLE_CHARACTERS
    .map(
      (character) =>
        `<option value="${character.id}" ${character.id === activeCharacterId ? "selected" : ""}>${character.name}</option>`,
    )
    .join("");
}

function renderTabs() {
  $$(".nav-link").forEach((button) => {
    const active = button.dataset.tab === state.activeTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  $$(".tab-panel").forEach((panel) => {
    const active = panel.dataset.panel === state.activeTab;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
}

function renderCharacter() {
  fields.name.value = state.character.name;
  fields.ancestry.value = state.character.ancestry;
  fields.class.value = state.character.class;
  fields.level.value = state.character.level;
  fields.background.value = state.character.background;
  fields.alignment.value = state.character.alignment;
  fields.ac.value = state.character.ac;
  fields.hp.value = state.character.hp;
  fields.hpMax.value = state.character.hpMax;
  fields.proficiency.value = state.character.proficiency;
  fields.speed.value = state.character.speed;
  fields.initiativeBonus.value = state.character.initiativeBonus;
  fields.lastSession.value = state.character.lastSession;
  fields.modifier.value = state.rollModifier;

  statIds.forEach((id) => {
    $(`#stat-${id}`).value = state.character.stats[id];
    $(`#mod-${id}`).textContent = signed(abilityModifier(state.character.stats[id]));
  });

  $("#summary-ac").textContent = state.character.ac;
  $("#summary-hp").textContent = state.character.hp;
  $("#summary-hp-max").textContent = state.character.hpMax;
}

function renderDiceMode() {
  $$(".segmented button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.diceMode);
  });
}

function renderRolls() {
  const history = $("#roll-history");
  history.innerHTML = "";
  state.rolls.forEach((roll) => {
    const item = document.createElement("li");
    item.textContent = roll;
    history.append(item);
  });
}

function renderCombatants() {
  const list = $("#turn-order");
  list.innerHTML = "";
  const ordered = [...state.encounter.combatants].sort((a, b) => b.initiative - a.initiative);
  if (state.encounter.activeTurn >= ordered.length) state.encounter.activeTurn = 0;

  ordered.forEach((combatant, index) => {
    const row = document.createElement("article");
    row.className = "turn-row";
    row.classList.toggle("active", index === state.encounter.activeTurn);
    row.setAttribute("role", "listitem");
    row.innerHTML = `
      <span class="turn-index">${index + 1}</span>
      <span class="turn-name"></span>
      <span class="turn-meta">Init. ${combatant.initiative}</span>
      <span class="turn-meta">${combatant.hp} PV</span>
    `;
    row.querySelector(".turn-name").textContent = combatant.name;

    const remove = document.createElement("button");
    remove.className = "remove-combatant";
    remove.type = "button";
    remove.title = `Retirer ${combatant.name}`;
    remove.setAttribute("aria-label", `Retirer ${combatant.name}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => removeCombatant(combatant.id));
    row.append(remove);
    list.append(row);
  });
}

function renderWeaknessOptions() {
  const options = $("#weakness-options");
  options.innerHTML = "";
  DAMAGE_TYPES.forEach((type) => {
    const label = document.createElement("label");
    label.className = "weakness-option";
    label.innerHTML = `
      <input type="checkbox" value="${type.id}" />
      <span class="weakness-chip">
        <span class="weakness-icon">${type.icon}</span>
        <span>${type.label}</span>
      </span>
    `;
    options.append(label);
  });
}

function weaknessBadge(typeId) {
  const type = DAMAGE_TYPES.find((entry) => entry.id === typeId);
  if (!type) return "";
  return `
    <span class="weakness-badge" title="${type.label}">
      <span class="weakness-icon">${type.icon}</span>
      <span>${type.label}</span>
    </span>
  `;
}

function renderCreatures() {
  const list = $("#creature-list");
  list.innerHTML = "";
  if (!state.encounter.creatures.length) {
    list.innerHTML = `<p class="empty-state">Aucune creature suivie.</p>`;
    return;
  }

  state.encounter.creatures.forEach((creature) => {
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <div class="card-header">
        <div>
          <p class="card-title"></p>
          <p class="card-meta">Creature suivie</p>
        </div>
      </div>
      <div class="weakness-row">${creature.weaknesses.map(weaknessBadge).join("")}</div>
      <div class="inline-edit">
        <label>PV <input type="number" min="0" value="${creature.hp}" data-creature-hp="${creature.id}" /></label>
        <label>Annotation <textarea rows="2" data-creature-note="${creature.id}"></textarea></label>
      </div>
      <div class="card-actions"></div>
    `;
    card.querySelector(".card-title").textContent = creature.name;
    card.querySelector(`[data-creature-note="${creature.id}"]`).value = creature.note || "";
    card.querySelector(`[data-creature-hp="${creature.id}"]`).addEventListener("input", (event) => {
      creature.hp = readNumber(event.target, 0);
      saveState();
    });
    card.querySelector(`[data-creature-note="${creature.id}"]`).addEventListener("input", (event) => {
      creature.note = event.target.value;
      saveState();
    });

    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.type = "button";
    remove.title = `Retirer ${creature.name}`;
    remove.setAttribute("aria-label", `Retirer ${creature.name}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => removeCreature(creature.id));
    card.querySelector(".card-actions").append(remove);
    list.append(card);
  });
}

function renderWeapons() {
  const select = fields.weaponLibrary;
  if (select) {
    select.innerHTML = WEAPON_LIBRARY.map((weapon) => {
      const meta = `${weapon.damage} ${damageTypeLabel(weapon.damageType)} - ${weapon.note}`;
      return `<option value="${weapon.id}">${weapon.name} (${meta})</option>`;
    }).join("");
  }

  const list = $("#weapon-list");
  list.innerHTML = "";
  if (!state.encounter.weapons.length) {
    list.innerHTML = `<p class="empty-state">Aucune arme ajoutee.</p>`;
    return;
  }

  state.encounter.weapons.forEach((weapon) => {
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("role", "listitem");
    const type = damageTypeLabel(weapon.damageType);
    card.innerHTML = `
      <div class="card-header">
        <div>
          <p class="card-title"></p>
          <p class="card-meta"></p>
        </div>
        <button class="remove-button" type="button" title="Retirer" aria-label="Retirer">×</button>
      </div>
    `;
    card.querySelector(".card-title").textContent = weapon.name;
    card.querySelector(".card-meta").textContent = `${weapon.damage || "Degats a definir"} · ${type}${weapon.note ? ` · ${weapon.note}` : ""}`;
    card.querySelector("button").addEventListener("click", () => removeWeapon(weapon.id));
    list.append(card);
  });
}

function renderBodyInjuries() {
  const injuries = state.encounter.injuries || {};
  const controls = $("#injury-controls");
  if (!controls) return;
  controls.innerHTML = "";
  INJURY_PARTS.forEach((part) => {
    const active = Boolean(injuries[part.id]);
    const svgPart = document.querySelector(`[data-body-part="${part.id}"]`);
    svgPart?.classList.toggle("injured", active);

    const label = document.createElement("label");
    label.className = "injury-check";
    label.innerHTML = `<input type="checkbox" data-injury-part="${part.id}" ${active ? "checked" : ""} /> <span>${part.label}</span>`;
    controls.append(label);
  });
}

function renderSpellSlots() {
  const slots = $("#spell-slots");
  slots.innerHTML = "";
  Object.entries(state.encounter.slots).forEach(([level, value]) => {
    const row = document.createElement("label");
    row.className = "slot-row";
    row.innerHTML = `
      <span>Niveau ${level}</span>
      <div class="slot-inputs">
        <input type="number" min="0" value="${value.used}" aria-label="Emplacements utilises niveau ${level}" data-slot-level="${level}" data-slot-kind="used" />
        <b>/</b>
        <input type="number" min="0" value="${value.max}" aria-label="Emplacements maximum niveau ${level}" data-slot-level="${level}" data-slot-kind="max" />
      </div>
    `;
    slots.append(row);
  });
}

function renderCombatSpells() {
  const list = $("#combat-spell-list");
  list.innerHTML = "";
  const spells = state.grimoire.knownSpellIds
    .map(getSpellById)
    .filter(Boolean)
    .sort((a, b) => a.level - b.level || a.fr.localeCompare(b.fr));

  $("#summary-spells").textContent = spells.length;
  $("#known-count").textContent = `${spells.length} connus`;

  if (!spells.length) {
    list.innerHTML = `<p class="empty-state">Aucun sort maitrise.</p>`;
    return;
  }

  spells.forEach((spell) => {
    const card = document.createElement("article");
    card.className = "spell-card";
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <div class="spell-title">
        <strong></strong>
        <small>${spellLevelLabel(spell.level)} · ${spell.school} · ${spell.source}</small>
      </div>
      <p class="spell-note">Degats: ${escapeHTML(getSpellDamageText(spell))}</p>
      <p class="spell-note">${escapeHTML(getSpellDescription(spell))}</p>
    `;
    card.querySelector("strong").textContent = `${spell.fr} (${spell.en})`;
    list.append(card);
  });
}

function renderJournal() {
  fields.quest.value = "";
  if (fields.questStatus) fields.questStatus.value = "en-cours";
  fields.notes.value = state.journal.notes;
  fields.feelings.value = state.journal.feelings;
  fields.rareItems.value = state.journal.rareItems;
  fields.valuables.value = state.journal.valuables;
  Object.entries(state.journal.coins).forEach(([coin, value]) => {
    $(`#coin-${coin}`).value = value;
  });
  renderQuests();
}

function renderQuests() {
  const list = $("#quest-list");
  if (!list) return;
  const quests = state.journal.quests || [];
  list.innerHTML = "";
  if (!quests.length) {
    list.innerHTML = `<p class="empty-state">Aucune quete suivie.</p>`;
    return;
  }
  quests.forEach((quest) => {
    const card = document.createElement("article");
    card.className = "card quest-card";
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <div class="card-header">
        <div>
          <p class="card-title"></p>
          <p class="card-meta"></p>
        </div>
        <button class="remove-button" type="button" title="Retirer" aria-label="Retirer">×</button>
      </div>
      <label>Statut
        <select data-quest-status="${quest.id}">
          ${Object.entries(QUEST_STATUSES).map(([value, label]) => `<option value="${value}" ${quest.status === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
      <label>Notes de quete
        <textarea rows="4" data-quest-note="${quest.id}" placeholder="Indices, PNJ, lieu, suite a faire..."></textarea>
      </label>
    `;
    card.querySelector(".card-title").textContent = quest.title;
    card.querySelector(".card-meta").textContent = QUEST_STATUSES[quest.status] || quest.status;
    card.querySelector("button").addEventListener("click", () => removeQuest(quest.id));
    card.querySelector("select").addEventListener("change", (event) => updateQuestStatus(quest.id, event.target.value));
    const noteInput = card.querySelector(`[data-quest-note="${quest.id}"]`);
    noteInput.value = quest.note || "";
    noteInput.addEventListener("input", (event) => updateQuestNote(quest.id, event.target.value));
    list.append(card);
  });
}

function renderSpellLibrary() {
  const library = $("#spell-library");
  if (!library) return;
  library.innerHTML = "";

  const query = (fields.search?.value || "").trim().toLowerCase();
  const levelFilter = fields.levelFilter?.value || "all";
  const classFilter = fields.classFilter?.value || "all";
  const damageFilter = fields.spellDamageFilter?.value || "all";

  const allSpells = getAllSpells().map((spell) => ({
    ...spell,
    level: Number.isFinite(Number(spell.level)) ? Number(spell.level) : 0,
    classes: Array.isArray(spell.classes) ? spell.classes : ["Homebrew"],
    damageType: spell.damageType || inferSpellDamageType(spell),
  }));

  let spells = allSpells
    .filter((spell) => {
      const haystack = `${spell.fr || ""} ${spell.en || ""}`.toLowerCase();
      const matchesName = !query || haystack.includes(query);
      const matchesLevel = levelFilter === "all" || String(spell.level) === levelFilter;
      const matchesClass = classFilter === "all" || spell.classes.includes(classFilter);
      const matchesDamage = damageFilter === "all" || (spell.damageType || "none") === damageFilter;
      return matchesName && matchesLevel && matchesClass && matchesDamage;
    })
    .sort((a, b) => a.level - b.level || String(a.fr).localeCompare(String(b.fr)));

  if (!spells.length && allSpells.length) {
    const notice = document.createElement("p");
    notice.className = "empty-state";
    notice.textContent = "Aucun sort ne correspond aux filtres. Affichage de toute la bibliotheque.";
    library.append(notice);
    spells = allSpells.sort((a, b) => a.level - b.level || String(a.fr).localeCompare(String(b.fr)));
  }

  if (!spells.length) {
    library.innerHTML = `<p class="empty-state">Bibliotheque de sorts indisponible.</p>`;
    return;
  }

  const known = new Set(state.grimoire?.knownSpellIds || []);
  spells.forEach((spell) => {
    const card = document.createElement("article");
    card.className = "spell-card";
    const damageText = getSpellDamageText(spell);
    const descriptionText = getSpellDescription(spell);
    card.innerHTML = `
      <label>
        <input type="checkbox" data-spell-id="${spell.id}" ${known.has(spell.id) ? "checked" : ""} />
        <span class="spell-title">
          <strong></strong>
          <small>Niveau: ${spellLevelLabel(spell.level)} · Ecole: ${spell.school || "-"}</small>
          <small>Classes: ${spell.classes.join(", ")}</small>
          <small>Degats / type: ${escapeHTML(damageText)} · Source: ${escapeHTML(spell.source || "Homebrew")}</small>
          <small>Description: ${escapeHTML(descriptionText)}</small>
        </span>
      </label>
    `;
    card.querySelector("strong").textContent = `${spell.fr || "Sort"}${spell.en ? ` (${spell.en})` : ""}`;
    card.querySelector("input").addEventListener("change", (event) => {
      toggleKnownSpell(spell.id, event.target.checked);
    });
    library.append(card);
  });
}

function renderAll() {
  renderCharacterSelect();
  renderTabs();
  renderCharacter();
  renderDiceMode();
  renderRolls();
  renderCombatants();
  renderWeaknessOptions();
  renderCreatures();
  renderWeapons();
  renderBodyInjuries();
  renderSpellSlots();
  renderCombatSpells();
  renderJournal();
  renderSpellLibrary();
}

function updateCharacterFromInputs() {
  state.character = {
    ...state.character,
    name: fields.name.value,
    ancestry: fields.ancestry.value,
    class: fields.class.value,
    level: readNumber(fields.level, 1),
    background: fields.background.value,
    alignment: fields.alignment.value,
    ac: readNumber(fields.ac, 10),
    hp: readNumber(fields.hp, 0),
    hpMax: readNumber(fields.hpMax, 1),
    proficiency: readNumber(fields.proficiency, 2),
    speed: readNumber(fields.speed, 0),
    initiativeBonus: readNumber(fields.initiativeBonus, 0),
    lastSession: fields.lastSession.value,
    stats: Object.fromEntries(statIds.map((id) => [id, readNumber($(`#stat-${id}`), 10)])),
  };
  saveState();
  renderCharacter();
}

function updateJournalFromInputs() {
  state.journal = {
    ...state.journal,
    quest: (state.journal.quests || []).find((quest) => quest.status === "en-cours")?.title || "",
    quests: state.journal.quests || [],
    notes: fields.notes.value,
    feelings: fields.feelings.value,
    rareItems: fields.rareItems.value,
    valuables: fields.valuables.value,
    coins: Object.fromEntries(["pp", "gp", "ep", "sp", "cp"].map((coin) => [coin, readNumber($(`#coin-${coin}`), 0)])),
  };
  saveState();
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function performRoll(sides, label = `d${sides}`) {
  const modifier = readNumber(fields.modifier, 0);
  state.rollModifier = modifier;
  const first = rollDie(sides);
  let kept = first;
  let detail = `${label}: ${first}`;

  if (sides === 20 && state.diceMode !== "normal") {
    const second = rollDie(sides);
    kept = state.diceMode === "advantage" ? Math.max(first, second) : Math.min(first, second);
    detail = `${label}: ${first} / ${second}, garde ${kept}`;
  }

  const total = kept + modifier;
  const modifierText = modifier ? ` ${signed(modifier)}` : "";
  const line = `${detail}${modifierText} = ${total}`;
  $("#roll-output").innerHTML = `
    <span class="roll-total">${total}</span>
    <span class="roll-detail">${line}</span>
  `;
  state.rolls = [line, ...state.rolls].slice(0, 8);
  saveState();
  renderRolls();
}

function addCombatant(event) {
  event.preventDefault();
  const nameInput = $("#combatant-name");
  const initiativeInput = $("#combatant-init");
  const hpInput = $("#combatant-hp");
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  state.encounter.combatants.push({
    id: makeId(),
    name,
    initiative: readNumber(initiativeInput, 0),
    hp: readNumber(hpInput, 0),
  });
  nameInput.value = "";
  initiativeInput.value = "";
  hpInput.value = "";
  state.encounter.activeTurn = 0;
  saveState();
  renderCombatants();
}

function removeCombatant(id) {
  state.encounter.combatants = state.encounter.combatants.filter((combatant) => combatant.id !== id);
  saveState();
  renderCombatants();
}

function nextTurn() {
  if (!state.encounter.combatants.length) return;
  state.encounter.activeTurn = (state.encounter.activeTurn + 1) % state.encounter.combatants.length;
  saveState();
  renderCombatants();
}

function addCreature(event) {
  event.preventDefault();
  const nameInput = $("#creature-name");
  const hpInput = $("#creature-hp");
  const noteInput = $("#creature-note");
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  state.encounter.creatures.push({
    id: makeId(),
    name,
    hp: readNumber(hpInput, 0),
    weaknesses: $$("#weakness-options input:checked").map((input) => input.value),
    note: noteInput.value,
  });

  nameInput.value = "";
  hpInput.value = "";
  noteInput.value = "";
  $$("#weakness-options input").forEach((input) => {
    input.checked = false;
  });
  saveState();
  renderCreatures();
}

function removeCreature(id) {
  state.encounter.creatures = state.encounter.creatures.filter((creature) => creature.id !== id);
  saveState();
  renderCreatures();
}

function addWeapon(event) {
  event.preventDefault();
  const nameInput = $("#weapon-name");
  const damageInput = $("#weapon-damage");
  const noteInput = $("#weapon-note");
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }
  state.encounter.weapons.push({
    id: makeId(),
    name,
    damage: damageInput.value.trim() || "Degats a definir",
    damageType: fields.weaponDamageType?.value || "none",
    note: noteInput.value.trim(),
  });
  nameInput.value = "";
  damageInput.value = "";
  noteInput.value = "";
  if (fields.weaponDamageType) fields.weaponDamageType.value = "";
  saveState();
  renderWeapons();
}

function addLibraryWeapon() {
  const weapon = WEAPON_LIBRARY.find((entry) => entry.id === fields.weaponLibrary?.value);
  if (!weapon) return;
  state.encounter.weapons.push({ id: makeId(), ...weapon });
  saveState();
  renderWeapons();
}

function removeWeapon(id) {
  state.encounter.weapons = state.encounter.weapons.filter((weapon) => weapon.id !== id);
  saveState();
  renderWeapons();
}

function toggleKnownSpell(id, checked) {
  const known = new Set(state.grimoire.knownSpellIds);
  if (checked) known.add(id);
  else known.delete(id);
  state.grimoire.knownSpellIds = [...known];
  saveState();
  renderCombatSpells();
  renderSpellLibrary();
}

function addQuest(event) {
  event.preventDefault();
  const title = fields.quest.value.trim();
  if (!title) {
    fields.quest.focus();
    return;
  }
  state.journal.quests = [
    ...(state.journal.quests || []),
    { id: makeId(), title, status: fields.questStatus?.value || "en-cours" },
  ];
  state.journal.quest = state.journal.quests.find((quest) => quest.status === "en-cours")?.title || title;
  fields.quest.value = "";
  saveState();
  renderQuests();
}

function updateQuestStatus(id, status) {
  const quest = state.journal.quests?.find((entry) => entry.id === id);
  if (!quest) return;
  quest.status = status;
  state.journal.quest = state.journal.quests.find((entry) => entry.status === "en-cours")?.title || "";
  saveState();
  renderQuests();
}

function removeQuest(id) {
  state.journal.quests = (state.journal.quests || []).filter((quest) => quest.id !== id);
  state.journal.quest = state.journal.quests.find((quest) => quest.status === "en-cours")?.title || "";
  saveState();
  renderQuests();
}

function updateInjury(event) {
  const part = event.target.dataset.injuryPart;
  if (!part) return;
  state.encounter.injuries = { ...(state.encounter.injuries || {}), [part]: event.target.checked };
  saveState();
  renderBodyInjuries();
}

function clearInjuries() {
  state.encounter.injuries = Object.fromEntries(INJURY_PARTS.map((part) => [part.id, false]));
  saveState();
  renderBodyInjuries();
}

function addHomebrewSpell(event) {
  event.preventDefault();
  const nameInput = $("#homebrew-name");
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  const id = `homebrew-${makeId()}`;
  const classes = $("#homebrew-classes").value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  const spell = {
    id,
    fr: name,
    en: "Homebrew",
    level: readNumber($("#homebrew-level"), 0),
    school: $("#homebrew-school").value.trim() || "Homebrew",
    classes: classes.length ? classes : ["Homebrew"],
    source: "Homebrew",
    damage: $("#homebrew-damage").value.trim(),
    damageType: $("#homebrew-damage-type")?.value || "none",
    notes: $("#homebrew-notes").value.trim(),
  };
  state.grimoire.homebrewSpells.push(spell);
  state.grimoire.knownSpellIds = [...new Set([...state.grimoire.knownSpellIds, id])];
  event.target.reset();
  saveState();
  renderCombatSpells();
  renderSpellLibrary();
}

function updateSpellSlot(event) {
  const level = event.target.dataset.slotLevel;
  const kind = event.target.dataset.slotKind;
  if (!level || !kind) return;
  state.encounter.slots[level][kind] = readNumber(event.target, 0);
  saveState();
}

function exportNotes() {
  const spells = state.grimoire.knownSpellIds.map(getSpellById).filter(Boolean);
  const text = [
    `# ${state.character.name}`,
    "",
    `- ${state.character.ancestry} ${state.character.class} niveau ${state.character.level}`,
    `- CA ${state.character.ac}, PV ${state.character.hp}/${state.character.hpMax}, maitrise ${signed(state.character.proficiency)}`,
    "",
    `## Derniere session`,
    state.character.lastSession,
    "",
    "## Quetes",
    (state.journal.quests || []).map((quest) => `- [${QUEST_STATUSES[quest.status] || quest.status}] ${quest.title}`).join("\n"),
    "",
    "## Notes libres",
    state.journal.notes,
    "",
    "## Ressenti",
    state.journal.feelings,
    "",
    "## Tresor",
    `PP ${state.journal.coins.pp} · PO ${state.journal.coins.gp} · PE ${state.journal.coins.ep} · PA ${state.journal.coins.sp} · PC ${state.journal.coins.cp}`,
    state.journal.rareItems,
    state.journal.valuables,
    "",
    "## Sorts maitrises",
    spells.map((spell) => `- ${spell.fr} (${spellLevelLabel(spell.level)})`).join("\n"),
  ].join("\n");

  navigator.clipboard
    .writeText(text)
    .then(() => {
      $("#roll-output").innerHTML = `
        <span class="roll-total">OK</span>
        <span class="roll-detail">Journal copie dans le presse-papiers.</span>
      `;
    })
    .catch(() => {
      $("#roll-output").innerHTML = `
        <span class="roll-total">!</span>
        <span class="roll-detail">Copie impossible depuis ce navigateur.</span>
      `;
    });
}

function bindEvents() {
  $("#character-select")?.addEventListener("change", (event) => {
    switchCharacter(event.target.value);
  });

  $("#export-character-json")?.addEventListener("click", exportCharacterJson);
  $("#import-character-json")?.addEventListener("click", () => {
    $("#import-character-file")?.click();
  });
  $("#import-character-file")?.addEventListener("change", (event) => {
    importCharacterJsonFile(event.target.files?.[0]);
    event.target.value = "";
  });

  $$(".nav-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      saveState();
      renderTabs();
    });
  });

  $$(
    ".identity-form input, .identity-form select, .vitals-form input, .stat-tile input, #last-session-summary",
  ).forEach((input) => {
    input.addEventListener("input", updateCharacterFromInputs);
  });

  $$(".segmented button").forEach((button) => {
    button.addEventListener("click", () => {
      state.diceMode = button.dataset.mode;
      saveState();
      renderDiceMode();
    });
  });

  $$(".roll-tray button").forEach((button) => {
    button.addEventListener("click", () => performRoll(Number(button.dataset.die)));
  });

  fields.modifier.addEventListener("input", () => {
    state.rollModifier = readNumber(fields.modifier, 0);
    saveState();
  });

  $("#roll-attack").addEventListener("click", () => performRoll(20, "Attaque"));
  $("#roll-save").addEventListener("click", () => performRoll(20, "Sauvegarde"));
  $("#initiative-form").addEventListener("submit", addCombatant);
  $("#next-turn").addEventListener("click", nextTurn);
  $("#creature-form").addEventListener("submit", addCreature);
  $("#weapon-form").addEventListener("submit", addWeapon);
  $("#add-library-weapon")?.addEventListener("click", addLibraryWeapon);
  $("#injury-controls")?.addEventListener("change", updateInjury);
  $("#clear-injuries")?.addEventListener("click", clearInjuries);
  $("#quest-form")?.addEventListener("submit", addQuest);
  $("#spell-slots").addEventListener("input", updateSpellSlot);
  $("#homebrew-form").addEventListener("submit", addHomebrewSpell);
  $("#export-notes").addEventListener("click", exportNotes);

  [fields.quest, fields.notes, fields.feelings, fields.rareItems, fields.valuables].forEach((input) => {
    input.addEventListener("input", updateJournalFromInputs);
  });
  ["pp", "gp", "ep", "sp", "cp"].forEach((coin) => {
    $(`#coin-${coin}`).addEventListener("input", updateJournalFromInputs);
  });

  [fields.search, fields.levelFilter, fields.classFilter, fields.spellDamageFilter].filter(Boolean).forEach((input) => {
    input.addEventListener("input", renderSpellLibrary);
  });

  $("#reset-character").addEventListener("click", () => {
    state.character = getCharacterDefaultState(activeCharacterId).character;
    saveState();
    renderCharacter();
  });
}

bindEvents();
renderAll();

loadDefaultCharactersFromProject().then((changed) => {
  if (!changed) return;
  state = loadState();
  renderAll();
});
