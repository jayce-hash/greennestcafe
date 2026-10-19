// Starting content for the site. Once the owner saves anything in /admin,
// the saved version (stored in Netlify Blobs) is used instead of this file.

const item = (name, price, desc = "", tag = "", featured = false) => ({ name, price, desc, tag, featured });

export const DEFAULT_CONTENT = {
  version: 1,
  business: {
    name: "Green Nest Cafe",
    tagline: "Sip, relax & reflect",
    intro:
      "A family-owned coffee shop in Bedford, Texas, serving espresso, matcha and hojicha lattes, Korean-inspired rice bowls, and scratch-made sandwiches.",
    street: "3708 Cheek Sparger Rd #110",
    city: "Bedford",
    state: "TX",
    zip: "76021",
    phone: "(682) 503-4019",
    email: "atgreennestcafe@gmail.com",
    instagram: "https://www.instagram.com/greennestcafe/",
    facebook: "https://www.facebook.com/p/Green-Nest-Cafe-61557108832495/",
    orderUrl: "",
  },
  announcement: { show: false, text: "" },
  hours: [
    { day: "Monday", open: "07:30", close: "17:00", closed: false },
    { day: "Tuesday", open: "07:30", close: "17:00", closed: false },
    { day: "Wednesday", open: "07:30", close: "17:00", closed: false },
    { day: "Thursday", open: "07:30", close: "17:00", closed: false },
    { day: "Friday", open: "07:30", close: "17:00", closed: false },
    { day: "Saturday", open: "07:30", close: "18:00", closed: false },
    { day: "Sunday", open: "08:00", close: "17:00", closed: false },
  ],
  services: ["Dine-in", "Takeout", "In-store pickup"],
  signature: {
    heading: "Signature drinks",
    intro: "House favorites, made to order. Most are best iced.",
  },
  menu: {
    heading: "Menu",
    note: "Prices subject to change. Please tell us about any allergies. Gluten-free bread +$1.75.",
    tabs: [
      {
        name: "Drinks",
        categories: [
          {
            name: "Signature Drinks",
            note: "12 / 16 / 20 oz",
            items: [
              item("Honey Lavender Latte", "$5.25 / 5.75 / 6.25", "Honey, lavender syrup, espresso, milk", "", true),
              item("Strawberry Matcha Latte", "$5.25 / 5.75 / 6.25", "Strawberry purée, matcha, milk", "Iced", true),
              item("Mango Coconut Hojicha", "$5.25 / 5.75 / 6.25", "Mango purée, coconut syrup, hojicha, milk", "Iced", true),
              item("Dalgona Latte", "$5.25 / 5.75 / 6.25", "Whipped coffee cream, caramel toffee, your choice of milk", "Iced", true),
              item("Citron Espresso Tonic", "$5.75", "Tonic water, cardamom, squeezed lemon, espresso. 16 oz", "Iced", true),
              item("Tiramisu Cold Brew", "$5.75 / 6.25 / 6.75", "Tiramisu syrup, cold foam, cold brew", "Iced", true),
              item("Honey Lemon Ginger Tea", "$5.95", "Homemade honey lemon ginger syrup. 16 oz", "", true),
              item("Matcha Cloud Iced Tea", "$5.25 / 5.75 / 6.25", "Matcha cold foam over an Earl Grey tea latte", "Iced", true),
            ],
          },
          {
            name: "Espresso",
            note: "8 oz hot, or 12 / 16 / 20 oz iced",
            items: [
              item("Double Shot", "$3"),
              item("Macchiato", "$3.25"),
              item("Cortado", "$3.75"),
              item("Flat White", "$4"),
              item("Americano", "$3.50 / 4 / 5.75"),
              item("Latte", "$4.25 / 4.50 / 4.75 / 5.25"),
            ],
          },
          {
            name: "Coffee",
            note: "",
            items: [item("Drip Coffee", "$3 / 3.50"), item("Pour Over", "$4.75", "12 oz"), item("Cold Brew", "$5.25 / 5.75 / 6.25")],
          },
          {
            name: "Other Lattes",
            note: "12 / 16 / 20 oz, iced only",
            items: [item("Matcha or Hojicha", "$4.75 / 5.25 / 5.75"), item("Ube", "$4.75 / 5.25 / 5.75"), item("Chai", "$5 / 5.50 / 6")],
          },
          {
            name: "Frappe",
            note: "16 / 20 oz",
            items: [item("Espresso, Matcha or Hojicha", "$6.25 / 6.75"), item("Chai, Ube, Vanilla or Mocha", "$6.25 / 6.75")],
          },
          {
            name: "Loose Leaf Tea",
            note: "",
            items: [
              item("Hot Tea", "$4", "Earl Grey, Rooibos (decaf), Chamomile (decaf), Green, Oolong, White"),
              item("Iced Tea", "$4", "Black Mango, Hibiscus Berry, Green"),
            ],
          },
        ],
      },
      {
        name: "Food",
        categories: [
          {
            name: "Breakfast",
            note: "Until 12 pm daily",
            items: [
              item("Egg & Cheese Sandwich", "$6.25", "Egg and cheddar on toasted sourdough"),
              item("Avocado Toast", "$7.25", "Avocado, chili pepper, and flaky salt on toasted sourdough"),
              item("Spicy Hummus, Egg & Cheese", "$7.25", "Egg and Swiss on toasted sourdough"),
              item("Loaded Lox", "$12.95", "Smoked salmon, cream cheese, dill, capers, red onion, tomato, chili, flaky salt, and olive oil on sourdough"),
            ],
          },
          {
            name: "Rice Bowls",
            note: "",
            items: [
              item("Bulgogi Rice Bowl", "$12.95", "Mixed greens, cherry tomato, red onion, over-easy egg, mayo, and BBQ soy garlic sauce"),
              item("Spicy Pork Rice Bowl", "$12.95", "Mixed greens, cherry tomato, red onion, over-easy egg, mayo, and comeback sauce"),
            ],
          },
          {
            name: "Hot Sandwiches",
            note: "Served with chips or mixed greens",
            items: [
              item("Chicken Pesto", "$10.95", "Pesto, tomato, basil, fresh mozzarella, and chicken on sourdough"),
              item("Cubano", "$11.95", "Pulled pork, roasted ham, pickles, yellow mustard, and mayo on ciabatta"),
              item("Italian", "$11.95", "Salami, roasted ham, roasted red pepper, and banana peppers on ciabatta"),
              item("Tuna Melt", "$10.95", "Tuna salad, tomato, pickles, and cheddar on sourdough"),
              item("Veggie Hummus", "$10.95", "Red pepper, red onion, mushroom, zucchini, hummus, basil, and mozzarella on sourdough"),
              item("Spicy Jelly Grilled Cheese", "$10.95", "Spicy jelly, roasted ham, pickles, cheddar, and Swiss on sourdough"),
            ],
          },
          {
            name: "Salads",
            note: "Add chicken +$2.85",
            items: [
              item("Greek Salad", "$9.75"),
              item("Cobb Salad", "$10.25"),
              item("Garden Salad", "$9.75", "Mixed greens, red onion, cucumber, shredded cheese, and croutons. Choice of balsamic, red wine, lime ranch, or Italian"),
            ],
          },
          {
            name: "Add-Ons",
            note: "",
            items: [
              item("Feta", "+$0.75"),
              item("Harissa Sauce", "+$0.75"),
              item("Sliced Tomato", "+$0.75"),
              item("Cherry Tomato", "+$1"),
              item("Bacon", "+$1.50"),
              item("Smoked Ham", "+$1.50"),
              item("Avocado", "+$1.75"),
              item("Two Cracked Eggs", "+$2.25"),
            ],
          },
        ],
      },
      {
        name: "Dessert & Pastries",
        categories: [
          {
            name: "Dessert",
            note: "",
            items: [
              item("Tiramisu", "$6.25", "Made in-house. Espresso or matcha"),
              item("Affogato", "$5.50", "Espresso, matcha, hojicha, or ube"),
            ],
          },
          {
            name: "Pastries",
            note: "From a local family-owned bakery",
            items: [item("Cookies", "$2.25"), item("Scone", "$3.75")],
          },
        ],
      },
    ],
  },
  story: {
    heading: "A family-owned cafe in Bedford",
    body:
      "Green Nest Cafe is a neighborhood coffee shop in the Shops at Cheek Sparger. Come in for an espresso, a matcha or hojicha latte, or a rice bowl, and stay as long as you like.\n\n" +
      "We wanted a place that feels like home: green, calm, and welcoming to everyone who walks in.",
    facts: [
      "Espresso from Eiland Coffee Roasters, a local roaster",
      "Tiramisu made in-house",
      "Cookies, scones, and bread from a local family-owned bakery",
    ],
  },
  gallery: {
    heading: "Around the cafe",
    intro: "",
    categories: ["Drinks", "Food", "Dessert", "The Cafe"],
  },
  reviews: {
    heading: "What guests say",
    rating: "4.9",
    ratingSource: "on Google",
    reviewsUrl: "https://www.google.com/maps/search/?api=1&query=Green+Nest+Cafe+3708+Cheek+Sparger+Rd+Bedford+TX",
    items: [],
  },
};

// No starting photos: the owner adds her own through /admin.
export const DEFAULT_PHOTOS = [];
