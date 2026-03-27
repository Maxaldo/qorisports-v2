import type { Article, Author, Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat-football",
    name: "Football",
    slug: "football",
    color: "#16A34A",
    description:
      "Actualites sur les competitions, clubs et selections nationales de football.",
  },
  {
    id: "cat-basketball",
    name: "Basketball",
    slug: "basketball",
    color: "#EA580C",
    description:
      "Suivi des championnats, performances des joueurs et projets de professionnalisation.",
  },
  {
    id: "cat-handball",
    name: "Handball",
    slug: "handball",
    color: "#2563EB",
    description:
      "Infos sur les championnats locaux, selections et ambitions continentales du handball.",
  },
  {
    id: "cat-athletisme",
    name: "Athletisme",
    slug: "athletisme",
    color: "#DC2626",
    description:
      "Resultats, meetings et preparation des athletes beninois et africains.",
  },
  {
    id: "cat-autres",
    name: "Autres",
    slug: "autres",
    color: "#7C3AED",
    description:
      "Discipline diverses : volleyball, karaté, sport scolaire, olympisme et plus.",
  },
  {
    id: "cat-parieurs",
    name: "Coin des Parieurs",
    slug: "coin-des-parieurs",
    color: "#CA8A04",
    description:
      "Analyses, tendances et contextes de matchs utiles aux passionnes de pronostics.",
  },
];

export const authors: Author[] = [
  {
    id: "author-redaction",
    name: "La Redaction",
    avatar: "https://picsum.photos/120/120?random=101",
    role: "Redaction",
  },
  {
    id: "author-randis",
    name: "Randis Romerick SOGBOSSI",
    avatar: "https://picsum.photos/120/120?random=102",
    role: "Journaliste sportif",
  },
];

const [football, basketball, handball, athletisme, autres, parieurs] = categories;
const [redaction, randis] = authors;

