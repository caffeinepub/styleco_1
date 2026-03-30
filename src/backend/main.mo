import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

actor {
  type Product = {
    id : Nat;
    name : Text;
    price : Int;
    category : Text;
    description : Text;
    imageUrl : Text;
  };

  module Product {
    public func compare(a : Product, b : Product) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  let products = Map.empty<Nat, Product>();
  let newsletterSubscriptions = List.empty<Text>();

  func seedProducts() {
    let seedData : [Product] = [
      {
        id = 1;
        name = "Classic White T-Shirt";
        price = 2500;
        category = "Essentials";
        description = "Premium cotton white tee with ribbed neckline. Slim fit and super soft.";
        imageUrl = "/images/white-shirt.jpg";
      },
      {
        id = 2;
        name = "Relaxed Fit Jeans";
        price = 4500;
        category = "Men's";
        description = "Dark blue denim jeans with relaxed fit. Durable and comfortable.";
        imageUrl = "/images/relaxed-jeans.jpg";
      },
      {
        id = 3;
        name = "Floral Summer Dress";
        price = 6500;
        category = "Women's";
        description = "Lightweight cotton dress perfect for summer. Beautiful floral print.";
        imageUrl = "/images/summer-dress.jpg";
      },
      {
        id = 4;
        name = "Athletic Sweater";
        price = 3500;
        category = "New Arrivals";
        description = "Moisture-wicking athletic sweater. Great for workouts or everyday wear.";
        imageUrl = "/images/athletic-sweater.jpg";
      },
      {
        id = 5;
        name = "Premium Chinos";
        price = 5999;
        category = "Men's";
        description = "Stretch fit chinos for dressy or casual wear. Bestselling style.";
        imageUrl = "/images/premium-chinos.jpg";
      },
      {
        id = 6;
        name = "Graphic Tee Bundle";
        price = 3400;
        category = "Sale";
        description = "Set of 3 printed tees in assorted designs. Classic crew neck style.";
        imageUrl = "/images/graphic-tee-bundle.jpg";
      },
      {
        id = 7;
        name = "Lightweight Parka Jacket";
        price = 8900;
        category = "Men's";
        description = "Water-resistant jacket with adjustable hood. Perfect for transitional weather.";
        imageUrl = "/images/parka-jacket.jpg";
      },
      {
        id = 8;
        name = "Slim Fit Blazer";
        price = 10900;
        category = "Men's";
        description = "Tailored blazer for work or formal occasions. High-quality craftsmanship.";
        imageUrl = "/images/slim-fit-blazer.jpg";
      },
      {
        id = 9;
        name = "Cozy Knit Cardigan";
        price = 4700;
        category = "Women's";
        description = "Soft and warm open-front cardigan. Perfect for layering.";
        imageUrl = "/images/knit-cardigan.jpg";
      },
      {
        id = 10;
        name = "Essential Leggings";
        price = 2900;
        category = "Essentials";
        description = "High waist cotton leggings. Ultimate comfort and style.";
        imageUrl = "/images/essential-leggings.jpg";
      },
    ];

    for (product in seedData.values()) {
      products.add(product.id, product);
    };
  };

  // Seed products on canister init
  seedProducts();

  // Query all products
  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getProductById(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Filter products by category (case-insensitive)
  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        Text.equal(
          product.category.toLower(),
          category.toLower(),
        );
      }
    ).sort();
  };

  public shared ({ caller }) func subscribeNewsletter(email : Text) : async () {
    if (newsletterSubscriptions.contains(email)) {
      Runtime.trap("Email already subscribed to newsletter");
    };
    if (
      0 == email.trim(#char ' ').size()
    ) {
      Runtime.trap("Cannot subscribe an empty email address");
    };
    newsletterSubscriptions.add(email);
  };
};
