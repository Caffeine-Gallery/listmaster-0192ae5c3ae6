import Bool "mo:base/Bool";
import Func "mo:base/Func";
import Int "mo:base/Int";
import Text "mo:base/Text";

import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor {

  // Define the Item record
  type Item = {
    id: Nat;
    name: Text;
    completed: Bool;
  };

  // Stable variable to store the list of items
  stable var items: [Item] = [];

  // Function to add a new item
  public func addItem(name: Text) : async Nat {
    let newItem: Item = {
      id = Nat.fromInt(items.size());
      name = name;
      completed = false;
    };
    items := Array.append<Item>(items, [newItem]);
    return newItem.id;
  };

  // Function to get all items
  public query func getItems() : async [Item] {
    return items;
  };

  // Function to mark an item as completed or not completed
  public func toggleItem(id: Nat) : async Bool {
    var found = false;
    items := Array.map<Item, Item>(items, func (item) {
      if (item.id == id) {
        found := true;
        { id = item.id; name = item.name; completed = not item.completed };
      } else {
        item;
      }
    });
    return found;
  };

  // Function to delete an item
  public func deleteItem(id: Nat) : async Bool {
    let originalSize = items.size();
    items := Array.filter<Item>(items, func (item) {
      item.id != id
    });
    return items.size() != originalSize;
  };
};
