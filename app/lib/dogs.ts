export type Dog = {
  id: string;
  name: string;
  description: string;
  image: string;
  sourceUrl: string;
  creator: string;
  license: string;
  licenseUrl: string;
};

export const dogs: Dog[] = [
  {
    id: "husky",
    name: "Siberian husky",
    description: "A medium-sized Siberian husky with an athletic build, long muzzle and tall upright ears.",
    image: "/dogs/husky.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Juvenile_Siberian_Husky.jpg",
    creator: "MrPanyGoff",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  {
    id: "corgi",
    name: "Pembroke corgi",
    description: "A sturdy Pembroke Welsh corgi with a long body, very short legs, broad chest and upright ears.",
    image: "/dogs/corgi.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Welsh_Pembroke_Corgi.jpg",
    creator: "Dog breed facts",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  {
    id: "bulldog",
    name: "English bulldog",
    description: "A broad, stocky English bulldog with short legs, a blunt muzzle, wrinkled face and heavy jowls.",
    image: "/dogs/bulldog.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:English_Bulldog_-Dog-220489-1280.jpg",
    creator: "kaz",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    id: "chihuahua",
    name: "Chihuahua",
    description: "A tiny, fine-boned Chihuahua with a short narrow muzzle, very large upright ears and prominent eyes.",
    image: "/dogs/chihuahua.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Chihuahua_dog_3.jpg",
    creator: "Davidstern",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  {
    id: "dachshund",
    name: "Dachshund",
    description: "A small dachshund with an extremely long low body, very short legs, a narrow muzzle and floppy ears.",
    image: "/dogs/dachshund.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Dachshund_Dog_Breed.jpg",
    creator: "Pdpics",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  {
    id: "golden-retriever",
    name: "Golden retriever",
    description: "A large golden retriever with an athletic frame, substantial legs, a long muzzle and floppy ears.",
    image: "/dogs/golden-retriever.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:A_Golden_Retriever-9_(Barras).JPG",
    creator: "Barras",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
  },
  {
    "id": "pomeranian",
    "name": "Pomeranian",
    "description": "A tiny orange-sable Pomeranian with a fluffy coat, fine legs, upright ears and a small pointed fox-like face.",
    "image": "/dogs/pomeranian.webp",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pomeranian_orange-sable_Coco.jpg",
    "creator": "Rob Hanson",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "id": "dalmatian",
    "name": "Dalmatian",
    "description": "A large athletic Dalmatian with a white coat and black spots, long legs, a deep chest and a long muzzle.",
    "image": "/dogs/dalmatian.webp",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dalmatien.jpg",
    "creator": "Desaix83, based on a photograph by Le dalmatien",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "id": "french-bulldog",
    "name": "French bulldog",
    "description": "A compact cream French bulldog with a broad stocky body, blunt muzzle and large upright bat ears.",
    "image": "/dogs/french-bulldog.webp",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:FrenchBulldog.jpg",
    "creator": "Ccheaton",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:FrenchBulldog.jpg"
  },
  {
    "id": "pug",
    "name": "Pug",
    "description": "A small stocky fawn pug with a barrel-shaped body, short legs, black wrinkled flat face and curled tail.",
    "image": "/dogs/pug.webp",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:2.5-year-old_fawn_male_pug.jpg",
    "creator": "Abuk SABUK",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "id": "poodle",
    "name": "Miniature poodle",
    "description": "A small brown miniature poodle with a curly coat, delicate legs, floppy ears and a narrow muzzle.",
    "image": "/dogs/poodle.webp",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Miniature_Poodle_(Hungary).jpg",
    "creator": "UszkarFoto92",
    "license": "CC0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "id": "italian-greyhound",
    "name": "Italian greyhound",
    "description": "A small fine-boned blue-grey Italian greyhound with a long narrow muzzle, delicate limbs and folded ears.",
    "image": "/dogs/italian-greyhound.webp",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:00000_Charcik_W%C5%82oski_b%C5%82%C4%99kitny.jpg",
    "creator": "Tesori di Carli",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "german-shepherd",
    name: "German shepherd",
    description:
      "A large athletic German shepherd with a substantial frame, long muzzle and tall upright ears.",
    image: "/dogs/german-shepherd.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20110425_German_Shepherd_Dog_8505.jpg",
    creator: "Jakub Hałun",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  {
    id: "samoyed",
    name: "Samoyed",
    description:
      "A medium-large fluffy white Samoyed with a sturdy athletic frame, pointed muzzle and upright ears.",
    image: "/dogs/samoyed.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Samoyed_dog_two_year_old_female_dllu.jpg",
    creator: "Dllu",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  {
    id: "great-dane",
    name: "Great Dane",
    description:
      "A giant tall Great Dane with very long legs, a deep chest, long muzzle and floppy ears.",
    image: "/dogs/great-dane.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great-dane-dog-1365445651zZJ.jpg",
    creator: "Karen Arnold",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    id: "shar-pei",
    name: "Shar-Pei",
    description:
      "A medium stocky Shar-Pei with a broad body, short blunt muzzle, heavy facial wrinkles and small folded ears.",
    image: "/dogs/shar-pei.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chinese_Shar-Pei_Westminster_Dog_Show.jpg",
    creator: "Dave from New York",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  {
    id: "boston-terrier",
    name: "Boston terrier",
    description:
      "A small compact Boston terrier with a broad chest, short blunt muzzle and large upright ears.",
    image: "/dogs/boston-terrier.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Boston_Terrier_DSC_0004_(16399046489).jpg",
    creator: "Pets Adviser",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  },
  {
    id: "basset-hound",
    name: "Basset hound",
    description:
      "A heavy low-slung basset hound with a long body, very short sturdy legs, broad muzzle and long floppy ears.",
    image: "/dogs/basset-hound.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Basset_hound_LM.jpg",
    creator: "Lilly M",
    license: "CC BY-SA 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5",
  },
  {
    id: "papillon",
    name: "Papillon",
    description:
      "A tiny fine-boned Papillon with delicate legs, a narrow muzzle and very large fringed upright ears.",
    image: "/dogs/papillon.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Papillon_2011_agility.jpg",
    creator: "f/orme Pet Photography",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  {
    id: "chinese-crested",
    name: "Chinese crested",
    description:
      "A small fine-boned Chinese crested dog with delicate legs, a narrow muzzle, large upright ears and sparse body hair.",
    image: "/dogs/chinese-crested.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chinese_Crested_Dog_(12482544324).jpg",
    creator: "Pets Adviser",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  },
  {
    id: "whippet",
    name: "Whippet",
    description:
      "A medium lean fine-boned whippet with very long delicate legs, a deep chest and long narrow muzzle.",
    image: "/dogs/whippet.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Whippet_stacked.jpg",
    creator: "Sagaciousphil",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  {
    id: "yorkshire-terrier",
    name: "Yorkshire terrier",
    description:
      "A tiny fine-boned Yorkshire terrier with delicate legs, a small narrow muzzle and upright ears.",
    image: "/dogs/yorkshire-terrier.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Yorkshire_Terrier_portrait.jpg",
    creator: "Jeronimo Palacios",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  },
];
