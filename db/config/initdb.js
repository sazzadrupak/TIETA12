print(
  "Start #################################################################"
);

db = db.getSiblingDB("webstore");

db = db.getSiblingDB("webstore_dev");

db = db.getSiblingDB("webstore_test");

print("END #################################################################");
