package application

import (
	"DialogFlowFulfilment/domain"
	"DialogFlowFulfilment/infraestructure"
)

type GameManger struct {
	length       int
	SizeChildren int
}

func (receiver *GameManger) Start() {
	tree := factoryResponseType(nil)
	tree.Reply()
}

func factoryResponseType(ancestor domain.Game) domain.Game {
	response, discriminator := infraestructure.DatabaseRepository().Actual()
	switch discriminator {
	case domain.QUESTION:
		question := &Question{Response: response, ancestor: ancestor, Children: defaultChildren()}
		return question
	case domain.ANSWER:
		return &Answer{Response: response}
	}
	return nil
}

func defaultChildren() []domain.Game {
	var t []domain.Game
	for index := 0; index < 2; index++ {
		t = append(t, nil)
	}
	return t
}
