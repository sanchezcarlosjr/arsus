package infraestructure

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

var Translation TranslationRepository

type TranslationRepository struct {
	Title            string          `json:"title"`
	Instruction      string          `json:"instruction"`
	PositiveFeedback string          `json:"positiveFeedback"`
	TryAgain         string          `json:"tryAgain"`
	Yes              map[string]bool `json:"yes"`
	No               map[string]bool `json:"no"`
	Previous         map[string]bool `json:"previous"`
	Maybe            map[string]bool `json:"maybe"`
	DatabaseURL      string          `json:"databaseURL"`
}

func NewTranslation() TranslationRepository {
	language := os.Getenv("questions_game_language")
	if language == "" {
		language = "en-US"
	}
	jsonFile, err := os.Open("translations/" + language + ".json")
	if err != nil {
		fmt.Println(err)
	}
	defer func(jsonFile *os.File) {
		_ = jsonFile.Close()
	}(jsonFile)
	byteValue, _ := ioutil.ReadAll(jsonFile)
	var translation TranslationRepository
	_ = json.Unmarshal(byteValue, &translation)
	return translation
}
