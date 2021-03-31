package infraestructure

import (
	"DialogFlowFulfilment/domain"
	"cloud.google.com/go/firestore"
	"context"
	firebase "firebase.google.com/go/v4"
	"log"
	"os"
	"strconv"
)

type Firestore struct {
	client         *firestore.Client
	context        context.Context
	collection     string
	idFistDocument string
	documentData   map[string]interface{}
	previousData   map[string]interface{}
}

func NewFirestoreRepository(collection string) domain.DatabaseRepository {
	conf := &firebase.Config{ProjectID: os.Getenv("GOOGLE_CLOUD_PROJECT")}
	ctx := context.Background()
	app, err := firebase.NewApp(ctx, conf)
	if err != nil {
		log.Fatalf("firebase.NewApp: %v", err)
	}
	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalf("app.Firestore: %v", err)
	}
	return &Firestore{
		client,
		ctx,
		collection,
		"oKmiPVJUXM887aYTKYbK",
		nil,
		nil,
	}
}

func (receiver *Firestore) First() {
	snapshot, _ := receiver.client.Collection(receiver.collection).Doc(receiver.idFistDocument).Get(receiver.context)
	receiver.documentData = snapshot.Data()
}

func (receiver *Firestore) Previous() {
	receiver.documentData = receiver.previousData
}

func (receiver *Firestore) Next(response domain.UserResponse) {
	receiver.previousData = receiver.documentData
	newDocument := receiver.documentData[strconv.Itoa(int(response))].(string)
	snapshot, _ := receiver.client.Collection(receiver.collection).Doc(newDocument).Get(receiver.context)
	receiver.documentData = snapshot.Data()
}

func (receiver *Firestore) Actual() (string, domain.Discriminator) {
	return receiver.documentData["response"].(string), domain.Discriminator(receiver.documentData["discriminator"].(string))
}
