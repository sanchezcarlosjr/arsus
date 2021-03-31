package application

import (
	"DialogFlowFulfilment/domain"
	"DialogFlowFulfilment/infraestructure"
)

type Question struct {
	Response string
	ancestor domain.Game
	Children []domain.Game
}

func newQuestion(ancestor domain.Game, response string) *Question {
	return &Question{Response: response, ancestor: ancestor, Children: defaultChildren()}
}

func defaultChildren() []domain.Game {
	var t []domain.Game
	for index := 0; index < 2; index++ {
		t = append(t, nil)
	}
	return t
}

func (receiver *Question) Reply() {
	userResponse := infraestructure.StreamRepository().Interact(receiver.Response)
	if domain.PREVIOUS == userResponse {
		infraestructure.DatabaseRepository().Previous()
		receiver.ancestor.Reply()
		return
	}
	infraestructure.DatabaseRepository().Next(userResponse)
	receiver.Children[userResponse] = factoryResponseType(receiver)
	child := receiver.Children[userResponse]
	child.Reply()
}
