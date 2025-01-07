package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username string             `json:"username"`
	Email    string             `json:"email"`
	Password string             `json:"password"`
	DarkMode bool               `json:"darkMode"`
}

type loginCreds struct {
	Username string `json:iden`
}

type Password struct {
	Password string `json:password`
}

var collection *mongo.Collection

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Loading mongodb uri
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

	// INIT APP
	app := fiber.New()

	// USING CORS
	app.Use(cors.New())

	app.Get("/users", getUsers)
	app.Post("/users", createUser)
	app.Delete("/users/:id", deleteUser)
	app.Post("/login", handleLogin)
	app.Get("/api/login", handleLoginApi)
	// for updation : _, err := collection.UpdateOne(context.Background(), filer, update) // filter = bson.M{"_id":objectID} // update = bson.M{"$set":bson.M{"darkMode" : false}}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}

func handleLogin(c *fiber.Ctx) error {
	creds := new(loginCreds)
	if err := c.BodyParser(creds); err != nil {
		return err
	}

	pwd := new(Password)
	if err := c.BodyParser(pwd); err != nil {
		return err
	}

	var result User
	err := collection.FindOne(context.Background(), creds).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(400).JSON(fiber.Map{"error": "No such user found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	bytePwd := []byte(pwd.Password)
	hashedPassword := []byte(result.Password)
	err = bcrypt.CompareHashAndPassword(hashedPassword, bytePwd)

	if err != nil {
		fmt.Println(err)
		return c.Status(400).JSON(fiber.Map{"error": "No such user found"})
	}

	// implementing JSON Web Tokens
	err = godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
		return c.Status(500).JSON(fiber.Map{"error": "Internal server error"})
	}
	secretKey := []byte(os.Getenv("SECRET_KEY"))

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": result.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		fmt.Println(err)
		return c.Status(500).JSON(fiber.Map{"error": "Internal server error"})
	}

	return c.Status(200).JSON(fiber.Map{"status": "ok", "token": tokenString})
}

func handleLoginApi(c *fiber.Ctx) error {

	// implementing JSON Web Tokens
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
		return c.Status(500).JSON(fiber.Map{"error": "Internal server error"})
	}
	secretKey := []byte(os.Getenv("SECRET_KEY"))

	token := c.Get("token")
	tokenForm, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid Token"})
	}
	if !tokenForm.Valid {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid Token"})
	}

	return c.Status(200).JSON(fiber.Map{"status": "ok"})

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
