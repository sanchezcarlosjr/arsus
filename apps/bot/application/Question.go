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
		receiver.ancestor.Reply()
		return
	}
	child := receiver.Children[userResponse]
	child.Reply()
}

func (receiver *Question) setAncestor(game domain.Game) {
	receiver.ancestor = game
}
