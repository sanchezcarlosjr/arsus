package infraestructure

import (
	"DialogFlowFulfilment/domain"
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
)

type Firestore struct {
	docs   []*firestore.DocumentSnapshot
	length int
}

func NewFirestoreRepository() {
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
	_, err = client.Collection("20QuestionsGame").Documents(ctx).GetAll()
	if err != nil {
		log.Fatalf("Load 20QuestionsGame: %v", err)
	}
}

func (receiver *Firestore) Actual() (string, domain.Discriminator) {
	if !receiver.docs[0].Exists() {
		return "", ""
	}
	data := receiver.docs[0].Data()
	return data["response"].(string), domain.Discriminator(data["discriminator"].(string))
}

func (receiver *Firestore) NextLevel() {

}

func (receiver *Firestore) NextIndex() {}

func (receiver *Firestore) HasNext() bool {
	return false
}