export const mockArticles: Article[] = [
  {
    id: "art-001",
    title: "CAN 2025 : les Guepards du Benin qualifies en huitiemes sans jouer",
    slug: "can-2025-guepards-benin-qualifies-huitiemes-sans-jouer",
    excerpt:
      "Le Benin poursuit son aventure continentale dans un scenario inattendu. Les resultats des autres groupes ont suffi pour valider le billet des Guepards. Le staff insiste sur la concentration avant le prochain tour.",
    content:
      "<p>La qualification du Benin pour les huitiemes de finale de la CAN 2025 a ete confirmee a l'issue d'une soiree favorable dans les autres poules. Sans disputer de rencontre, les Guepards ont profite d'un enchainement de scores qui leur assure une place parmi les meilleurs troisiemes.</p><p>Au sein du groupe, le ton reste prudent. Le selectionneur et ses adjoints rappellent que le plus difficile commence avec les matchs a elimination directe, ou la maitrise tactique et mentale sera decisive.</p><p>Les supporteurs, eux, saluent la resilience de l'equipe et esperent une prestation solide au tour suivant. A Cotonou comme a Parakou, l'engouement monte deja autour du prochain rendez-vous continental.</p>",
    coverImage: "https://picsum.photos/800/500?random=1",
    category: football,
    author: randis,
    publishedAt: "2026-03-22T09:10:00.000Z",
    readingTime: 6,
    views: 4850,
    featured: true,
    tags: ["CAN 2025", "Guepards", "Benin", "Afrique"],
  },
  {
    id: "art-002",
    title:
      "Karate Youth League 2026 : le Beninois Ihsane Adjanonhoun en or a Fujairah",
    slug: "karate-youth-league-2026-ihsane-adjanonhoun-or-fujairah",
    excerpt:
      "Le jeune karateka beninois a signe une performance de reference aux Emirats arabes unis. Sa medaille d'or confirme la progression de la releve nationale. La federation veut capitaliser sur cette dynamique.",
    content:
      "<p>A Fujairah, Ihsane Adjanonhoun a realise un parcours remarquable jusqu'a la finale, ou il a impose son rythme avec discipline et precision. Sa medaille d'or en Youth League est saluee comme un signal fort pour les arts martiaux beninois.</p><p>Les responsables techniques expliquent que ce resultat est le fruit d'un cycle de preparation plus structure, axe sur le volume de competition et l'accompagnement psychologique des jeunes talents.</p><p>Au retour de la delegation, l'objectif sera de preparer les prochaines echeances africaines en conservant la meme exigence. Cette victoire relance aussi le debat sur les moyens a consacrer aux disciplines dites individuelles.</p>",
    coverImage: "https://picsum.photos/800/500?random=2",
    category: autres,
    author: redaction,
    publishedAt: "2026-03-24T11:40:00.000Z",
    readingTime: 5,
    views: 1230,
    featured: false,
    tags: ["Karate", "Youth League", "Fujairah", "Benin"],
  },
  {
    id: "art-003",
    title:
      "Ligue professionnelle de basketball au Benin : une nouvelle saison sous le sceau du professionnalisme",
    slug: "ligue-professionnelle-basketball-benin-nouvelle-saison-professionnalisme",
    excerpt:
      "La nouvelle saison de basketball demarre avec un calendrier densifie et des standards releves. Les clubs affichent des ambitions plus claires sur le plan sportif et administratif. Les acteurs du secteur misent sur la regularite pour consolider le projet.",
    content:
      "<p>La ligue professionnelle de basketball entre dans une phase de consolidation, avec des exigences renforcees sur l'organisation des matchs, la medicalisation et la communication autour des equipes.</p><p>Du cote des clubs, les recrutements ont ete effectues plus tot afin de stabiliser les effectifs. Plusieurs entraineurs insistent sur la formation des jeunes, consideree comme un levier majeur pour elever le niveau global du championnat.</p><p>Les observateurs attendent une saison plus competitive, notamment dans la course au titre et a la qualification continentale. Les premiers matchs serviront de test pour evaluer la solidite du nouveau cadre mis en place.</p>",
    coverImage: "https://picsum.photos/800/500?random=3",
    category: basketball,
    author: randis,
    publishedAt: "2026-03-20T08:15:00.000Z",
    readingTime: 7,
    views: 3720,
    featured: true,
    tags: ["Basketball", "Ligue pro", "Benin", "Clubs"],
  },
  {
    id: "art-004",
    title:
      "Football moderne : entraineurs et gardiens a l'ecole des exigences internationales a Cotonou",
    slug: "football-moderne-entraineurs-gardiens-exigences-internationales-cotonou",
    excerpt:
      "Un atelier technique de haut niveau a reuni entraineurs et specialistes des gardiens de but a Cotonou. Les modules ont porte sur la lecture du jeu, la preparation mentale et les outils d'analyse video. Le but est d'harmoniser les methodes locales avec les standards internationaux.",
    content:
      "<p>A Cotonou, plusieurs cadres techniques du football beninois ont participe a une session de formation continue animee par des experts de la sous-region. Les echanges ont mis l'accent sur la gestion des temps faibles et la relance sous pression.</p><p>Pour les gardiens, la formation a couvert le placement, les prises de balle aeriennes et la communication defensive. Les formateurs estiment que la progression passera par la repetition et la standardisation des seances.</p><p>La direction technique nationale souhaite reproduire ce type d'initiative dans les departements afin de diffuser les bonnes pratiques et d'accompagner les clubs de base.</p>",
    coverImage: "https://picsum.photos/800/500?random=4",
    category: football,
    author: redaction,
    publishedAt: "2026-03-18T16:05:00.000Z",
    readingTime: 6,
    views: 890,
    featured: false,
    tags: ["Formation", "Football", "Cotonou", "Gardiens"],
  },
  {
    id: "art-005",
    title:
      "Championnat professionnel de volleyball 2025-2026 : favoris solides, debuts contrastes",
    slug: "championnat-professionnel-volleyball-2025-2026-favoris-solides-debuts-contrastes",
    excerpt:
      "Le championnat de volleyball a demarre sur un rythme soutenu avec des leaders deja identifies. Certains favoris ont confirme leur statut, tandis que des equipes promues ont surpris par leur audace. La lutte pour le haut de tableau s'annonce intense.",
    content:
      "<p>La premiere phase du championnat 2025-2026 a offert des affiches engagees, avec une intensite notable dans les duels directs entre pretendants au titre. Les equipes les mieux structurees ont tire profit de leur profondeur de banc.</p><p>Chez les promus, la qualite du service et l'agressivite au contre ont pose des problemes a des formations pourtant experimentees. Les entraineurs appellent toutefois a la prudence, estimant que la regularite fera la difference sur la duree.</p><p>Les prochaines journees seront cruciales pour confirmer les tendances et installer une hierarchie plus nette dans les deux conferences.</p>",
    coverImage: "https://picsum.photos/800/500?random=5",
    category: autres,
    author: randis,
    publishedAt: "2026-03-17T10:25:00.000Z",
    readingTime: 5,
    views: 650,
    featured: false,
    tags: ["Volleyball", "Championnat", "Benin", "Saison 2025-2026"],
  },
  {
    id: "art-006",
    title:
      "Mouvement olympique beninois : le CNOS-BEN adopte ses rapports et trace les priorites de 2026",
    slug: "mouvement-olympique-beninois-cnos-ben-adopte-rapports-priorites-2026",
    excerpt:
      "Le CNOS-BEN a valide ses rapports statutaires lors de son assemblee ordinaire. Les discussions ont aussi defini des axes prioritaires pour l'annee 2026. Gouvernance, formation et accompagnement des federations sont au centre des decisions.",
    content:
      "<p>Reunis en session ordinaire, les delegues du CNOS-BEN ont adopte les rapports moral, financier et d'activites. La rencontre a permis d'evaluer les actions menees sur la derniere olympiade locale.</p><p>Parmi les priorites annoncees figurent le renforcement des capacites des dirigeants sportifs, la structuration des programmes de detection et la recherche de partenariats pour financer les preparations internationales.</p><p>Le comite souhaite egalement mieux coordonner les calendriers federaux afin d'optimiser la participation du Benin aux grandes competitions africaines et mondiales.</p>",
    coverImage: "https://picsum.photos/800/500?random=6",
    category: autres,
    author: redaction,
    publishedAt: "2026-03-16T14:30:00.000Z",
    readingTime: 6,
    views: 420,
    featured: false,
    tags: ["CNOS-BEN", "Olympisme", "Gouvernance", "Sport beninois"],
  },
  {
    id: "art-007",
    title:
      "Mondial 2026 de balle au tambourin : les selections beninoises en stage intensif",
    slug: "mondial-2026-balle-au-tambourin-selections-beninoises-stage-intensif",
    excerpt:
      "Les selections beninoises de balle au tambourin ont entame un stage de preparation en vue du Mondial 2026. Le staff insiste sur le volume de travail et la cohesion tactique. Les joueurs affichent une forte motivation avant la competition.",
    content:
      "<p>Le regroupement a commence avec un programme quotidien axe sur l'endurance, la precision gestuelle et les scenarios de match. L'encadrement technique veut installer des automatismes clairs sur les phases offensives et defensives.</p><p>Les responsables federaux soulignent l'importance de ce stage pour reduire l'ecart avec les nations les plus experimentees de la discipline. Un suivi medical et nutritionnel accompagne egalement la preparation.</p><p>Au sein du groupe, l'objectif est d'aborder le Mondial avec ambition et de representer dignement le sport beninois sur la scene internationale.</p>",
    coverImage: "https://picsum.photos/800/500?random=7",
    category: autres,
    author: randis,
    publishedAt: "2026-03-14T09:00:00.000Z",
    readingTime: 5,
    views: 310,
    featured: false,
    tags: ["Balle au tambourin", "Mondial 2026", "Benin", "Preparation"],
  },
  {
    id: "art-008",
    title:
      "Sport scolaire au Benin : les selections U16 departementales entrent en regroupement national",
    slug: "sport-scolaire-benin-selections-u16-departementales-regroupement-national",
    excerpt:
      "Le ministere des Sports lance un regroupement national des U16 venus de tous les departements. L'objectif est d'identifier les meilleurs profils et de preparer les futures equipes nationales. Les encadreurs saluent une initiative structurante.",
    content:
      "<p>Le regroupement U16 rassemble de jeunes talents detectes lors des phases departementales de sport scolaire. Pendant plusieurs jours, les athletes seront evalues sur leurs qualites techniques, physiques et comportementales.</p><p>Selon les organisateurs, ce dispositif doit renforcer le passage entre l'ecole et les filieres federales. Des ateliers sur l'hygiene de vie et la gestion de la pression completent le programme sportif.</p><p>Les resultats de ce camp serviront de base pour constituer des noyaux competitifs en vue des prochaines echeances sous-regionales.</p>",
    coverImage: "https://picsum.photos/800/500?random=8",
    category: athletisme,
    author: redaction,
    publishedAt: "2026-03-13T12:45:00.000Z",
    readingTime: 5,
    views: 580,
    featured: false,
    tags: ["Sport scolaire", "U16", "Detection", "Jeunes"],
  },
  {
    id: "art-009",
    title: "Scrabble au Benin : Julien Affaton domine le Blitz national 2026",
    slug: "scrabble-benin-julien-affaton-domine-blitz-national-2026",
    excerpt:
      "Le Blitz national 2026 a couronne Julien Affaton apres une finale maitrisee. Le niveau general du tournoi confirme la progression du scrabble beninois. Les organisateurs visent une meilleure visibilite regionale.",
    content:
      "<p>Julien Affaton s'est impose avec regularite tout au long de la competition, enchainant les performances solides face aux principaux favoris. Son sang-froid dans les manches decisives a fait la difference.</p><p>Le tournoi a reuni un plateau dense, avec une presence notable de jeunes joueurs issus des clubs universitaires. Les arbitres ont salue la qualite technique et la discipline observee sur l'ensemble des rondes.</p><p>La federation espere transformer cet elan en participations plus ambitieuses sur le circuit africain francophone dans les prochains mois.</p>",
    coverImage: "https://picsum.photos/800/500?random=9",
    category: autres,
    author: randis,
    publishedAt: "2026-03-12T18:20:00.000Z",
    readingTime: 4,
    views: 275,
    featured: false,
    tags: ["Scrabble", "Blitz", "Julien Affaton", "Benin"],
  },
  {
    id: "art-010",
    title:
      "Jeux olympiques d'hiver 2026 : comment le Benin s'est qualifie avec Nathan Tchibozo",
    slug: "jeux-olympiques-hiver-2026-comment-benin-qualifie-nathan-tchibozo",
    excerpt:
      "La qualification du Benin aux Jeux olympiques d'hiver 2026 marque une etape historique. Nathan Tchibozo a rempli les criteres techniques requis sur le circuit. Ce parcours ouvre de nouvelles perspectives pour les sports d'hiver africains.",
    content:
      "<p>Le dossier de qualification de Nathan Tchibozo a ete valide apres plusieurs competitions homologues, disputees dans des conditions exigeantes. La performance est symbolique pour un pays peu associe aux disciplines hivernales.</p><p>Au-dela du resultat sportif, ce succes traduit un travail de coordination entre encadrement technique, partenaires institutionnels et reseaux de preparation a l'etranger.</p><p>Les responsables du mouvement sportif beninois souhaitent s'appuyer sur cet exemple pour inspirer d'autres projets innovants et renforcer la culture de la performance internationale.</p>",
    coverImage: "https://picsum.photos/800/500?random=10",
    category: autres,
    author: redaction,
    publishedAt: "2026-03-11T07:55:00.000Z",
    readingTime: 6,
    views: 4200,
    featured: true,
    tags: ["JO Hiver 2026", "Nathan Tchibozo", "Benin", "Olympisme"],
  },
  {
    id: "art-011",
    title:
      "Amal VBC de Manigri, la promue qui secoue deja l'elite du volleyball beninois",
    slug: "amal-vbc-manigri-promue-secoue-elite-volleyball-beninois",
    excerpt:
      "Promue cette saison, Amal VBC de Manigri surprend deja les favoris du championnat. Son jeu collectif et sa discipline tactique attirent l'attention des observateurs. Le club veut confirmer sur la duree.",
    content:
      "<p>Amal VBC a enchaine des resultats positifs face a des adversaires plus experimentes, en s'appuyant sur une organisation defensive rigoureuse et des transitions rapides. Cette dynamique place le club parmi les revelations de la saison.</p><p>L'entraineur insiste cependant sur la necessite de rester humble et de bien gerer la charge physique. Le calendrier des prochaines semaines sera un veritable test de maturite.</p><p>Dans la ville de Manigri, cet elan sportif suscite un regain d'interet pour la pratique du volleyball chez les jeunes.</p>",
    coverImage: "https://picsum.photos/800/500?random=11",
    category: autres,
    author: randis,
    publishedAt: "2026-03-10T15:10:00.000Z",
    readingTime: 5,
    views: 390,
    featured: false,
    tags: ["Volleyball", "Amal VBC", "Manigri", "Championnat"],
  },
  {
    id: "art-012",
    title:
      "Conference de presse CNOS BEN : Jeux olympiques d'hiver 2026 et priorites du sport beninois",
    slug: "conference-presse-cnos-ben-jeux-olympiques-hiver-2026-priorites-sport-beninois",
    excerpt:
      "Le CNOS BEN a detaille ses priorites lors d'une conference de presse a Cotonou. Les dirigeants ont evoque les Jeux olympiques d'hiver 2026 et les chantiers structurants du sport national. L'accent est mis sur la gouvernance et l'excellence sportive.",
    content:
      "<p>Face aux medias, les responsables du CNOS BEN ont precise les axes de travail pour 2026 : preparation des athletes, renforcement des competences administratives et attractivite des partenariats.</p><p>Le comite veut aussi mieux accompagner les federations dans la planification annuelle pour eviter les chevauchements de calendriers et optimiser l'exposition des competitions locales.</p><p>La conference a enfin souligne la place croissante de la communication digitale pour rapprocher les institutions sportives du public beninois.</p>",
    coverImage: "https://picsum.photos/800/500?random=12",
    category: parieurs,
    author: redaction,
    publishedAt: "2026-03-09T13:35:00.000Z",
    readingTime: 5,
    views: 185,
    featured: false,
    tags: ["CNOS BEN", "Conference de presse", "Priorites 2026", "Benin"],
  },
  {
    id: "art-013",
    title:
      "D1 beninoise : Dadje FC et Coton FC, duel a distance pour la tete du classement",
    slug: "d1-beninoise-dadje-fc-coton-fc-duel-distance-tete-classement",
    excerpt:
      "La course au leadership en D1 beninoise s'intensifie entre Dadje FC et Coton FC. Les deux formations enchainent les performances solides depuis plusieurs journees. Les confrontations directes seront determinantes dans le sprint final.",
    content:
      "<p>Au fil des semaines, Dadje FC et Coton FC se repondent coup pour coup en tete du championnat. Les statistiques montrent une grande solidite defensive des deux cotes, avec une meilleure efficacite offensive pour Coton FC sur les derniers matchs.</p><p>Les staffs techniques mettent l'accent sur la gestion de la pression et la profondeur de banc, deux facteurs cles dans une fin de saison souvent imprevisible.</p><p>Le public attend des affiches de haut niveau, dans un contexte ou chaque point peut peser lourd pour le titre et les places africaines.</p>",
    coverImage: "https://picsum.photos/800/500?random=13",
    category: football,
    author: randis,
    publishedAt: "2026-03-25T17:05:00.000Z",
    readingTime: 6,
    views: 3150,
    featured: false,
    tags: ["D1 Beninoise", "Dadje FC", "Coton FC", "Championnat"],
  },
  {
    id: "art-014",
    title:
      "Handball beninois : Flowers CNSS et Aspac lancent un bras de fer pour le titre",
    slug: "handball-beninois-flowers-cnss-aspac-bras-de-fer-titre",
    excerpt:
      "Le championnat de handball vit un debut de saison intense entre Flowers CNSS et Aspac. Les deux equipes affichent des ambitions claires et un rythme eleve. Le niveau tactique monte d'un cran dans les salles beninoises.",
    content:
      "<p>Flowers CNSS et Aspac ont imprime un tempo soutenu des premieres journees, avec des prestations marquees par la qualite des transitions et la discipline defensive. Les confrontations directes s'annoncent decisives.</p><p>Les observateurs notent aussi l'emergence de jeunes arrieres capables d'apporter de la percussion dans les moments critiques. Cette releve constitue un signal encourageant pour le handball national.</p><p>Les prochaines semaines permettront de verifier la capacite de chaque effectif a tenir la cadence sur la duree du championnat.</p>",
    coverImage: "https://picsum.photos/800/500?random=14",
    category: handball,
    author: redaction,
    publishedAt: "2026-03-23T10:50:00.000Z",
    readingTime: 5,
    views: 2480,
    featured: false,
    tags: ["Handball", "Flowers CNSS", "Aspac", "Benin"],
  },
];
