package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username string             `json:"username"`
	Email    string             `json:"email"`
	Password string             `json:"password"`
	DarkMode bool               `json:"darkMode"`
}

var collection *mongo.Collection

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to Database")

	collection = client.Database("db1").Collection("users")
	app := fiber.New()

	app.Get("/users", getUsers)
	app.Post("/users", createUser)
	app.Delete("/users/:id", deleteUser)
	// for updation : _, err := collection.UpdateOne(context.Background(), filer, update) // filter = bson.M{"_id":objectID} // update = bson.M{"$set":bson.M{"darkMode" : false}}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}

func getUsers(c *fiber.Ctx) error {
	var users []User

	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var user User
		if err := cursor.Decode(&user); err != nil {
			return err
		}
		users = append(users, user)
	}

	return c.JSON(users)
}

func createUser(c *fiber.Ctx) error {
	user := new(User)

	if err := c.BodyParser(user); err != nil {
		return err
	}

	if user.Username == "" {
		return c.Status(400).JSON(fiber.Map{"error": "username can't be empty"})
	}
	if user.Email == "" {
		return c.Status(400).JSON(fiber.Map{"error": "email can't be empty"})
	}

	insRes, err := collection.InsertOne(context.Background(), user)
	if err != nil {
		return err
	}
	user.ID = insRes.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(user)
}

func deleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"err": "Invalid User ID"})
	}

	filter := bson.M{"_id": objectId}
	_, err = collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"deleted": true})
}
