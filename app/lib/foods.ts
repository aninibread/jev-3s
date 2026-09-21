export type Food = {
  id: string;
  name: string;
  description: string;
  image: string;
  sourceUrl: string;
  creator: string;
  license: string;
  licenseUrl: string;
  attribution: string;
  modifications?: string;
  debatable: boolean;
};

export const foods: Food[] = [
  {
    id: "baozi",
    name: "Baozi",
    description:
      "Steamed white dough buns enclosing a meat or vegetable filling, served together without broth.",
    image: "/foods/baozi.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Baozi_Chengdu.JPG",
    creator: "Popo le Chien",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    attribution: "Baozi — Popo le Chien (CC0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: true,
  },
  {
    id: "biryani",
    name: "Biryani",
    description:
      "Seasoned rice mixed with pieces of meat and herbs, piled on a plate. The small sauce dishes are accompaniments.",
    image: "/foods/biryani.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%22Hyderabadi_Dum_Biryani%22.jpg",
    creator: "Mahi Tatavarty",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    attribution: "Biryani — Mahi Tatavarty (CC BY-SA 4.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "cereal",
    name: "Cereal with milk",
    description: "Oat flakes and granola floating in a bowl of white milk.",
    image: "/foods/cereal.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Granola_flakes_with_milk.jpg",
    creator: "ProjectManhattan",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    attribution: "Breakfast cereal — ProjectManhattan (CC BY-SA 3.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: true,
  },
  {
    id: "burrito",
    name: "Burrito",
    description:
      "A flour tortilla wrapped around rice, vegetables and beans, cut open to show the filling.",
    image: "/foods/burrito.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Burrito.JPG",
    creator: "samuelfernandezrivera",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    attribution: "Burrito — samuelfernandezrivera (CC0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "caesar",
    name: "Caesar salad",
    description:
      "Lettuce leaves tossed with creamy dressing, grated cheese and toasted bread croutons in a bowl.",
    image: "/foods/caesar.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Caesar_salad_(2).jpg",
    creator: "Geoff Peters from Vancouver, BC, Canada",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    attribution:
      "Caesar salad — Geoff Peters from Vancouver, BC, Canada (CC BY 2.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "falafel",
    name: "Falafel",
    description:
      "Fried chickpea patties arranged on a tray, with no bread or serving liquid.",
    image: "/foods/falafel.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Falafels_2.jpg",
    creator: "Popo le Chien",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    attribution: "Falafel — Popo le Chien (CC BY-SA 3.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "gazpacho",
    name: "Gazpacho",
    description:
      "Smooth red tomato and vegetable liquid in a bowl, with chopped vegetables served alongside.",
    image: "/foods/gazpacho.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Gazpacho_Malague%C3%B1o_con_su_%E2%80%9Cpica%C3%ADto%E2%80%9D_-_Moreno,_Playa_Burriana_(cropped).jpg",
    creator: "Haydn Blackey",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    attribution: "Gazpacho — Haydn Blackey (CC BY-SA 2.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "greek-salad",
    name: "Greek salad",
    description:
      "Chopped tomatoes, cucumber, onion, green peppers and olives topped with a slab of feta on a plate.",
    image: "/foods/greek-salad.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Greece_Food_Horiatiki.JPG",
    creator: "User:Jpatokal",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    attribution: "Greek salad — User:Jpatokal (CC BY-SA 4.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "burger",
    name: "Cheeseburger",
    description:
      "A cooked meat patty with cheese, lettuce and tomato held between the two halves of a bread bun. Fries are served alongside.",
    image: "/foods/burger.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:RedDot_Burger.jpg",
    creator: "Hongreddotbrewhouse",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    attribution: "Hamburger — Hongreddotbrewhouse (CC BY-SA 3.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "hot-dog",
    name: "Hot dog",
    description:
      "A sausage laid inside a split soft bread bun and topped with a line of mustard.",
    image: "/foods/hot-dog.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Hot_dog_with_mustard.png",
    creator: "Czar, original photographed by Renee Comet",
    license: "Public domain",
    licenseUrl:
      "https://commons.wikimedia.org/wiki/File:Hot_dog_with_mustard.png",
    attribution:
      "Hot dog — Czar, original photographed by Renee Comet (Public domain)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "ice-cream-sandwich",
    name: "Ice cream sandwich",
    description:
      "A rectangular layer of vanilla ice cream between two thin chocolate biscuits.",
    image: "/foods/ice-cream-sandwich.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:IceCreamSandwich.jpg",
    creator: "Renee Comet (photographer)",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/File:IceCreamSandwich.jpg",
    attribution:
      "Ice cream sandwich — Renee Comet (photographer) (Public domain)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: true,
  },
  {
    id: "lasagna",
    name: "Lasagna",
    description:
      "Baked layers of flat pasta, tomato sauce, filling and melted cheese, served as a square on a plate without broth.",
    image: "/foods/lasagna.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lasagne_-_stonesoup.jpg",
    creator: "jules / stonesoup",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    attribution: "Lasagna — jules / stonesoup (CC BY 2.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: true,
  },
  {
    id: "mac-and-cheese",
    name: "Macaroni and cheese",
    description:
      "Cooked macaroni coated in a thick cheese sauce, topped with chopped green onions.",
    image: "/foods/mac-and-cheese.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Original_Mac_n_Cheese_.jpg",
    creator: "Texasfoodgawker",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    attribution: "Macaroni and cheese — Texasfoodgawker (CC BY-SA 4.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "nachos",
    name: "Nachos",
    description:
      "Tortilla chips topped with melted cheese, sliced olives and peppers on a plate.",
    image: "/foods/nachos.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nachos-cheese.jpg",
    creator: "chee.hong from Kuala Lumpur, Malaysia",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    attribution: "Nachos — chee.hong from Kuala Lumpur, Malaysia (CC BY 2.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: true,
  },
  {
    id: "pho",
    name: "Pho",
    description:
      "Rice noodles, meatballs and herbs in a bowl of broth with bean sprouts on top. The drink beside it is not part of the dish.",
    image: "/foods/pho.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bowl_of_Meatball_pho.jpg",
    creator: "SerraKnightz",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    attribution: "Pho — SerraKnightz (CC BY 4.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "pizza",
    name: "Pizza",
    description:
      "A round baked bread crust topped with tomato sauce, cheese and vegetables, cut into triangular slices.",
    image: "/foods/pizza.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pizza-3007395.jpg",
    creator: "igorovsyannykov",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    attribution: "Pizza — igorovsyannykov (CC0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: true,
  },
  {
    id: "ramen",
    name: "Ramen",
    description:
      "Wheat noodles, sliced pork, seaweed and fish cake in a bowl of broth.",
    image: "/foods/ramen.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Shoyu_Ramen%EF%BC%88Tokyo_Ramen%EF%BC%89_-_01.jpg",
    creator: "Quercus acuta",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    attribution: "Ramen — Quercus acuta (CC BY-SA 4.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "spaghetti",
    name: "Spaghetti",
    description:
      "Long pasta strands on a plate topped with thick tomato sauce, grated cheese and a parsley garnish.",
    image: "/foods/spaghetti.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Spaghetti_al_Pomodoro.JPG",
    creator: "Benreis",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    attribution: "Spaghetti — Benreis (CC BY 3.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "sushi",
    name: "Sushi",
    description:
      "An assortment of rice topped with fish and seafood alongside rice rolls wrapped in seaweed, arranged on a platter.",
    image: "/foods/sushi.webp",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sushi_platter.jpg",
    creator: "chidorian from Japan",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    attribution: "Sushi — chidorian from Japan (CC BY-SA 2.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: true,
  },
  {
    id: "tacos",
    name: "Tacos",
    description:
      "Open corn tortillas folded around cooked meat, chopped onion and herbs, served on a plate.",
    image: "/foods/tacos.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:001_Tacos_de_carnitas,_carne_asada_y_al_pastor.jpg",
    creator: "Larry Miller",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    attribution: "Taco — Larry Miller (CC BY-SA 2.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "waffle",
    name: "Waffle",
    description:
      "Golden waffles stacked on a plate with sliced strawberries and a light dusting of sugar.",
    image: "/foods/waffle.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Waffles_with_Strawberries.jpg",
    creator: "Parkerman & Christie from San Diego, USA",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    attribution:
      "Waffle — Parkerman & Christie from San Diego, USA (CC BY 2.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: true,
  },
  {
    id: "chicken-noodle",
    name: "Chicken noodle soup",
    description:
      "Pieces of chicken, noodles, carrots and vegetables served in a bowl of broth.",
    image: "/foods/chicken-noodle.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chicken_Noodle_Soup.jpg",
    creator: "Hoyabird8",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    attribution: "Chicken soup — Hoyabird8 (CC BY-SA 3.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: false,
  },
  {
    id: "dumplings",
    name: "Dumplings",
    description:
      "Pleated dough wrappers enclosing filling, boiled and served on a plate with dipping sauce alongside, without broth.",
    image: "/foods/dumplings.webp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%E5%8F%B0%E7%81%A3%E5%8D%97%E6%8A%95%E8%8D%89%E5%B1%AF%E6%B0%B4%E9%A4%83Nantou,_Taiwan_Caotun_dumplings.jpg",
    creator: "Yeepunchmen",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    attribution: "Jiaozi — Yeepunchmen (CC BY-SA 4.0)",
    modifications:
      "Resized and converted to WebP. Displayed with a crop in game cards.",
    debatable: true,
  },
];
