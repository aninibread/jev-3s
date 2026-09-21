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
];
