package application

import (
	"DialogFlowFulfilment/domain"
	"DialogFlowFulfilment/infraestructure"
)

type Answer struct {
	Response string
	ancestor domain.Game
}

func (receiver *Answer) Reply() {
	infraestructure.StreamRepository().InteractAsAnswer(receiver.Response)
}

func (receiver *Answer) SetAncestor(game domain.Game) {
	receiver.ancestor = game
}
