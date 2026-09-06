export const PHONE_DISPLAY = "04XX XXX XXX";
export const EMAIL = "hello@kishuka.com.au";
export const AREA = "Darwin, Palmerston and rural NT";
export const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps/search/?api=1&query=KISHUKA+Steam+and+Clean+Darwin+NT";

export const SERVICES = [
  {
    id: "carpet",
    title: "Carpet steam",
    blurb: "Heat steam plus vacuum extraction for Darwin humidity, red dust, and family traffic.",
    image: "/images/steam_carpet_living_room.png",
  },
  {
    id: "upholstery",
    title: "Upholstery",
    blurb: "Sofas, chairs, and mattresses lifted with a handheld steam wand.",
    image: "/images/steam_upholstery_sofa.png",
  },
  {
    id: "house",
    title: "Home clean",
    blurb: "Kitchens, bathrooms, floors, and the tropical-care extras wet season needs.",
    image: "/images/steam_crew_hallway.png",
  },
  {
    id: "detail",
    title: "Deep extraction",
    blurb: "Truck-grade wand work that pulls soil out of the pile, not just off the top.",
    image: "/images/steam_wand_closeup.png",
  },
  {
    id: "tiles",
    title: "Tiles and grout",
    blurb: "Hard floors, bathrooms, and outdoor tiles that hold Darwin dust.",
  },
  {
    id: "lease",
    title: "End of lease",
    blurb: "A sparkle clean written for NT agent inspections, including carpets.",
  },
];

export const OFFERS = [
  {
    id: "first",
    kicker: "New Darwin homes",
    title: "$40 off first steam",
    detail: "Book your first carpet steam with KISHUKA and we take $40 off the visit.",
    tone: "green",
  },
  {
    id: "refer",
    kicker: "Tell a neighbour",
    title: "25% off next clean",
    detail: "When a friend you refer books a paid job, your next service drops 25%.",
    tone: "yellow",
  },
  {
    id: "midweek",
    kicker: "Tue to Thu",
    title: "Fabric protect included",
    detail: "Midweek carpet jobs over 40 sqm get a complimentary protector pass.",
    tone: "blue",
  },
];

export const RATES = [
  {
    group: "Carpet steam",
    note: "Heat steam and vacuum extraction. Fast-dry method for Top End humidity.",
    rows: [
      { item: "Bedroom", price: "$55" },
      { item: "Lounge or living", price: "$85" },
      { item: "Hall or stairs", price: "$45" },
      { item: "3-bed home package", price: "from $189" },
    ],
  },
  {
    group: "Upholstery and mattress",
    note: "Handheld steam, stain lift, and a hygienic finish.",
    rows: [
      { item: "3-seater sofa", price: "$99" },
      { item: "Armchair", price: "$49" },
      { item: "Queen mattress", price: "$79" },
      { item: "Car seats (whole cabin)", price: "$89" },
    ],
  },
  {
    group: "Home and lease",
    note: "General cleaning plus steam add-ons. Quotes confirmed on site.",
    rows: [
      { item: "Studio home clean", price: "$149" },
      { item: "3-bed home clean", price: "$229" },
      { item: "End-of-lease sparkle", price: "from $349" },
      { item: "Tile and grout (bathroom)", price: "$79" },
    ],
  },
];

export const SUBURBS = [
  "Darwin City",
  "Nightcliff",
  "Casuarina",
  "Palmerston",
  "Humpty Doo",
  "Howard Springs",
  "Rural NT",
];

export type Review = {
  id: string;
  name: string;
  suburb: string;
  rating: number;
  service: string;
  message: string;
  createdAt: string;
};

export const SEED_REVIEWS: Review[] = [
  {
    id: "seed-1",
    name: "Priya M.",
    suburb: "Nightcliff",
    rating: 5,
    service: "Carpet steam",
    message:
      "Red dust was deep in the lounge pile. After the steam pass the room smelled clean, not wet. They were gone before school pickup.",
    createdAt: "2026-08-12",
  },
  {
    id: "seed-2",
    name: "Daniel K.",
    suburb: "Palmerston",
    rating: 5,
    service: "Home clean",
    message:
      "Kishan and Binuka treated the house like their own. Bathroom grout and the hallway runner both look new.",
    createdAt: "2026-08-21",
  },
  {
    id: "seed-3",
    name: "Amina S.",
    suburb: "Casuarina",
    rating: 4,
    service: "Upholstery",
    message:
      "Sofa steam took the pet marks out. They explained drying time for our humidity, which I needed.",
    createdAt: "2026-09-01",
  },
];
