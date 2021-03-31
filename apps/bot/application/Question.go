package application

import (
	"DialogFlowFulfilment/domain"
	"DialogFlowFulfilment/infraestructure"
)

type Question struct {
	Response     string
	iteratorSize int
	ancestor     domain.Game
	Children     []domain.Game
}

func (receiver *Question) save(child domain.Game) {
	receiver.Children[receiver.iteratorSize] = child
	receiver.iteratorSize++
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
